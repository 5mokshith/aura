import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

const escapeTerm = (t: string) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/**
 * GET /api/drive/search
 * Search files with query and filters, return file metadata with thumbnails.
 *
 * Uses a cascading strategy:
 *   1. name-AND (all tokens in name) — most precise
 *   2. name-OR (any token in name)   — broader
 *   3. fullText-OR                   — last resort
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('query') || '';
    const fileType = searchParams.get('fileType');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing userId parameter',
        'Please provide userId',
        true,
        400
      );
    }

    const oauth2Client = await getOAuth2Client(userId);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fields = 'files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink, size, iconLink)';

    // Tokenize the query — strip quotes and split on whitespace
    const tokens = query
      .replace(/["']/g, ' ')
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    if (tokens.length === 0 && !query.trim()) {
      // No query — list recent files
      const result = await drive.files.list({
        q: 'trashed=false',
        pageSize: limit,
        fields,
        orderBy: 'modifiedTime desc',
      });

      const files = mapFiles(result.data.files || []);
      return Response.json({ success: true, data: { files, count: files.length } });
    }

    const searchTokens = tokens.length > 0 ? tokens : [query.trim()];
    const mimeFilter = fileType ? ` and mimeType='${escapeTerm(fileType)}'` : '';

    // Strategy 1: all tokens in name (AND)
    let files = await runQuery(
      drive,
      `(${searchTokens.map((t) => `name contains '${escapeTerm(t)}'`).join(' and ')}) and trashed=false${mimeFilter}`,
      limit,
      fields
    );

    // Strategy 2: any token in name (OR)
    if (files.length === 0 && searchTokens.length > 1) {
      files = await runQuery(
        drive,
        `(${searchTokens.map((t) => `name contains '${escapeTerm(t)}'`).join(' or ')}) and trashed=false${mimeFilter}`,
        limit,
        fields
      );
    }

    // Strategy 3: fullText search
    if (files.length === 0) {
      files = await runQuery(
        drive,
        `(${searchTokens.map((t) => `fullText contains '${escapeTerm(t)}'`).join(' or ')}) and trashed=false${mimeFilter}`,
        limit,
        fields
      );
    }

    // Re-rank: exact/prefix name matches first, then by recency
    files.sort((a: any, b: any) => {
      const sa = nameScore(a.name || '', searchTokens);
      const sb = nameScore(b.name || '', searchTokens);
      if (sa !== sb) return sb - sa;
      return new Date(b.modifiedTime || 0).getTime() - new Date(a.modifiedTime || 0).getTime();
    });

    const mapped = mapFiles(files);
    return Response.json({ success: true, data: { files: mapped, count: mapped.length } });
  } catch (error: any) {
    console.error('Drive search error:', error);
    return apiErrorResponse(error);
  }
}

async function runQuery(drive: any, q: string, pageSize: number, fields: string) {
  const result = await drive.files.list({ q, pageSize, fields });
  return result.data.files || [];
}

function nameScore(name: string, tokens: string[]): number {
  const lower = name.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    const tl = t.toLowerCase();
    if (lower === tl) score += 100;
    else if (lower.startsWith(tl)) score += 50;
    else if (lower.includes(tl)) score += 20;
  }
  return score;
}

function mapFiles(files: any[]) {
  return files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    modifiedTime: file.modifiedTime,
    webViewLink: file.webViewLink,
    thumbnailLink: file.thumbnailLink,
    size: file.size,
    iconLink: file.iconLink,
  }));
}
