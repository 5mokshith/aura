import { google } from 'googleapis';
import { Readable } from 'stream';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * POST /api/drive/upload
 * Upload files to Drive with folder organization support
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, filename, mimeType, content, folderId } = body;

    // Validate required fields
    if (!userId || !filename || !mimeType || !content) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, filename, mimeType, and content',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Decode base64 content
    const fileBuffer = Buffer.from(content, 'base64');

    // Create file metadata
    const fileMetadata: any = {
      name: filename,
      mimeType,
    };

    // Add parent folder if specified
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    // Upload file
    const result = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: 'id, name, webViewLink, webContentLink',
    });

    return Response.json({
      success: true,
      data: {
        fileId: result.data.id,
        name: result.data.name,
        webViewLink: result.data.webViewLink,
        webContentLink: result.data.webContentLink,
      },
    });
  } catch (error: any) {
    console.error('Drive upload error:', error);
    return apiErrorResponse(error);
  }
}
