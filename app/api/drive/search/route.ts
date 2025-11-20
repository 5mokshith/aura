import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/drive/search
 * Search files with query and filters, return file metadata with thumbnails
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('query') || '';
    const fileType = searchParams.get('fileType');
    const limit = parseInt(searchParams.get('limit') || '20');

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
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Build query
    let q = 'trashed=false';
    
    if (query) {
      q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
    }
    
    if (fileType) {
      q += ` and mimeType='${fileType}'`;
    }

    // Search files
    const result = await drive.files.list({
      q,
      pageSize: limit,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink, size, iconLink)',
      orderBy: 'modifiedTime desc',
    });

    const files = (result.data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      size: file.size,
      iconLink: file.iconLink,
    }));

    return Response.json({
      success: true,
      data: {
        files,
        count: files.length,
      },
    });
  } catch (error: any) {
    console.error('Drive search error:', error);
    return apiErrorResponse(error);
  }
}
