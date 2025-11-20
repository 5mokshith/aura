'use client';

import { useState } from 'react';
import { ChatInterface } from './components/chat/ChatInterface';
import { TaskVisualizer } from './components/task/TaskVisualizer';
import { QuickActionsPanel } from './components/actions/QuickActionsPanel';
import { Message, TaskStep } from './types/chat';

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTask, setActiveTask] = useState<{
    id: string;
    title: string;
    subtasks: TaskStep[];
    overallStatus: 'pending' | 'running' | 'completed' | 'failed';
  } | undefined>(undefined);

  // Handle sending messages from chat interface
  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // TODO: Call agent API to plan and execute task
    // For now, simulate a response
    await simulateTaskExecution(content);
  };

  // Handle quick action clicks
  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Simulate task execution (placeholder for actual API integration)
  const simulateTaskExecution = async (userPrompt: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const taskId = `task_${Date.now()}`;
    const steps: TaskStep[] = [
      {
        id: 'step_1',
        description: 'Analyze user request and identify required services',
        status: 'completed',
        agent: 'planner',
      },
      {
        id: 'step_2',
        description: 'Execute task using appropriate Google Workspace service',
        status: 'running',
        agent: 'worker',
        googleService: 'gmail',
      },
      {
        id: 'step_3',
        description: 'Validate results and generate summary',
        status: 'pending',
        agent: 'evaluator',
      },
    ];

    // Set active task for visualizer
    setActiveTask({
      id: taskId,
      title: userPrompt,
      subtasks: steps,
      overallStatus: 'running',
    });

    // Create assistant response
    const assistantMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: `I'm working on your request: "${userPrompt}". I've broken it down into ${steps.length} steps.`,
      timestamp: new Date(),
      taskDecomposition: {
        taskId,
        steps,
      },
      executionFeed: [
        {
          stepId: 'step_1',
          message: 'Task planning completed successfully',
          timestamp: new Date(Date.now() - 2000),
          type: 'success',
        },
        {
          stepId: 'step_2',
          message: 'Connecting to Gmail API...',
          timestamp: new Date(Date.now() - 1000),
          type: 'info',
        },
      ],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simulate task completion after 3 seconds
    setTimeout(() => {
      setActiveTask((prev) =>
        prev
          ? {
              ...prev,
              subtasks: prev.subtasks.map((step) => ({
                ...step,
                status: 'completed',
              })),
              overallStatus: 'completed',
            }
          : undefined
      );
    }, 3000);
  };

  return (
    <main className="flex min-h-screen flex-col relative">
      {/* Quick Actions Panel - Top on desktop, drawer on mobile */}
      <div className="hidden md:flex justify-center pt-6 px-6">
        <QuickActionsPanel onActionClick={handleQuickAction} />
      </div>

      {/* Mobile Quick Actions - Drawer */}
      <div className="md:hidden">
        <QuickActionsPanel onActionClick={handleQuickAction} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Chat Interface - Takes full width on mobile, leaves space for sidebar on desktop */}
        <div className="flex-1 md:mr-80 lg:mr-96">
          <ChatInterface
            initialMessages={messages}
            onSendMessage={handleSendMessage}
            className="h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)]"
          />
        </div>

        {/* Task Visualizer - Right sidebar on desktop, bottom drawer on mobile */}
        <TaskVisualizer activeTask={activeTask} />
      </div>

      {/* TODO: Implement Gemini-like voice mode (live mode)
          - Add voice input button to FloatingInput
          - Integrate Web Speech API or Gemini Live API
          - Add audio visualization during voice input
          - Support real-time voice-to-text streaming
      */}
    </main>
  );
}
