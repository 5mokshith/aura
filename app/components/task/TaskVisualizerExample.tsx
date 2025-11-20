'use client';

import { useState, useEffect } from 'react';
import { TaskVisualizer } from './TaskVisualizer';
import { TaskStep } from '@/app/types/chat';

/**
 * Example component demonstrating TaskVisualizer usage
 * This can be used for testing and documentation purposes
 */
export function TaskVisualizerExample() {
  const [activeTask, setActiveTask] = useState<{
    id: string;
    title: string;
    subtasks: TaskStep[];
    overallStatus: 'pending' | 'running' | 'completed' | 'failed';
  } | undefined>();

  useEffect(() => {
    // Simulate an active task
    const exampleTask = {
      id: 'task_example_123',
      title: 'Send quarterly report via email',
      overallStatus: 'running' as const,
      subtasks: [
        {
          id: 'step_1',
          description: 'Search for Q4 report template in Drive',
          status: 'completed' as const,
          agent: 'worker' as const,
          googleService: 'drive' as const,
          startTime: new Date(Date.now() - 5000),
          endTime: new Date(Date.now() - 3000),
        },
        {
          id: 'step_2',
          description: 'Create new document from template',
          status: 'completed' as const,
          agent: 'worker' as const,
          googleService: 'docs' as const,
          startTime: new Date(Date.now() - 3000),
          endTime: new Date(Date.now() - 1000),
        },
        {
          id: 'step_3',
          description: 'Populate document with Q4 data from spreadsheet',
          status: 'running' as const,
          agent: 'worker' as const,
          googleService: 'sheets' as const,
          startTime: new Date(Date.now() - 1000),
        },
        {
          id: 'step_4',
          description: 'Send email to stakeholders with document attached',
          status: 'pending' as const,
          agent: 'worker' as const,
          googleService: 'gmail' as const,
        },
        {
          id: 'step_5',
          description: 'Verify email delivery and document access',
          status: 'pending' as const,
          agent: 'evaluator' as const,
        },
      ],
    };

    setActiveTask(exampleTask);

    // Simulate task progression
    const interval = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev) return prev;

        const subtasks = [...prev.subtasks];
        const runningIndex = subtasks.findIndex((s) => s.status === 'running');

        if (runningIndex !== -1) {
          // Complete the running task
          subtasks[runningIndex] = {
            ...subtasks[runningIndex],
            status: 'completed',
            endTime: new Date(),
          };

          // Start the next pending task
          const nextPendingIndex = subtasks.findIndex((s) => s.status === 'pending');
          if (nextPendingIndex !== -1) {
            subtasks[nextPendingIndex] = {
              ...subtasks[nextPendingIndex],
              status: 'running',
              startTime: new Date(),
            };
          } else {
            // All tasks completed
            return {
              ...prev,
              subtasks,
              overallStatus: 'completed',
            };
          }
        }

        return {
          ...prev,
          subtasks,
        };
      });
    }, 3000); // Progress every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Demo content area */}
      <div className="container mx-auto p-8">
        <div className="glass-panel rounded-xl p-6 max-w-2xl">
          <h1 className="text-2xl font-display font-bold text-white/90 mb-4">
            Task Visualizer Demo
          </h1>
          <p className="text-white/70 mb-4">
            This is a demonstration of the TaskVisualizer component. The task will
            automatically progress through its steps every 3 seconds.
          </p>
          <div className="space-y-2 text-sm text-white/60">
            <p>• On desktop: Check the right sidebar</p>
            <p>• On mobile: Check the bottom drawer</p>
            <p>• Click the collapse button to hide/show the panel</p>
          </div>
        </div>
      </div>

      {/* TaskVisualizer component */}
      <TaskVisualizer activeTask={activeTask} />
    </div>
  );
}
