 import { google } from 'googleapis';
 import { getOAuth2Client } from '@/app/lib/google/auth';
 import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';
 import { GmailSendRequest } from '@/app/types/api';

/**
 * POST /api/gmail/send
 * Send an email via Gmail API with optional attachments
 */
export async function POST(request: Request) {
  try {
    const body: GmailSendRequest & { userId: string } = await request.json();
    const { userId, to, subject, body: emailBody, attachments } = body;

    // Validate required fields
    if (!userId || !to || to.length === 0 || !subject || !emailBody) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, to, subject, and body',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create MIME message
    const message = createMimeMessage(to, subject, emailBody, attachments);
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return Response.json({
      success: true,
      data: {
        messageId: result.data.id,
        threadId: result.data.threadId,
      },
    });
  } catch (error: any) {
    console.error('Gmail send error:', error);
    return apiErrorResponse(error);
  }
}

/**
 * Create a MIME message for Gmail API
 */
function createMimeMessage(
  to: string[],
  subject: string,
  body: string,
  attachments?: Array<{ filename: string; mimeType: string; data: string }>
): string {
  const boundary = '----=_Part_' + Math.random().toString(36).substring(2);
  const nl = '\r\n';

  let message = '';

  const htmlBody = formatHtmlBody(body);

  // Headers
  message += `To: ${to.join(', ')}${nl}`;
  message += `Subject: ${subject}${nl}`;
  message += `MIME-Version: 1.0${nl}`;

  if (attachments && attachments.length > 0) {
    // Multipart message with attachments
    message += `Content-Type: multipart/mixed; boundary="${boundary}"${nl}`;
    message += nl;

    // Body part
    message += `--${boundary}${nl}`;
    message += `Content-Type: text/html; charset=UTF-8${nl}`;
    message += `Content-Transfer-Encoding: 7bit${nl}`;
    message += nl;
    message += htmlBody + nl;

    // Attachment parts
    for (const attachment of attachments) {
      message += `--${boundary}${nl}`;
      message += `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"${nl}`;
      message += `Content-Disposition: attachment; filename="${attachment.filename}"${nl}`;
      message += `Content-Transfer-Encoding: base64${nl}`;
      message += nl;
      message += attachment.data + nl;
    }

    message += `--${boundary}--`;
  } else {
    // Simple text/html message
    message += `Content-Type: text/html; charset=UTF-8${nl}`;
    message += nl;
    message += htmlBody;
  }

  return message;
}

function formatHtmlBody(body: string): string {
  const trimmed = (body || '').trim();
  if (!trimmed) return '';
  if (/[<][a-zA-Z!/]/.test(trimmed)) {
    return trimmed;
  }

  const applyInlineMarkdown = (text: string): string => {
    if (!text) return '';
    let result = text;

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');

    // Italic: _text_ or *text*
    result = result.replace(/(^|[\s])_(.+?)_([\s]|$)/g, '$1<em>$2<\/em>$3');
    result = result.replace(/(^|[\s])\*(.+?)\*([\s]|$)/g, '$1<em>$2<\/em>$3');

    return result;
  };

  const paragraphs = trimmed.split(/\n\s*\n/);
  const htmlParagraphs = paragraphs.map((para) => {
    const lines = para.split('\n');
    const joined = lines
      .map((line) => applyInlineMarkdown(line.trim()))
      .join('<br>');
    return `<p>${joined}</p>`;
  });
  return htmlParagraphs.join('\n');
}
