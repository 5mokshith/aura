import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/gmail/read
 * Fetch full message content and parse attachments
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const messageId = searchParams.get('messageId');

    // Validate required fields
    if (!userId || !messageId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required parameters',
        'Please provide userId and messageId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch full message
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const payload = message.data.payload;
    const headers = payload?.headers || [];

    // Extract headers
    const from = headers.find((h) => h.name === 'From')?.value || '';
    const to = headers.find((h) => h.name === 'To')?.value?.split(',') || [];
    const subject = headers.find((h) => h.name === 'Subject')?.value || '';
    const date = headers.find((h) => h.name === 'Date')?.value || '';

    // Extract body – recurse into nested multipart parts (e.g. multipart/mixed
    // wrapping multipart/alternative) which is common for emails with attachments.
    function findBodyData(parts: any[]): { data: string; html: boolean } | null {
      for (const part of parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          return { data: part.body.data, html: true };
        }
        if (part.parts) {
          const nested = findBodyData(part.parts);
          if (nested) return nested;
        }
      }
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return { data: part.body.data, html: false };
        }
      }
      return null;
    }

    let body = '';
    const parts = payload?.parts || [];

    if (parts.length > 0) {
      const found = findBodyData(parts);
      if (found) {
        body = Buffer.from(found.data, 'base64').toString('utf-8');
      }
    } else if (payload?.body?.data) {
      // Simple message
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    // Extract attachments
    const attachments = parts
      .filter((part) => part.filename && part.filename.length > 0)
      .map((part) => ({
        filename: part.filename!,
        mimeType: part.mimeType || 'application/octet-stream',
        size: part.body?.size || 0,
        attachmentId: part.body?.attachmentId,
      }));

    return Response.json({
      success: true,
      data: {
        id: message.data.id,
        threadId: message.data.threadId,
        from,
        to,
        subject,
        body,
        date,
        attachments,
      },
    });
  } catch (error: any) {
    console.error('Gmail read error:', error);
    return apiErrorResponse(error);
  }
}
