import { TaskStep } from './chat';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AgentPlanRequest {
  prompt: string;
  userId: string;
  conversationId?: string;
  userTimeZone?: string;
  userLocalDate?: string;
}

export interface AgentPlanResponse {
  taskId: string;
  steps: TaskStep[];
  title?: string;
  conversationId?: string;
}

export interface AgentExecuteRequest {
  taskId: string;
  userId: string;
  conversationId?: string;
  mode?: 'auto' | 'preview';
}

export interface AgentExecuteResponse {
  taskId: string;
  status: 'completed' | 'failed';
  outputs: TaskOutput[];
  error?: string;
}

export interface TaskOutput {
  type: 'document' | 'email' | 'calendar_event' | 'file' | 'data';
  title: string;
  url?: string;
  googleId?: string;
  data?: any;
}

export interface GmailSendRequest {
  to: string[];
  subject: string;
  body: string;
  attachments?: Attachment[];
}

export interface EmailSendRequest {
  taskId?: string;
  stepId?: string;
  userId?: string;
  conversationId?: string;
  to: string | string[];
  subject: string;
  body: string;
}

export interface Attachment {
  filename: string;
  mimeType: string;
  data: string; // Base64 encoded
}

export interface DriveSearchRequest {
  query: string;
  fileType?: string;
  limit?: number;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
  thumbnailLink?: string;
}
