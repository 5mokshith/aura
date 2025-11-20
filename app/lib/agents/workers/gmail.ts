import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * Worker agent for Gmail operations
 */
export class GmailWorker extends BaseWorker {
  constructor() {
    super('gmail');
  }

  async executeStep(step: PlanStep, userId: string): Promise<WorkerResult> {
    try {
      const auth = await this.getAuthClient(userId);
      const gmail = google.gmail({ version: 'v1', auth });

      switch (step.action) {
        case 'send':
          return await this.sendEmail(step, gmail);
        case 'search':
          return await this.searchEmails(step, gmail);
        case 'read':
          return await this.readEmail(step, gmail);
        default:
          throw new Error(`Unknown Gmail action: ${step.action}`);
      }
    } catch (error) {
      return this.createErrorResult(
        step.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private async sendEmail(step: PlanStep, gmail: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['to', 'subject', 'body']);

    const { to, subject, body, cc, bcc } = step.parameters;

    // Create email message
    const messageParts = [
      `To: ${Array.isArray(to) ? to.join(', ') : to}`,
      cc ? `Cc: ${Array.isArray(cc) ? cc.join(', ') : cc}` : '',
      bcc ? `Bcc: ${Array.isArray(bcc) ? bcc.join(', ') : bcc}` : '',
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ].filter(Boolean);

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return this.createSuccessResult(step.id, {
      type: 'email',
      title: `Email: ${subject}`,
      googleId: result.data.id,
      data: {
        messageId: result.data.id,
        threadId: result.data.threadId,
        to,
        subject,
      },
    });
  }

  private async searchEmails(step: PlanStep, gmail: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['query']);

    const { query, maxResults = 10 } = step.parameters;

    const result = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = result.data.messages || [];
    
    // Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.slice(0, 5).map(async (msg: any) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date'],
        });

        const headers = details.data.payload.headers;
        return {
          id: msg.id,
          threadId: msg.threadId,
          from: headers.find((h: any) => h.name === 'From')?.value,
          subject: headers.find((h: any) => h.name === 'Subject')?.value,
          date: headers.find((h: any) => h.name === 'Date')?.value,
          snippet: details.data.snippet,
        };
      })
    );

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Found ${messages.length} emails`,
      data: {
        query,
        totalResults: messages.length,
        messages: detailedMessages,
      },
    });
  }

  private async readEmail(step: PlanStep, gmail: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['messageId']);

    const { messageId } = step.parameters;

    const result = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const headers = result.data.payload.headers;
    const getHeader = (name: string) =>
      headers.find((h: any) => h.name === name)?.value;

    // Extract body
    let body = '';
    if (result.data.payload.body.data) {
      body = Buffer.from(result.data.payload.body.data, 'base64').toString();
    } else if (result.data.payload.parts) {
      const textPart = result.data.payload.parts.find(
        (part: any) => part.mimeType === 'text/plain' || part.mimeType === 'text/html'
      );
      if (textPart?.body.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Email: ${getHeader('Subject')}`,
      data: {
        id: messageId,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        body,
        snippet: result.data.snippet,
      },
    });
  }
}

export const gmailWorker = new GmailWorker();
