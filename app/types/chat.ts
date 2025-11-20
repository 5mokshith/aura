export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskDecomposition?: TaskDecomposition;
  executionFeed?: ExecutionUpdate[];
}

export interface TaskDecomposition {
  taskId: string;
  steps: TaskStep[];
}

export interface TaskStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent: 'planner' | 'worker' | 'evaluator';
  googleService?: GoogleService;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface ExecutionUpdate {
  stepId: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
}

export type GoogleService = 'gmail' | 'drive' | 'docs' | 'sheets' | 'calendar';

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type AgentType = 'planner' | 'worker' | 'evaluator';
