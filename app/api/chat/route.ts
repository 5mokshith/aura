import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '@/app/lib/env';
import { ApiResponse } from '@/app/types/api';

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
    const { message, userId, conversationHistory } = body || {};

    if (!message || !userId) {
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
- Gmail: Send/search emails, read messages
- Drive: Search/download/upload files
- Docs: Create/update/read documents
- Sheets: Read/write spreadsheet data
- Calendar: Create/list/delete events

CONVERSATION GUIDELINES:
1. Be friendly, helpful, and concise
2. For greetings, introduce yourself briefly
3. For questions, explain what you can do
4. When you detect an ACTIONABLE TASK, respond with:
   - A confirmation message
   - A suggestedTask object with the task details

TASK DETECTION:
An actionable task is a request that requires Google Workspace API calls.
Examples:
- "hi" → NO TASK (just greeting)
- "what can you do?" → NO TASK (just info)
- "search my drive" → TASK (needs clarification, but still actionable)
- "search my drive for budget reports" → TASK (complete and actionable)
- "send email to john@example.com" → TASK (actionable)

RESPONSE FORMAT:
Return STRICT JSON ONLY. Use one of:
{
  "message": string
}
OR
{
  "message": string,
  "suggestedTask": {
    "description": string,
    "prompt": string
  }
}`;

    const historyText = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-12)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'AURA'}: ${m.content}`)
          .join('\n')
      : '';

    const userTurn = `User: ${message}`;

    const content = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'user', parts: [{ text: historyText }] },
      { role: 'user', parts: [{ text: userTurn }] },
    ];

    const result = await model.generateContent(content as any);
    const text = result.response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    const payload = JSON.parse(jsonText);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: String(payload.message || ''),
          suggestedTask: payload.suggestedTask ? {
            description: String(payload.suggestedTask.description || ''),
            prompt: String(payload.suggestedTask.prompt || ''),
          } : undefined,
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
