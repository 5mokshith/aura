import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

interface SheetUpdate {
  range: string;
  values: string[][];
}

/**
 * POST /api/sheets/update
 * Update existing cell values with support for batch updates
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, spreadsheetId, updates } = body as {
      userId: string;
      spreadsheetId: string;
      updates: SheetUpdate[];
    };

    // Validate required fields
    if (!userId || !spreadsheetId || !updates || updates.length === 0) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, spreadsheetId, and updates',
        true,
        400
      );
    }

    // Validate updates format
    for (const update of updates) {
      if (!update.range || !update.values || !Array.isArray(update.values)) {
        throw new AuraError(
          'INVALID_INPUT',
          'Invalid update format',
          'Each update must have range and values (2D array)',
          true,
          400
        );
      }
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Prepare batch update data
    const data = updates.map((update) => ({
      range: update.range,
      values: update.values,
    }));

    // Perform batch update
    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED', // Parse values as if user typed them
        data,
      },
    });

    // Calculate total updated cells
    const totalUpdatedCells =
      result.data.responses?.reduce(
        (sum, response) => sum + (response.updatedCells || 0),
        0
      ) || 0;

    return Response.json({
      success: true,
      data: {
        spreadsheetId,
        totalUpdatedCells,
        totalUpdatedRows:
          result.data.responses?.reduce(
            (sum, response) => sum + (response.updatedRows || 0),
            0
          ) || 0,
        totalUpdatedColumns:
          result.data.responses?.reduce(
            (sum, response) => sum + (response.updatedColumns || 0),
            0
          ) || 0,
        updatesApplied: updates.length,
      },
    });
  } catch (error: any) {
    console.error('Sheets update error:', error);
    return apiErrorResponse(error);
  }
}
