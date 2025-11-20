import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list';
  text: string;
  level?: number; // For headings (1-6)
}

/**
 * POST /api/docs/create
 * Create new document with title and insert formatted content
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, content } = body as {
      userId: string;
      title: string;
      content: ContentBlock[];
    };

    // Validate required fields
    if (!userId || !title) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId and title',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Create document
    const createResult = await docs.documents.create({
      requestBody: {
        title,
      },
    });

    const documentId = createResult.data.documentId!;

    // Build batch update requests if content is provided
    if (content && content.length > 0) {
      const requests: any[] = [];
      let index = 1; // Start after the title

      for (const block of content) {
        if (block.type === 'heading') {
          // Insert heading text
          requests.push({
            insertText: {
              location: { index },
              text: block.text + '\n',
            },
          });

          // Apply heading style
          const headingLevel = Math.min(Math.max(block.level || 1, 1), 6);
          requests.push({
            updateParagraphStyle: {
              range: {
                startIndex: index,
                endIndex: index + block.text.length,
              },
              paragraphStyle: {
                namedStyleType: `HEADING_${headingLevel}`,
              },
              fields: 'namedStyleType',
            },
          });

          index += block.text.length + 1;
        } else if (block.type === 'paragraph') {
          // Insert paragraph text
          requests.push({
            insertText: {
              location: { index },
              text: block.text + '\n',
            },
          });

          index += block.text.length + 1;
        } else if (block.type === 'list') {
          // Insert list item
          requests.push({
            insertText: {
              location: { index },
              text: block.text + '\n',
            },
          });

          // Apply bullet list style
          requests.push({
            createParagraphBullets: {
              range: {
                startIndex: index,
                endIndex: index + block.text.length,
              },
              bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
            },
          });

          index += block.text.length + 1;
        }
      }

      // Apply all updates
      if (requests.length > 0) {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: { requests },
        });
      }
    }

    const url = `https://docs.google.com/document/d/${documentId}/edit`;

    return Response.json({
      success: true,
      data: {
        documentId,
        title,
        url,
      },
    });
  } catch (error: any) {
    console.error('Docs create error:', error);
    return apiErrorResponse(error);
  }
}
