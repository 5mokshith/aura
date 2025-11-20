import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

interface UpdateOperation {
  type: 'append' | 'replace' | 'insert';
  text: string;
  index?: number; // Required for 'insert' and 'replace'
  endIndex?: number; // Required for 'replace'
}

/**
 * POST /api/docs/update
 * Batch update document content with append, replace, and insert operations
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, documentId, operations } = body as {
      userId: string;
      documentId: string;
      operations: UpdateOperation[];
    };

    // Validate required fields
    if (!userId || !documentId || !operations || operations.length === 0) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, documentId, and operations',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Get current document to find end index for append operations
    const doc = await docs.documents.get({ documentId });
    const endIndex = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 1;

    // Build batch update requests
    const requests: any[] = [];

    for (const operation of operations) {
      if (operation.type === 'append') {
        // Append to end of document
        requests.push({
          insertText: {
            location: { index: endIndex - 1 }, // Insert before the last newline
            text: operation.text,
          },
        });
      } else if (operation.type === 'insert') {
        // Insert at specific index
        if (operation.index === undefined) {
          throw new AuraError(
            'INVALID_INPUT',
            'Insert operation requires index',
            'Please provide index for insert operation',
            true,
            400
          );
        }

        requests.push({
          insertText: {
            location: { index: operation.index },
            text: operation.text,
          },
        });
      } else if (operation.type === 'replace') {
        // Replace text in range
        if (operation.index === undefined || operation.endIndex === undefined) {
          throw new AuraError(
            'INVALID_INPUT',
            'Replace operation requires index and endIndex',
            'Please provide index and endIndex for replace operation',
            true,
            400
          );
        }

        // Delete existing text
        requests.push({
          deleteContentRange: {
            range: {
              startIndex: operation.index,
              endIndex: operation.endIndex,
            },
          },
        });

        // Insert new text
        requests.push({
          insertText: {
            location: { index: operation.index },
            text: operation.text,
          },
        });
      }
    }

    // Apply all updates
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });

    return Response.json({
      success: true,
      data: {
        documentId,
        operationsApplied: operations.length,
      },
    });
  } catch (error: any) {
    console.error('Docs update error:', error);
    return apiErrorResponse(error);
  }
}
