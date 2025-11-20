import { GoogleGenerativeAI } from '@google/generative-ai';
import { TaskPlan, PlanStep } from '@/app/types/agent';
import { GoogleService } from '@/app/types/chat';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class PlannerAgent {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Decompose a user prompt into executable steps
   */
  async planTask(prompt: string, userId: string): Promise<TaskPlan> {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.formatUserPrompt(prompt);

    try {
      const result = await this.model.generateContent([systemPrompt, userPrompt]);
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

Guidelines:
1. Break complex tasks into simple, atomic steps
2. Each step should have ONE clear action
3. Specify dependencies when steps must execute in order
4. Use realistic parameter values based on the user's request
5. Keep descriptions concise but clear
6. Order steps logically (dependencies first)
7. For email tasks, include recipient, subject, and body structure
8. For document tasks, specify content structure
9. For calendar tasks, include time, date, and attendees
10. For file operations, specify search queries or file names

Example actions by service:
- gmail: "send", "search", "read"
- drive: "search", "download", "upload"
- docs: "create", "update", "read"
- sheets: "read", "write", "update"
- calendar: "create", "list", "delete"`;
  }

  private formatUserPrompt(prompt: string): string {
    return `User Request: ${prompt}

Please analyze this request and create a detailed execution plan with specific steps.`;
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
