import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/gmail/search
 * Search emails with query parameters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('query') || '';
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

    // Validate required fields
    if (!userId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing userId parameter',
        'Please provide userId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Search messages
    const listResult = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = listResult.data.messages || [];

    // Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date'],
        });

        const headers = details.data.payload?.headers || [];
        const from = headers.find((h) => h.name === 'From')?.value || '';
        const subject = headers.find((h) => h.name === 'Subject')?.value || '';
        const date = headers.find((h) => h.name === 'Date')?.value || '';

        return {
          id: details.data.id,
          threadId: details.data.threadId,
          snippet: details.data.snippet,
          from,
          subject,
          date,
        };
      })
    );

    return Response.json({
      success: true,
      data: {
        messages: detailedMessages,
        resultSizeEstimate: listResult.data.resultSizeEstimate || 0,
      },
    });
  } catch (error: any) {
    console.error('Gmail search error:', error);
    return apiErrorResponse(error);
  }
}
