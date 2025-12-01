import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * Worker agent for Google Sheets operations
 */
export class SheetsWorker extends BaseWorker {
  constructor() {
    super('sheets');
  }

  async executeStep(step: PlanStep, userId: string): Promise<WorkerResult> {
    try {
      const auth = await this.getAuthClient(userId);
      const sheets = google.sheets({ version: 'v4', auth });

      switch (step.action) {
        case 'read':
          return await this.readSheet(step, sheets);
        case 'write':
          return await this.writeSheet(step, sheets);
        case 'update':
          return await this.updateSheet(step, sheets);
        default:
          throw new Error(`Unknown Sheets action: ${step.action}`);
      }
    } catch (error) {
      return this.createErrorResult(
        step.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private async readSheet(step: PlanStep, sheets: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['spreadsheetId']);

    const { spreadsheetId, range = 'Sheet1' } = step.parameters || {};

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = result.data.values || [];

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Sheet data: ${range}`,
      googleId: spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      data: {
        spreadsheetId,
        range: result.data.range,
        values,
        rowCount: values.length,
        columnCount: values[0]?.length || 0,
      },
    });
  }

  private async writeSheet(step: PlanStep, sheets: any): Promise<WorkerResult> {
    const parameters = step.parameters || {};
    this.validateParameters(parameters, ['values']);

    const {
      spreadsheetId,
      range = 'Sheet1!A1',
      values,
      title,
    } = parameters;

    let targetSpreadsheetId = spreadsheetId as string | undefined;

    // If no spreadsheetId is provided, create a new spreadsheet first
    if (!targetSpreadsheetId) {
      const createResult = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: title || 'AURA Sheet',
          },
        },
      });

      targetSpreadsheetId = createResult.data.spreadsheetId!;
    }

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: targetSpreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: title || `Added ${values.length} rows`,
      googleId: targetSpreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}/edit`,
      data: {
        spreadsheetId: targetSpreadsheetId,
        updatedRange: result.data.updates?.updatedRange,
        updatedRows: result.data.updates?.updatedRows,
        updatedColumns: result.data.updates?.updatedColumns,
        updatedCells: result.data.updates?.updatedCells,
      },
    });
  }

  private async updateSheet(step: PlanStep, sheets: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['spreadsheetId', 'updates']);

    const { spreadsheetId, updates } = step.parameters || {};

    const data = updates.map((update: any) => ({
      range: update.range,
      values: update.values,
    }));

    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data,
      },
    });

    const totalUpdatedCells = result.data.responses?.reduce(
      (sum: number, response: any) => sum + (response.updatedCells || 0),
      0
    );

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Updated ${totalUpdatedCells} cells`,
      googleId: spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      data: {
        spreadsheetId,
        totalUpdatedCells,
        updatedRanges: updates.length,
      },
    });
  }
}

export const sheetsWorker = new SheetsWorker();
