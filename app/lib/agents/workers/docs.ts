import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * Worker agent for Google Docs operations
 */
export class DocsWorker extends BaseWorker {
  constructor() {
    super('docs');
  }

  async executeStep(step: PlanStep, userId: string): Promise<WorkerResult> {
    try {
      const auth = await this.getAuthClient(userId);
      const docs = google.docs({ version: 'v1', auth });

      switch (step.action) {
        case 'create':
          return await this.createDocument(step, docs);
        case 'update':
          return await this.updateDocument(step, docs);
        case 'read':
          return await this.readDocument(step, docs);
        default:
          throw new Error(`Unknown Docs action: ${step.action}`);
      }
    } catch (error) {
      return this.createErrorResult(
        step.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private async createDocument(step: PlanStep, docs: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['title']);

    const { title, content } = step.parameters;

    // Create document
    const createResult = await docs.documents.create({
      requestBody: { title },
    });

    const documentId = createResult.data.documentId!;

    // Add content if provided
    if (content && Array.isArray(content)) {
      const requests = this.buildContentRequests(content);
      
      if (requests.length > 0) {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: { requests },
        });
      }
    }

    const url = `https://docs.google.com/document/d/${documentId}/edit`;

    return this.createSuccessResult(step.id, {
      type: 'document',
      title,
      googleId: documentId,
      url,
      data: {
        documentId,
        title,
        url,
      },
    });
  }

  private async updateDocument(step: PlanStep, docs: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['documentId', 'operations']);

    const { documentId, operations } = step.parameters;

    const requests = [];

    for (const op of operations) {
      if (op.type === 'append') {
        requests.push({
          insertText: {
            location: { index: 1 },
            text: op.text + '\n',
          },
        });
      } else if (op.type === 'replace' && op.startIndex !== undefined && op.endIndex !== undefined) {
        requests.push({
          deleteContentRange: {
            range: {
              startIndex: op.startIndex,
              endIndex: op.endIndex,
            },
          },
        });
        requests.push({
          insertText: {
            location: { index: op.startIndex },
            text: op.text,
          },
        });
      } else if (op.type === 'insert' && op.index !== undefined) {
        requests.push({
          insertText: {
            location: { index: op.index },
            text: op.text,
          },
        });
      }
    }

    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });

    const url = `https://docs.google.com/document/d/${documentId}/edit`;

    return this.createSuccessResult(step.id, {
      type: 'document',
      title: 'Document updated',
      googleId: documentId,
      url,
      data: {
        documentId,
        url,
        operationsApplied: operations.length,
      },
    });
  }

  private async readDocument(step: PlanStep, docs: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters, ['documentId']);

    const { documentId } = step.parameters;

    const result = await docs.documents.get({
      documentId,
    });

    // Extract text content
    const content = this.extractTextContent(result.data);

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: result.data.title,
      googleId: documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`,
      data: {
        documentId,
        title: result.data.title,
        content,
      },
    });
  }

  private buildContentRequests(content: any[]): any[] {
    const requests = [];
    let index = 1;

    for (const block of content) {
      if (block.type === 'heading') {
        requests.push({
          insertText: {
            location: { index },
            text: block.text + '\n',
          },
        });
        requests.push({
          updateParagraphStyle: {
            range: {
              startIndex: index,
              endIndex: index + block.text.length,
            },
            paragraphStyle: {
              namedStyleType: `HEADING_${block.level || 1}`,
            },
            fields: 'namedStyleType',
          },
        });
        index += block.text.length + 1;
      } else if (block.type === 'paragraph') {
        requests.push({
          insertText: {
            location: { index },
            text: block.text + '\n',
          },
        });
        index += block.text.length + 1;
      }
    }

    return requests;
  }

  private extractTextContent(doc: any): string {
    const content: string[] = [];

    if (doc.body && doc.body.content) {
      for (const element of doc.body.content) {
        if (element.paragraph) {
          const paragraph = element.paragraph;
          if (paragraph.elements) {
            const text = paragraph.elements
              .map((el: any) => el.textRun?.content || '')
              .join('');
            content.push(text);
          }
        }
      }
    }

    return content.join('');
  }
}

export const docsWorker = new DocsWorker();
