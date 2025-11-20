import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * POST /api/sheets/write
 * Append rows to spreadsheet with data format validation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, spreadsheetId, range, values } = body as {
      userId: string;
      spreadsheetId: string;
      range: string;
      values: string[][];
    };

    // Validate required fields
    if (!userId || !spreadsheetId || !range || !values) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, spreadsheetId, range, and values',
        true,
        400
      );
    }

    // Validate data format
    if (!Array.isArray(values) || values.length === 0) {
      throw new AuraError(
        'INVALID_INPUT',
        'Invalid values format',
        'Values must be a non-empty 2D array',
        true,
        400
      );
    }

    // Ensure all rows are arrays
    for (const row of values) {
      if (!Array.isArray(row)) {
        throw new AuraError(
          'INVALID_INPUT',
          'Invalid row format',
          'Each row must be an array',
          true,
          400
        );
      }
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Append data to spreadsheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED', // Parse values as if user typed them
      requestBody: {
        values,
      },
    });

    return Response.json({
      success: true,
      data: {
        spreadsheetId,
        updatedRange: result.data.updates?.updatedRange,
        updatedRows: result.data.updates?.updatedRows,
        updatedColumns: result.data.updates?.updatedColumns,
        updatedCells: result.data.updates?.updatedCells,
      },
    });
  } catch (error: any) {
    console.error('Sheets write error:', error);
    return apiErrorResponse(error);
  }
}
