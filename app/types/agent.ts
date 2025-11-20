import { GoogleService, TaskStep } from './chat';

export type AgentType = 'planner' | 'worker' | 'evaluator';

export interface TaskPlan {
  taskId: string;
  userId: string;
  title: string;
  steps: PlanStep[];
  createdAt: Date;
}

export interface PlanStep {
  id: string;
  description: string;
  service: GoogleService;
  action: string;
  parameters?: Record<string, any>;
  dependencies?: string[]; // IDs of steps that must complete first
}

export interface WorkerResult {
  stepId: string;
  success: boolean;
  output?: TaskOutput;
  error?: string;
  metadata?: Record<string, any>;
}

export interface TaskOutput {
  type: 'document' | 'email' | 'calendar_event' | 'file' | 'data';
  title: string;
  url?: string;
  googleId?: string;
  data?: any;
}

export interface EvaluationResult {
  valid: boolean;
  issues?: string[];
  suggestions?: string[];
  retrySteps?: string[];
}

export interface ExecutionContext {
  taskId: string;
  userId: string;
  plan: TaskPlan;
  results: Map<string, WorkerResult>;
  startTime: Date;
}
