import { GoogleGenerativeAI } from '@google/generative-ai';
import { TaskPlan, PlanStep } from '@/app/types/agent';
import { GoogleService } from '@/app/types/chat';
import { getEnv } from '@/app/lib/env';

const envConfig = getEnv();
const genAI = new GoogleGenerativeAI(envConfig.llm.geminiApiKey!);

export class PlannerAgent {
  private model;
  private modelName: string;

  constructor() {
    this.modelName = envConfig.llm.geminiModel || 'gemini-2.0-flash-exp';
    this.model = genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Decompose a user prompt into executable steps with automatic retry and fallback
   */
  async planTask(
    prompt: string,
    userId: string,
    userTimeZone?: string,
    userLocalDate?: string
  ): Promise<TaskPlan> {
    const maxRetries = 3;
    const fallbackModel = 'gemini-2.0-flash-exp'; // More stable fallback
    let lastError: Error | null = null;

    // Try with primary model
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const plan = await this.executePlanTask(prompt, userId, userTimeZone, userLocalDate, this.model);
        return plan;
      } catch (error) {
        lastError = error as Error;
        const isOverloaded = error instanceof Error &&
          (error.message.includes('503') || error.message.includes('overloaded'));

        if (isOverloaded && attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Model overloaded, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If still overloaded after retries, try fallback model
        if (isOverloaded && this.modelName !== fallbackModel) {
          console.log(`Primary model still overloaded, trying fallback model: ${fallbackModel}`);
          try {
            const fallback = genAI.getGenerativeModel({
              model: fallbackModel,
              generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
              },
            });
            const plan = await this.executePlanTask(prompt, userId, userTimeZone, userLocalDate, fallback);
            return plan;
          } catch (fallbackError) {
            console.error('Fallback model also failed:', fallbackError);
            throw fallbackError;
          }
        }

        // Non-retryable error or max retries exceeded
        throw error;
      }
    }

