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
- Gmail: Send/search/read emails
- Drive: Search/download/upload files
- Docs: Create/update/read documents
- Sheets: Read/write/update spreadsheet data
- Calendar: Create/list/delete events

CONVERSATION GUIDELINES:
1. Be friendly, helpful, and concise.
2. Always respond in natural language in the "message" field (not just JSON keys).
3. For greetings or generic questions, reply conversationally about AURA's capabilities and how you can help.
4. When the user asks for an ACTIONABLE TASK (i.e., something that could be done via Google Workspace APIs), you MUST suggest at least one task in "suggestedTasks" with a clear, executable "prompt".
5. If the request is AMBIGUOUS (e.g., "show my drive file"), include a clarifying question inside "message" and, if reasonable, a best-guess suggested task.
6. For multi-intent requests (e.g., "show my latest sales report, summarize it, and send to X"), you may suggest a single combined task or multiple suggested tasks.

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
    console.error('/api/chat error', error);
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message:
            'Sorry, I had trouble processing that right now. You can ask me about Gmail, Drive, Docs, Sheets, or Calendar — or try again in a moment.',
        },
      },
      { status: 200 }
    );
  }
}
