import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * Worker agent for Google Drive operations
 */
export class DriveWorker extends BaseWorker {
  constructor() {
    super('drive');
  }

  async executeStep(step: PlanStep, userId: string): Promise<WorkerResult> {
    try {
      const auth = await this.getAuthClient(userId);
      const drive = google.drive({ version: 'v3', auth });

      switch (step.action) {
        case 'search':
          return await this.searchFiles(step, drive);
        case 'download':
          return await this.downloadFile(step, drive);
        case 'upload':
          return await this.uploadFile(step, drive);
        default:
          throw new Error(`Unknown Drive action: ${step.action}`);
      }
    } catch (error) {
      return this.createErrorResult(
        step.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private async searchFiles(step: PlanStep, drive: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['query']);

    const { query, fileType, limit = 20 } = step.parameters || {};

    let q = `name contains '${query}' and trashed=false`;
    if (fileType) {
      q += ` and mimeType='${fileType}'`;
    }

    const result = await drive.files.list({
      q,
      pageSize: limit,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink, size)',
      orderBy: 'modifiedTime desc',
    });

    const files = result.data.files || [];

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Found ${files.length} files`,
      data: {
        query,
        totalResults: files.length,
        files: files.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          modifiedTime: file.modifiedTime,
          webViewLink: file.webViewLink,
          thumbnailLink: file.thumbnailLink,
          size: file.size,
        })),
      },
    });
  }

  private async downloadFile(step: PlanStep, drive: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['fileId']);

    const { fileId } = step.parameters || {};

    // Get file metadata
    const metadata = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink',
    });

    // Download file content
    const response = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' }
    );

    const content = Buffer.from(response.data).toString('base64');

    return this.createSuccessResult(step.id, {
      type: 'file',
      title: metadata.data.name,
      googleId: fileId,
      url: metadata.data.webViewLink,
      data: {
        fileId,
        name: metadata.data.name,
        mimeType: metadata.data.mimeType,
        content, // Base64 encoded
        size: content.length,
      },
    });
  }

  private async uploadFile(step: PlanStep, drive: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['filename', 'content']);

    const { filename, content, mimeType = 'text/plain', folderId } = step.parameters || {};

    const fileMetadata: any = {
      name: filename,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType,
      body: Buffer.from(content, 'base64'),
    };

    const result = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, webViewLink',
    });

    return this.createSuccessResult(step.id, {
      type: 'file',
      title: result.data.name,
      googleId: result.data.id,
      url: result.data.webViewLink,
      data: {
        fileId: result.data.id,
        name: result.data.name,
        webViewLink: result.data.webViewLink,
      },
    });
  }
}

export const driveWorker = new DriveWorker();
