import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/sheets/read
 * Read spreadsheet data by range and return 2D array of values
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const spreadsheetId = searchParams.get('spreadsheetId');
    const range = searchParams.get('range') || 'Sheet1';

    // Validate required fields
    if (!userId || !spreadsheetId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required parameters',
        'Please provide userId and spreadsheetId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Read spreadsheet data
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = result.data.values || [];

    return Response.json({
      success: true,
      data: {
        spreadsheetId,
        range: result.data.range,
        values,
        rowCount: values.length,
        columnCount: values.length > 0 ? values[0].length : 0,
      },
    });
  } catch (error: any) {
    console.error('Sheets read error:', error);
    return apiErrorResponse(error);
  }
}
