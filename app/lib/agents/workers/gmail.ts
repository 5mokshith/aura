import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

function formatHtmlBody(body: string): string {
  const trimmed = (body || '').trim();
  if (!trimmed) return '';
  if (/[<][a-zA-Z!/]/.test(trimmed)) {
    return trimmed;
  }
  const paragraphs = trimmed.split(/\n\s*\n/);
  const htmlParagraphs = paragraphs.map((para) => {
    const lines = para.split('\n');
    const joined = lines.map((line) => line.trim()).join('<br>');
    return `<p>${joined}</p>`;
  });
  return htmlParagraphs.join('\n');
}

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
    this.validateParameters(step.parameters || {}, ['to', 'subject', 'body']);

    const { to, subject, body, cc, bcc } = step.parameters || {};

    const rawBody = typeof body === 'string' ? body : String(body ?? '');
    const htmlBody = formatHtmlBody(rawBody);
    const trimmedBody = rawBody.trim();
    const maxBodyChars = 4000;
    const bodyForOutput =
      trimmedBody.length > maxBodyChars ? trimmedBody.slice(0, maxBodyChars) : trimmedBody;

    // Create email message
    const messageParts = [
      `To: ${Array.isArray(to) ? to.join(', ') : to}`,
      cc ? `Cc: ${Array.isArray(cc) ? cc.join(', ') : cc}` : '',
      bcc ? `Bcc: ${Array.isArray(bcc) ? bcc.join(', ') : bcc}` : '',
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlBody,
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
        body: bodyForOutput,
      },
    });
  }

  private async searchEmails(step: PlanStep, gmail: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['query']);

    const { query, maxResults = 10 } = step.parameters || {};

    const result = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = result.data.messages || [];
    
    // Fetch details (headers, snippet, and truncated body) for each message
    const detailedMessages = await Promise.all(
      messages.slice(0, 5).map(async (msg: any) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const payload = details.data.payload;
        const headers = payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h: any) => h.name === name)?.value;

        // Extract body similar to readEmail, but truncate to keep payload reasonable
        let body = '';
        if (payload?.body?.data) {
          body = Buffer.from(payload.body.data, 'base64').toString();
        } else if (payload?.parts) {
          const textPart = payload.parts.find(
            (part: any) => part.mimeType === 'text/plain' || part.mimeType === 'text/html'
          );
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        }

        const maxChars = 4000;
        const textBody = typeof body === 'string' ? body.trim() : '';
        const truncatedBody =
          textBody.length > maxChars ? textBody.slice(0, maxChars) : textBody;

        return {
          id: msg.id,
          threadId: msg.threadId,
          from: getHeader('From'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: details.data.snippet,
          body: truncatedBody,
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
    this.validateParameters(step.parameters || {}, ['messageId']);

    const { messageId } = step.parameters || {};

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
