import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '@/app/lib/env';

const envConfig = getEnv();
const genAI = new GoogleGenerativeAI(envConfig.llm.geminiApiKey!);
const model = genAI.getGenerativeModel({
  model: envConfig.llm.geminiModel || 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

export async function GET(_request: NextRequest) {
  try {
    const prompt = `You are helping generate copy for an app setup page for AURA (Agentic Unified Reasoning Assistant), an AI agent that orchestrates Gmail, Drive, Docs, Sheets, and Calendar.

Output STRICTLY valid JSON in this exact shape without any extra commentary:
{
  "headline": string,
  "tagline": string,
  "description": string,
  "integrations": [
    { "name": "Gmail" | "Drive" | "Docs" | "Sheets" | "Calendar", "description": string }
  ],
  "features": string[]
}

Rules:
- Use clear, concise marketing copy.
- Integrations must be a subset of [Gmail, Drive, Docs, Sheets, Calendar].
- Features should be 4-6 short capability bullets.
`;

    const result = await model.generateContent([prompt]);
    const text = result.response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    const payload = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      data: payload,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error?.message || 'Failed to generate setup content',
        },
        // Provide a minimal safe fallback to avoid breaking the UI.
        data: {
          headline: 'Welcome to AURA',
          tagline: 'Agentic Unified Reasoning Assistant',
          description:
            'An AI-powered agent system that integrates with Google Workspace to automate real-world workflows through natural language.',
          integrations: [
            { name: 'Gmail', description: 'Send and search emails' },
            { name: 'Drive', description: 'Search and manage files' },
            { name: 'Docs', description: 'Create and edit documents' },
            { name: 'Sheets', description: 'Analyze spreadsheet data' },
            { name: 'Calendar', description: 'Schedule and manage events' },
          ],
          features: [
            'Natural language instructions',
            'Automatic task planning',
            'Multi-step workflow execution',
            'Automatic verification & correction',
            'Cross-app integrations',
          ],
        },
      },
      { status: 200 }
    );
  }
}
