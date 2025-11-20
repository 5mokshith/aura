import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/docs/read
 * Fetch document content and convert to plain text
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const documentId = searchParams.get('documentId');

    // Validate required fields
    if (!userId || !documentId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required parameters',
        'Please provide userId and documentId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Fetch document
    const doc = await docs.documents.get({ documentId });

    const title = doc.data.title || '';
    const body = doc.data.body;

    // Extract plain text from document
    let content = '';

    if (body?.content) {
      for (const element of body.content) {
        if (element.paragraph) {
          const paragraph = element.paragraph;
          
          if (paragraph.elements) {
            for (const elem of paragraph.elements) {
              if (elem.textRun?.content) {
                content += elem.textRun.content;
              }
            }
          }
        } else if (element.table) {
          // Handle tables
          const table = element.table;
          
          if (table.tableRows) {
            for (const row of table.tableRows) {
              if (row.tableCells) {
                for (const cell of row.tableCells) {
                  if (cell.content) {
                    for (const cellElement of cell.content) {
                      if (cellElement.paragraph?.elements) {
                        for (const elem of cellElement.paragraph.elements) {
                          if (elem.textRun?.content) {
                            content += elem.textRun.content;
                          }
                        }
                      }
                    }
                  }
                  content += '\t'; // Tab between cells
                }
              }
              content += '\n'; // Newline after row
            }
          }
        }
      }
    }

    return Response.json({
      success: true,
      data: {
        documentId,
        title,
        content: content.trim(),
      },
    });
  } catch (error: any) {
    console.error('Docs read error:', error);
    return apiErrorResponse(error);
  }
}
