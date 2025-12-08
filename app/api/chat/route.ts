import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '@/app/lib/env';
import { ApiResponse } from '@/app/types/api';
import { createServiceClient } from '@/app/lib/supabase/server';

const env = getEnv();
const genAI = new GoogleGenerativeAI(env.llm.geminiApiKey!);
const model = genAI.getGenerativeModel({
  model: env.llm.geminiModel || 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.6,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, conversationHistory, conversationId: existingConversationId } = body || {};

    const cookieUserId = request.cookies.get('aura_user_id')?.value;
    const usedUserId = (userId as string | undefined) || cookieUserId || '';

    if (!message || !usedUserId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Missing required fields: message, userId' },
        },
        { status: 400 }
      );
    }

    const systemPrompt = `You are AURA (Agentic Unified Reasoning Assistant), an AI assistant for Google Workspace.

CAPABILITIES:
- Gmail: Send/search/read emails (attachments are not currently supported; you cannot automatically attach Drive files or other files to outgoing emails.)
- Drive: Search/download/upload files
- Docs: Create/update/read documents
- Sheets: Read/write/update spreadsheet data
- Calendar: Create/list/delete events

CONVERSATION GUIDELINES:
1. Be friendly, helpful, and concise.
2. Always respond in natural language in the "message" field (not just JSON keys).
3. For greetings or generic questions, reply conversationally about AURA's capabilities and how you can help.
4. When the user asks for an ACTIONABLE TASK (i.e., something that could be done via Google Workspace APIs), you MUST suggest at least one task in "suggestedTasks" with a clear, executable "prompt".
5. If the request is AMBIGUOUS OR MISSING REQUIRED DETAILS for any task that depends on a specific resource (for example, an email thread, document, file, spreadsheet, or calendar event), you MUST treat it as incomplete. In your "message", explicitly ask a clarifying question (for example, which document, which file, which email, etc.) and DO NOT include any "suggestedTasks" yet. Do not propose tasks that create placeholder Docs, Sheets, or other resources just to acknowledge the request.
6. For multi-intent requests (e.g., "show my latest sales report, summarize it, and send to X"), you may suggest a single combined task or multiple suggested tasks, but only once the required details for each task are known.
7. For requests to write or send an email, always ensure you know the actual recipient email address before suggesting a Gmail task:
   - If the user only gives a name (for example, "Madhav") and no email address is visible in the recent conversation history, treat the request as incomplete. In your "message", explicitly ask for the email address (for example, "What is Madhav's email address?") and DO NOT include any "suggestedTasks" yet.
   - Once the user provides the email address, respond acknowledging it and THEN include a "suggestedTasks" entry whose "prompt" contains the concrete email address, subject, and what the body should contain.
8. When you include a Gmail send suggested task, make sure the "prompt" clearly specifies the recipient email address, the subject, and a brief description of what the body should say so the planner can generate a complete Gmail send step.
9. For requests to create calendar events, treat the event name/title and the date/time as required details. If either is missing or unclear, ask the user for that information in the "message" and DO NOT include any "suggestedTasks" yet. Once the user has provided a clear title and date/time, respond acknowledging it and include a "suggestedTasks" entry whose "prompt" describes the calendar event with explicit title, date, time, and any known attendees.

RESPONSE FORMAT (STRICT JSON ONLY):
Either:
{
  "message": string
}
Or:
{
  "message": string,
  "suggestedTasks": [
    { "description": string, "prompt": string }
  ]
}
Notes:
- Do NOT wrap the JSON in markdown or code fences.
- Do NOT add any text before or after the JSON object.
- "message" should include any clarifying questions as needed.
- If only one task is suggested, you may still use "suggestedTasks" with a single element.

EXAMPLES

Example 1 — Generic question (no task):
User: "What can you do?"
Assistant JSON:
{
  "message": "I'm AURA, an AI assistant that can read and send Gmail, search your Drive, create Docs, update Sheets, and manage Calendar events. Ask me to do something like 'summarize my latest sales report and email it to my manager.'"
}

Example 2 — Actionable request with suggested task:
User: "Send a reminder email to my team about tomorrow's meeting."
Assistant JSON:
{
  "message": "I can draft and send that reminder email for you. I'll use your connected Gmail account.",
  "suggestedTasks": [
    {
      "description": "Send reminder email about tomorrow's meeting to your team",
      "prompt": "Send a reminder email to my team about tomorrow's meeting using Gmail."
    }
  ]
}`;

    const historyText = Array.isArray(conversationHistory)
      ? conversationHistory
        .slice(-12)
        .map((m: any) => `${m.role === 'user' ? 'User' : 'AURA'}: ${m.content}`)
        .join('\n')
      : '';

    const userTurn = `User: ${message}`;

    // Ensure conversation exists and persist the user message
    const supabase = createServiceClient();

    let conversationId = existingConversationId as string | undefined;
    if (!conversationId && usedUserId) {
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert({ user_id: usedUserId, title: (message as string).slice(0, 80) })
        .select('id')
        .single();
      if (!convErr) {
        conversationId = conv?.id as string | undefined;
      }
    }

    // Insert user message if we have a valid conversation
    if (conversationId && usedUserId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: usedUserId,
        role: 'user',
        type: 'chat',
        content: String(message),
        created_at: new Date().toISOString(),
      });
    }

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...(historyText ? [{ role: 'user', parts: [{ text: historyText }] }] : []),
      { role: 'user', parts: [{ text: userTurn }] },
    ];

    const result = await model.generateContent({ contents } as any);
    const text = result.response.text() || '';

    let payload: any;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      payload = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse /api/chat model JSON, using raw text instead:', parseError);
      payload = {
        message:
          text.trim() ||
          'Sorry, I could not parse the model response. Please try asking your question again.',
      };
    }

    const suggestedTasks = Array.isArray(payload.suggestedTasks)
      ? payload.suggestedTasks
      : payload.suggestedTask
        ? [payload.suggestedTask]
        : [];

    // Insert assistant message
    if (conversationId && usedUserId) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: usedUserId,
        role: 'assistant',
        type: 'chat',
        content: String(payload.message || ''),
        suggested_tasks: suggestedTasks.length ? suggestedTasks : null,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: String(payload.message || ''),
          // Backward-compatible single suggestion
          suggestedTask: suggestedTasks[0]
            ? {
              description: String(suggestedTasks[0].description || ''),
              prompt: String(suggestedTasks[0].prompt || ''),
            }
            : undefined,
          // New multi-suggestion field (front-end may optionally use this)
          suggestedTasks: suggestedTasks.map((t: any) => ({
            description: String(t.description || ''),
            prompt: String(t.prompt || ''),
          })),
          conversationId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ /api/chat error - FULL DETAILS:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      details: error?.details,
      fullError: error,
    });
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message:
            `Sorry, I had trouble processing that right now. You can ask me about Gmail, Drive, Docs, Sheets, or Calendar — or try again in a moment. ${process.env.NODE_ENV === 'development' ? `(Error: ${error?.message})` : ''}`,
        },
      },
      { status: 200 }
    );
  }
}
