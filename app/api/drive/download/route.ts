import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/drive/download
 * Download file content and handle different MIME types
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fileId = searchParams.get('fileId');

    // Validate required fields
    if (!userId || !fileId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required parameters',
        'Please provide userId and fileId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Get file metadata first
    const metadata = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size',
    });

    const mimeType = metadata.data.mimeType || 'application/octet-stream';
    const fileName = metadata.data.name || 'download';

    // Handle Google Workspace files (need to export)
    const googleWorkspaceMimeTypes: Record<string, string> = {
      'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.google-apps.drawing': 'application/pdf',
    };

    let fileData: any;
    let exportMimeType = mimeType;

    if (mimeType in googleWorkspaceMimeTypes) {
      // Export Google Workspace file
      exportMimeType = googleWorkspaceMimeTypes[mimeType];
      fileData = await drive.files.export(
        {
          fileId,
          mimeType: exportMimeType,
        },
        { responseType: 'arraybuffer' }
      );
    } else {
      // Download regular file
      fileData = await drive.files.get(
        {
          fileId,
          alt: 'media',
        },
        { responseType: 'arraybuffer' }
      );
    }

    // Convert to base64 for JSON response
    const base64Data = Buffer.from(fileData.data).toString('base64');

    return Response.json({
      success: true,
      data: {
        fileId,
        fileName,
        mimeType: exportMimeType,
        size: metadata.data.size,
        content: base64Data,
      },
    });
  } catch (error: any) {
    console.error('Drive download error:', error);
    return apiErrorResponse(error);
  }
}
