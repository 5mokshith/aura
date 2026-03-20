import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

// ── Drive search helpers ────────────────────────────────────────────────

/** Words the planner sometimes leaks into the query that aren't real search terms. */
const NOISE_WORDS = new Set([
  'find', 'search', 'look', 'get', 'fetch', 'show', 'list', 'my', 'the',
  'a', 'an', 'for', 'in', 'on', 'of', 'about', 'with', 'files', 'file',
  'document', 'documents', 'drive', 'from', 'all', 'recent', 'latest',
  'please', 'can', 'you', 'me', 'i', 'want', 'need', 'to', 'is', 'are',
  'it', 'its', 'that', 'this', 'where', 'which', 'titled', 'named', 'called',
]);

/** Infer a Google Workspace MIME type from natural-language hints in the query. */
function inferMimeType(text: string): string | null {
  const lower = text.toLowerCase();
  const mimeMap: [RegExp, string][] = [
    [/\bspreadsheet|sheet|xlsx?\b/, 'application/vnd.google-apps.spreadsheet'],
    [/\bdoc(ument)?|docx?\b/, 'application/vnd.google-apps.document'],
    [/\bslide|presentation|pptx?\b/, 'application/vnd.google-apps.presentation'],
    [/\bform\b/, 'application/vnd.google-apps.form'],
    [/\bpdf\b/, 'application/pdf'],
    [/\bimage|photo|picture|png|jpe?g\b/, 'image/'],
    [/\bvideo|mp4|mov\b/, 'video/'],
  ];
  for (const [pattern, mime] of mimeMap) {
    if (pattern.test(lower)) return mime;
  }
  return null;
}

/** Escape a term for use inside a Drive query single-quoted string. */
const escapeTerm = (term: string) => term.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/**
 * Clean a raw query string into meaningful search tokens.
 * - Strips noise words the planner may inject ("find", "my", etc.)
 * - Extracts quoted phrases as atomic tokens
 * - Returns tokens in order of specificity (longer first)
 */
function extractSearchTokens(raw: string): string[] {
  // Pull out quoted phrases first
  const phrases: string[] = [];
  const withoutQuotes = raw.replace(/["']([^"']+)["']/g, (_m, p1) => {
    phrases.push(p1.trim());
    return ' ';
  });

  // Tokenize remainder and strip noise
  const words = withoutQuotes
    .split(/\s+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 1 && !NOISE_WORDS.has(w));

  // Combine: quoted phrases first (most specific), then individual words
  const all = [...phrases, ...words];
  // Deduplicate while preserving order
  const seen = new Set<string>();
  return all.filter((t) => {
    const key = t.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Score how well a file name matches the original search tokens.
 * Higher = better match. Used to re-rank results after the API returns them.
 */
function scoreFileMatch(fileName: string, tokens: string[]): number {
  const lower = fileName.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    const tLower = token.toLowerCase();
    if (lower === tLower) {
      score += 100; // exact full-name match
    } else if (lower.startsWith(tLower)) {
      score += 50; // prefix match
    } else if (lower.includes(tLower)) {
      score += 20; // substring match
    }
  }
  return score;
}

// ── Worker ──────────────────────────────────────────────────────────────

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
    const rawQuery = String(query ?? '').trim();

    if (!rawQuery) {
      throw new Error('Drive search query cannot be empty');
    }

    const tokens = extractSearchTokens(rawQuery);
    if (tokens.length === 0) {
      throw new Error(`Could not extract meaningful search terms from: "${rawQuery}"`);
    }

    // Infer MIME type from query text if the planner didn't supply one
    const resolvedFileType = fileType || inferMimeType(rawQuery);

    const driveFields = 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink, size)';

    // ── Strategy 1: tight name-AND search (all tokens must appear in name)
    let files = await this.runDriveQuery(
      drive,
      this.buildQuery(tokens, 'name-and', resolvedFileType),
      limit,
      driveFields
    );

    // ── Strategy 2: name-OR (any token in name) — broader
    if (files.length === 0) {
      files = await this.runDriveQuery(
        drive,
        this.buildQuery(tokens, 'name-or', resolvedFileType),
        limit,
        driveFields
      );
    }

    // ── Strategy 3: fullText search as final fallback
    if (files.length === 0) {
      files = await this.runDriveQuery(
        drive,
        this.buildQuery(tokens, 'fulltext', resolvedFileType),
        limit,
        driveFields
      );
    }

    // Re-rank: files whose name closely matches the search tokens float to top,
    // with recency as tiebreaker
    files.sort((a: any, b: any) => {
      const scoreDiff = scoreFileMatch(b.name || '', tokens) - scoreFileMatch(a.name || '', tokens);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.modifiedTime || 0).getTime() - new Date(a.modifiedTime || 0).getTime();
    });

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

  /**
   * Build a Drive API query string using one of three strategies.
   */
  private buildQuery(
    tokens: string[],
    strategy: 'name-and' | 'name-or' | 'fulltext',
    mimeType: string | null
  ): string {
    let q: string;

    switch (strategy) {
      case 'name-and': {
        // Every token must appear in the file name (strictest, best precision)
        const conditions = tokens.map((t) => `name contains '${escapeTerm(t)}'`);
        q = `(${conditions.join(' and ')}) and trashed=false`;
        break;
      }
      case 'name-or': {
        // Any token can match the name (broader, catches partial matches)
        const conditions = tokens.map((t) => `name contains '${escapeTerm(t)}'`);
        q = `(${conditions.join(' or ')}) and trashed=false`;
        break;
      }
      case 'fulltext': {
        // Search inside file content as a last resort
        const conditions = tokens.map((t) => `fullText contains '${escapeTerm(t)}'`);
        q = `(${conditions.join(' or ')}) and trashed=false`;
        break;
      }
    }

    if (mimeType) {
      // Prefix match for broad types like "image/" or "video/"
      if (mimeType.endsWith('/')) {
        q += ` and mimeType contains '${escapeTerm(mimeType)}'`;
      } else {
        q += ` and mimeType='${escapeTerm(mimeType)}'`;
      }
    }

    return q;
  }

  /** Run a single Drive files.list call and return the files array. */
  private async runDriveQuery(
    drive: any,
    q: string,
    pageSize: number,
    fields: string
  ): Promise<any[]> {
    const result = await drive.files.list({ q, pageSize, fields });
    return result.data.files || [];
  }

  private async downloadFile(step: PlanStep, drive: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['fileId']);

    const { fileId } = step.parameters || {};

    // Get file metadata
    const metadata = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink',
    });

    const mimeType = metadata.data.mimeType || '';

    let contentBuffer: Buffer;

    if (mimeType.startsWith('application/vnd.google-apps.')) {
      const exportMimeType =
        mimeType === 'application/vnd.google-apps.spreadsheet'
          ? 'text/csv'
          : 'text/plain';

      const exportResponse = await drive.files.export(
        {
          fileId,
          mimeType: exportMimeType,
        },
        { responseType: 'arraybuffer' }
      );

      contentBuffer = Buffer.from(exportResponse.data as ArrayBuffer);
    } else {
      const response = await drive.files.get(
        {
          fileId,
          alt: 'media',
        },
        { responseType: 'arraybuffer' }
      );

      contentBuffer = Buffer.from(response.data as ArrayBuffer);
    }

    const content = contentBuffer.toString('base64');

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
