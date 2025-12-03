'use client';

import { useState } from 'react';
import { Message as MessageType, EmailListItem } from '@/app/types/chat';
import { ExecutionFeed, ExecutionStatus } from './ExecutionFeed';
import { motion } from 'framer-motion';
import {
  Mail,
  FolderOpen,
  FileText,
  Sheet,
  Calendar,
  User,
  Bot,
  ChevronDown,
} from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'glass-panel-md'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-neon-cyan" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={isUser ? 'message-user' : 'message-assistant'}>
          {/* Message Text */}
          <p className="text-white/90 whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {message.emailList && message.emailList.length > 0 && (
            <div className="mt-4 space-y-2">
              <EmailList emails={message.emailList} />
            </div>
          )}

          {/* Task Decomposition */}
          {message.taskDecomposition && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-white/80 mb-3">
                Task Breakdown
              </h4>
              {message.taskDecomposition.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`task-card-${step.status}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-white/50 text-xs font-mono mt-0.5 flex-shrink-0">
                        {index + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 break-words">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {step.googleService && (
                            <ServiceBadge service={step.googleService} />
                          )}
                          <AgentBadge agent={step.agent} />
                        </div>
                      </div>
                    </div>
                    <ExecutionStatus status={step.status} />
                  </div>
                  {step.error && (
                    <p className="text-xs text-red-400 mt-2 ml-6">
                      Error: {step.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Execution Feed */}
          {message.executionFeed && message.executionFeed.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-3">
                Live Updates
              </h4>
              <ExecutionFeed updates={message.executionFeed} />
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-white/30 mt-3">
            {formatTimestamp(message.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceBadge({ service }: { service: string }) {
  const config = {
    gmail: { icon: Mail, label: 'Gmail', color: 'text-red-400' },
    drive: { icon: FolderOpen, label: 'Drive', color: 'text-yellow-400' },
    docs: { icon: FileText, label: 'Docs', color: 'text-blue-400' },
    sheets: { icon: Sheet, label: 'Sheets', color: 'text-green-400' },
    calendar: { icon: Calendar, label: 'Calendar', color: 'text-purple-400' },
  };

  const { icon: Icon, label, color } = config[service as keyof typeof config] || config.drive;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
      <Icon className={`w-3 h-3 ${color}`} />
      <span className="text-xs text-white/70">{label}</span>
    </div>
  );
}

function AgentBadge({ agent }: { agent: string }) {
  const config = {
    planner: { label: 'Planner', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    worker: { label: 'Worker', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    evaluator: { label: 'Evaluator', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  };

  const { label, color } = config[agent as keyof typeof config] || config.worker;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs border ${color}`}>
      {label}
    </div>
  );
}

function EmailList({ emails }: { emails: EmailListItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {emails.map((email, index) => {
        const isExpanded = expandedId === email.id;
        const subject = email.subject && email.subject.trim() !== '' ? email.subject : '(no subject)';
        const from = email.from || 'Unknown sender';
        const date = email.date || '';
        const snippet = email.snippet || '';
        const body = email.body || '';

        return (
          <div
            key={email.id || `${index}`}
            className="glass-panel-md rounded-xl border border-white/10 px-3 py-2"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 text-left"
              onClick={() => setExpandedId(isExpanded ? null : email.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 break-words">
                  {index + 1}. {subject}
                </p>
                <p className="text-xs text-white/60 mt-0.5 break-words">
                  {from}
                  {date ? ` (${date})` : ''}
                </p>
                {!isExpanded && snippet && (
                  <p className="text-xs text-white/70 mt-1 line-clamp-2 break-words">
                    {snippet}
                  </p>
                )}
              </div>
              <div className="flex items-center mt-1">
                <ChevronDown
                  className={`w-4 h-4 text-white/60 transition-transform ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </button>
            {isExpanded && body && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-xs text-white/80 whitespace-pre-wrap break-words">
                  {body}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