    throw lastError || new Error('Failed to plan task after retries');
  }

  /**
   * Execute the actual planning logic with a specific model
   */
  private async executePlanTask(
    prompt: string,
    userId: string,
    userTimeZone: string | undefined,
    userLocalDate: string | undefined,
    model: any
  ): Promise<TaskPlan> {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.formatUserPrompt(prompt, userTimeZone, userLocalDate);

    try {
      const result = await model.generateContent([systemPrompt, userPrompt]);
      const response = result.response.text();

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;

      const parsed = JSON.parse(jsonText);

      // Generate task ID
      const taskId = this.generateTaskId();

      // Convert parsed response to TaskPlan
      const plan: TaskPlan = {
        taskId,
        userId,
        title: parsed.title || this.extractTitle(prompt),
        steps: this.convertToSteps(parsed.steps),
        createdAt: new Date(),
      };

      return plan;
    } catch (error) {
      console.error('Planner Agent Error:', error);
      throw new Error(`Failed to plan task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Identify which Google services are required for a task
   */
  identifyRequiredServices(steps: PlanStep[]): GoogleService[] {
    const services = new Set<GoogleService>();
    steps.forEach(step => {
      if (step.service) {
        services.add(step.service);
      }
    });
    return Array.from(services);
  }

  private getSystemPrompt(): string {
    return `You are a task planning agent for AURA (Agentic Unified Reasoning Assistant).
Your role is to decompose user requests into executable steps that interact with Google Workspace services.

Available Google Services:
- gmail: Send emails, search emails, read messages
- drive: Search files, download files, upload files
- docs: Create documents, update documents, read documents
- sheets: Read spreadsheets, write data, update cells
- calendar: Create events, list events, delete events

Action names you MUST use (never invent new ones):
- For gmail steps: "send", "search", "read"
- For drive steps: "search", "download", "upload"
- For docs steps: "create", "update", "read"
- For sheets steps: "read", "write", "update"
- For calendar steps: "create", "list", "delete"

Your response MUST be valid JSON in this exact format:
{
  "title": "Brief task title (max 60 chars)",
  "steps": [
    {
      "description": "Clear description of what this step does",
      "service": "gmail|drive|docs|sheets|calendar",
      "action": "specific_action_name",
      "parameters": {
        "key": "value"
      },
      "dependencies": ["step_id_1", "step_id_2"]
    }
  ]
}

Important parameter shapes (you MUST respect these exactly):
- For Gmail "send" steps:
  "parameters": {
    "to": "single email" OR ["list", "of", "emails"],
    "subject": "email subject line",
    "body": "FULL email body as HTML or plain text. Never use placeholders like '[content from step 1]'."
  }

- For Docs "create" steps:
  "parameters": {
    "title": "Document title",
    "content": [
      { "type": "heading", "level": 1, "text": "Heading text" },
      { "type": "paragraph", "text": "Paragraph text" }
    ]
  }

- For Sheets "write" steps:
  "parameters": {
    "title": "Optional spreadsheet title (used when creating a new sheet)",
    "spreadsheetId": "Optional existing spreadsheet ID. If omitted, a new spreadsheet will be created.",
    "range": "Optional A1 range like 'Sheet1!A1'. Default is 'Sheet1!A1'.",
    "values": [
      ["Header 1", "Header 2"],
      ["Row 1 Col 1", "Row 1 Col 2"]
    ]
  }

- For Calendar "create" steps:
  "parameters": {
    "summary": "Short event title, for example 'Lunch'. This MUST always be present and should match the event title the user requested.",
    "description": "Optional longer description of the event",
    "startTime": "ISO 8601 date-time string such as '2025-12-01T12:00:00+05:30' representing when the event starts in the user's local time zone.",
    "endTime": "ISO 8601 date-time string such as '2025-12-01T13:00:00+05:30' representing when the event ends in the user's local time zone.",
    "timeZone": "Optional IANA time zone name like 'Asia/Kolkata'. If omitted, assume the user's local timezone provided in the context.",
    "attendees": ["Optional list of attendee email addresses such as 'person@example.com'"],
    "location": "Optional event location string"
  }

- For Drive "search" steps:
  "parameters": {
    "query": "A short file-name keyword or phrase taken directly from the user (for example, 'student', 'student marks sheet', 'Q4 report'). Do NOT use full sentences like 'files where the title starts with 'student'' or 'search my Drive for student files' here; instead, pass only the actual search terms.",
    "fileType": "Optional MIME type filter like 'application/pdf'",
    "limit": 20
  }

- For Drive "download" steps:
  "parameters": {
    "fileId": "The Drive file ID to download"
  }

- For Drive "upload" steps:
  "parameters": {
    "filename": "File name to create in Drive",
    "content": "Base64-encoded file content",
    "mimeType": "Optional MIME type (e.g., 'text/plain')",
    "folderId": "Optional destination folder ID"
  }

Guidelines:
1. Break complex tasks into simple, atomic steps.
2. Each step should have ONE clear action.
3. Specify dependencies when steps must execute in order.
4. Use realistic parameter values based on the user's request.
5. Keep descriptions concise but clear.
6. Order steps logically (dependencies first).
7. For email tasks, always provide a complete, ready-to-send body (no TODOs or placeholders).
8. For document tasks, provide the actual content as an ordered list of heading/paragraph blocks.
9. For calendar tasks, include time, date, and attendees.
10. For file operations, specify search queries or file names.
11. When a later Drive step needs the fileId of a file found in an earlier Drive "search" step, set that parameter using the canonical placeholder form {{step_X.fileId}} (or {{step_N.fileId}} for other steps). Do NOT invent new placeholder names like "fileId_from_step_1".
12. When the user asks you to WRITE content (stories, drafts, emails, summaries, etc.), you MUST generate the full text yourself inside the plan parameters.
13. If a later step needs to email or otherwise share content you generated in an earlier step, REPEAT the same full text in that later step's parameters instead of using phrases like "content from step_1" or "see previous step".
14. Avoid meta-language or instructions in parameters. Parameters must contain final, user-ready text only.
15. When the user specifies a word count (e.g., "300-word story"), generate text that is reasonably close to that length (±10–15%).
16. If the user explicitly asks to send an email with a story or other generated content "in the body" (and does not ask for a separate document), use a single Gmail "send" step whose "body" parameter contains the FULL generated text that satisfies the story/topic and word-count requirements. Do NOT treat the subject line or a short note as the story itself.

Example A (Doc + Email): If the user says, "Write a 300-word story about a boy meeting a girl and then email it to mokshithrao1481@gmail.com.", a good plan is:
{
  "title": "Boy Meets Girl Story and Email",
  "steps": [
    {
      "description": "Create a Google Doc with a 300-word story about a boy meeting a girl.",
      "service": "docs",
      "action": "create",
      "parameters": {
        "title": "Boy Meets Girl Story",
        "content": [
          { "type": "heading", "level": 1, "text": "Boy Meets Girl" },
          { "type": "paragraph", "text": "[WRITE THE FULL ~300-WORD STORY HERE AS NORMAL SENTENCES, NOT A SUMMARY OR PLACEHOLDER.]" }
        ]
      },
      "dependencies": []
    },
    {
      "description": "Send the full story by email to the user.",
      "service": "gmail",
      "action": "send",
      "parameters": {
        "to": "mokshithrao1481@gmail.com",
        "subject": "Your requested story: Boy Meets Girl",
        "body": "Here is the 300-word story you requested about a boy meeting a girl:\n\n[PASTE THE SAME FULL STORY TEXT USED IN THE DOC ABOVE. DO NOT WRITE '[content from step_1]'; INCLUDE THE ACTUAL STORY TEXT HERE.]"
      },
      "dependencies": ["step_1"]
    }
  ]
}

Example B (Direct email only): If the user says, "Send an email to mokshithrao1481@gmail.com with a 300-word story of a girl meeting a boy in the body.", a good plan is:
{
  "title": "Email 300-word story: Girl meets boy",
  "steps": [
    {
      "description": "Send an email with a ~300-word story about a girl meeting a boy in the body.",
      "service": "gmail",
      "action": "send",
      "parameters": {
        "to": "mokshithrao1481@gmail.com",
        "subject": "Your Requested Story: Girl Meets Boy",
        "body": "[WRITE THE FULL ~300-WORD GIRL-MEETS-BOY STORY HERE AS NORMAL SENTENCES. THIS BODY TEXT MUST BE THE ACTUAL STORY, NOT JUST A SHORT NOTE OR THE EMAIL SUBJECT REPEATED.]"
      },
      "dependencies": []
    }
  ]
}

Never return Markdown, code fences, or explanatory text outside of this JSON structure.`;
  }

  private formatUserPrompt(
    prompt: string,
    userTimeZone?: string,
    userLocalDate?: string
  ): string {
    const timezoneContext = userTimeZone
      ? `User's local time zone is ${userTimeZone}. When interpreting relative dates like "today" or "tomorrow" and clock times like "3 pm", or when creating calendar events, assume this time zone unless the user explicitly specifies another one.

`
      : '';

    const dateContext = userLocalDate
      ? `User's current local date is ${userLocalDate} (YYYY-MM-DD). When the user says things like "today", "tomorrow", or names of weekdays, interpret them relative to this date rather than your own training cutoff date.

`
      : '';

    return `User Request: ${prompt}

${timezoneContext}${dateContext}Please analyze this request and create a detailed execution plan with specific steps.`;
  }

  private convertToSteps(rawSteps: any[]): PlanStep[] {
    return rawSteps.map((step, index) => ({
      id: `step_${index + 1}`,
      description: step.description,
      service: step.service as GoogleService,
      action: step.action,
      parameters: step.parameters || {},
      dependencies: step.dependencies || [],
    }));
  }

  private generateTaskId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `task_${timestamp}_${random}`;
  }

  private extractTitle(prompt: string): string {
    // Extract a reasonable title from the prompt (max 60 chars)
    const cleaned = prompt.trim().replace(/\s+/g, ' ');
    return cleaned.length > 60 ? cleaned.substring(0, 57) + '...' : cleaned;
  }
}

// Export singleton instance
export const plannerAgent = new PlannerAgent();
