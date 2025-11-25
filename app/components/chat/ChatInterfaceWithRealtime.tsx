'use client';

import { useState, useCallback } from 'react';
import { Message as MessageType, ExecutionUpdate } from '@/app/types/chat';
import { ChatInterface } from './ChatInterface';
import { useRealtimeLogs, ExecutionLog } from '@/app/hooks/useRealtimeLogs';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { TaskVisualizer } from '../task/TaskVisualizer';
import { SuggestedTaskButton } from './SuggestedTaskButton';

interface ChatInterfaceWithRealtimeProps {
  userId?: string;
  initialMessages?: MessageType[];
  onSendMessage?: (message: string) => Promise<void>;
  className?: string;
}

function buildExecutionSummary(outputs: any[]): string | null {
  if (!outputs || outputs.length === 0) {
    return null;
  }

  const primary = outputs[0];

  // Handle Gmail search/read responses where data.messages contains email list
  if (
    primary?.type === 'data' &&
    primary.data &&
    Array.isArray(primary.data.messages)
  ) {
    const messages = primary.data.messages as any[];

    if (messages.length === 0) {
      return 'I checked your inbox but did not find any emails for this request.';
    }

    const header = `Here are your latest ${messages.length} emails:`;
    const lines = messages.map((m, index) => {
      const from = m.from || 'Unknown sender';
      const subject = m.subject && m.subject.trim() !== '' ? m.subject : '(no subject)';
      const date = m.date || '';

      // First line: numbered subject + sender (and date if available)
      const titleLine = `${index + 1}. ${subject} — ${from}${date ? ` (${date})` : ''}`;

      // Optional second line: a short snippet, trimmed and collapsed
      const rawSnippet = typeof m.snippet === 'string' ? m.snippet.trim().replace(/\s+/g, ' ') : '';
      const maxSnippetLength = 160;
      const snippet = rawSnippet
        ? rawSnippet.length > maxSnippetLength
          ? `${rawSnippet.slice(0, maxSnippetLength).trim()}...`
          : rawSnippet
        : '';

      const snippetLine = snippet ? `   ${snippet}` : '';
      return snippetLine ? `${titleLine}\n${snippetLine}` : titleLine;
    });

    return [header, '', ...lines].join('\n\n');
  }

  // Handle single Gmail read response where data.body contains the email content
  if (primary?.type === 'data' && primary.data && primary.data.body) {
    const { subject, from, date, body } = primary.data as any;
    const safeSubject = subject && subject.trim() !== '' ? subject : '(no subject)';
    const sender = from || 'Unknown sender';
    const when = date || '';

    const header = `Here is the email "${safeSubject}" from ${sender}${when ? ` (${when})` : ''}:`;

    // Avoid dumping an extremely long body into chat
    const maxChars = 1500;
    const textBody = typeof body === 'string' ? body.trim() : '';
    const truncatedBody = textBody.length > maxChars
      ? `${textBody.slice(0, maxChars)}...`
      : textBody;

    return truncatedBody
      ? `${header}\n\n${truncatedBody}`
      : header;
  }

  // Fallback: list output titles if available
  const titles = outputs
    .map((o: any) => o?.title)
    .filter((t: any) => typeof t === 'string' && t.length > 0);

  if (titles.length > 0) {
    return `Task completed. Generated outputs:\n\n${titles
      .map((t: string) => `- ${t}`)
      .join('\n')}`;
  }

  return 'Task completed successfully.';
}

export function ChatInterfaceWithRealtime({
  userId,
  initialMessages = [],
  onSendMessage,
  className = '',
}: ChatInterfaceWithRealtimeProps) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [pendingFollowup, setPendingFollowup] = useState<{
    type:
      | 'drive_search'
      | 'gmail_search'
      | 'calendar_create'
      | 'docs_create'
      | 'gmail_send'
      | 'gmail_read'
      | 'calendar_list'
      | 'docs_update'
      | 'docs_read'
      | 'drive_upload'
      | 'drive_download'
      | 'sheets_read'
      | 'sheets_write';
    originalText?: string;
    gmailSend?: { step: 'to' | 'subject' | 'body'; to?: string; subject?: string; body?: string };
    docsUpdate?: { step: 'doc' | 'ops'; doc?: string; ops?: string };
    driveUpload?: { step: 'filename' | 'content'; filename?: string; content?: string };
    sheetsWrite?: { step: 'sheet' | 'data'; sheet?: string; data?: string };
  } | null>(null);
  const [suggestedTask, setSuggestedTask] = useState<{ description: string; prompt: string } | null>(null);

  // Subscribe to Realtime logs
  const { isConnected, error } = useRealtimeLogs({
    taskId: currentTaskId || undefined,
    userId,
    enabled: !!currentTaskId,
    onLogReceived: handleLogReceived,
  });

  // Handle incoming Realtime logs
  function handleLogReceived(log: ExecutionLog) {
    // Convert log to ExecutionUpdate
    const update: ExecutionUpdate = {
      stepId: log.step_id || log.id,
      message: log.message,
      timestamp: new Date(log.created_at),
      type: log.log_level === 'error' ? 'error' : log.log_level === 'success' ? 'success' : 'info',
    };

    // Find the assistant message for this task and update its execution feed
    setMessages((prev) =>
      prev.map((msg) => {
        if (
          msg.role === 'assistant' &&
          msg.taskDecomposition?.taskId === log.task_id
        ) {
          return {
            ...msg,
            executionFeed: [...(msg.executionFeed || []), update],
          };
        }
        return msg;
      })
    );

    // Update task step status if metadata contains status
    if (log.metadata?.status && log.step_id) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.role === 'assistant' &&
            msg.taskDecomposition?.taskId === log.task_id
          ) {
            return {
              ...msg,
              taskDecomposition: {
                ...msg.taskDecomposition,
                steps: msg.taskDecomposition.steps.map((step) =>
                  step.id === log.step_id
                    ? { ...step, status: log.metadata.status }
                    : step
                ),
              },
            };
          }
          return msg;
        })
      );
    }
  }

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (content: string) => {
      // Create user message
      const userMessage: MessageType = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Pre-handle greetings and missing-parameter intents before planning
      const text = (content || '').trim();
      const greetingRe = /^(hi|hello|hey|yo|hola|namaste|sup|good\s+(morning|afternoon|evening)|gm|gn)\b[!. ]*/i;
      const ambiguousDriveRe = /^(search|find|browse|look up|list)\s+(my\s+)?(drive|google\s+drive|files|documents)\.?$/i;
      const ambiguousGmailRe = /^(search|find|check|look up|browse|list)\s+(my\s+)?(gmail|inbox|emails?)\.?$/i;
      const gmailSendRe = /\b(send|compose|draft)\b[\s\S]*\b(mail|email)\b/i;
      const emailVerbRe = /^(email|mail)\b/i;
      const calendarCreateRe = /^(schedule|create|add|set\s*up|book|arrange)\b[\s\S]*\b(event|meeting|calendar)\b/i;
      const dateTimeRe = /(today|tomorrow|tonight|this\s+(morning|afternoon|evening|week|weekend)|next\s+(week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\b\d{4}-\d{2}-\d{2}|\b\d{1,2}:[0-5]\d\s?(a\.?m\.?|p\.?m\.?)?|\b\d{1,2}\s?(am|pm)\b|noon|midnight|\b\d{1,2}(st|nd|rd|th)\b|\b(UTC|GMT|IST|PST|PDT|EST|EDT|CET|CEST|BST|JST)\b| at | on )/i;
      const docsCreateRe = /^(create|make|start|new)\s+(a\s+)?(doc|document|google\s+doc)s?(?!.*\b(title|named|called)\b)/i;
      const gmailReadRe = /\b(read|open|show|view)\b[\s\S]*\b(email|mail|message)\b/i;
      const calendarListRe = /\b(list|show|get)\b[\s\S]*\b(events|meetings|calendar)\b/i;
      const docsUpdateRe = /\b(update|edit|append|modify)\b[\s\S]*\b(doc|document|google\s+doc)\b/i;
      const docsReadRe = /\b(open|read|show|view)\b[\s\S]*\b(doc|document|google\s+doc)\b/i;
      const driveUploadRe = /\b(upload|add|save)\b[\s\S]*\b(file|document)\b[\s\S]*\b(drive|google\s+drive)\b/i;
      const driveDownloadRe = /\b(download|get|fetch)\b[\s\S]*\b(file|document)\b[\s\S]*\b(drive|google\s+drive)\b/i;
      const sheetsReadRe = /\b(read|show|get|view)\b[\s\S]*\b(sheet|spreadsheet|google\s+sheets)\b/i;
      const sheetsWriteRe = /\b(write|append|add|update)\b[\s\S]*\b(sheet|spreadsheet|google\s+sheets)\b/i;

      let promptToPlan = text;
      if (pendingFollowup) {
        if (pendingFollowup.type === 'drive_search') {
          promptToPlan = `Search my drive for "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'gmail_search') {
          promptToPlan = `Search my Gmail for "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'calendar_create') {
          promptToPlan = `Schedule: ${pendingFollowup.originalText || ''} on ${text}`.trim();
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'docs_create') {
          promptToPlan = `Create a Google Doc titled "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'gmail_send') {
          const gs = pendingFollowup.gmailSend || { step: 'to' as const };
          if (gs.step === 'to') {
            const nextGs = { ...gs, to: text, step: 'subject' as const };
            setPendingFollowup({ type: 'gmail_send', gmailSend: nextGs });
            const askSubject: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: 'What\'s the subject of the email?',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, askSubject]);
            return;
          } else if (gs.step === 'subject') {
            const nextGs = { ...gs, subject: text, step: 'body' as const };
            setPendingFollowup({ type: 'gmail_send', gmailSend: nextGs });
            const askBody: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: 'What should the email say?',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, askBody]);
            return;
          } else if (gs.step === 'body') {
            const to = gs.to || 'recipient';
            const subject = gs.subject || '';
            const body = text;
            promptToPlan = `Send an email to ${to} with subject "${subject}" and body "${body}"`;
            setPendingFollowup(null);
          }
        } else if (pendingFollowup.type === 'gmail_read') {
          promptToPlan = `Read Gmail message related to "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'calendar_list') {
          promptToPlan = `List calendar events for ${text}`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'docs_update') {
          const du = pendingFollowup.docsUpdate || { step: 'doc' as const };
          if (du.step === 'doc') {
            const next = { ...du, doc: text, step: 'ops' as const };
            setPendingFollowup({ type: 'docs_update', docsUpdate: next });
            const askOps: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: 'What should I change? For example: append a section, replace text, or add a paragraph.',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, askOps]);
            return;
          } else {
            const doc = du.doc || 'the document';
            const ops = text;
            promptToPlan = `Update Google Doc "${doc}" with the following changes: ${ops}`;
            setPendingFollowup(null);
          }
        } else if (pendingFollowup.type === 'docs_read') {
          promptToPlan = `Read Google Doc "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'drive_upload') {
          const up = pendingFollowup.driveUpload || { step: 'filename' as const };
          if (up.step === 'filename') {
            const next = { ...up, filename: text, step: 'content' as const };
            setPendingFollowup({ type: 'drive_upload', driveUpload: next });
            const askContent: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: 'Please paste or describe the content for the file.',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, askContent]);
            return;
          } else {
            const filename = up.filename || 'untitled.txt';
            const content = text;
            promptToPlan = `Upload a file named "${filename}" to Drive with content: ${content}`;
            setPendingFollowup(null);
          }
        } else if (pendingFollowup.type === 'drive_download') {
          promptToPlan = `Download file from Drive matching "${text}"`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'sheets_read') {
          promptToPlan = `Read from Google Sheets: ${text}`;
          setPendingFollowup(null);
        } else if (pendingFollowup.type === 'sheets_write') {
          const sw = pendingFollowup.sheetsWrite || { step: 'sheet' as const };
          if (sw.step === 'sheet') {
            const next = { ...sw, sheet: text, step: 'data' as const };
            setPendingFollowup({ type: 'sheets_write', sheetsWrite: next });
            const askData: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: 'What data should I write? You can provide comma-separated rows or a brief description.',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, askData]);
            return;
          } else {
            const sheet = sw.sheet || 'Sheet1!A1';
            const data = text;
            promptToPlan = `Write to Google Sheets at ${sheet}: ${data}`;
            setPendingFollowup(null);
          }
        }
      } else {
        // Handle greetings with a friendly intro and suggestions
        if (greetingRe.test(text)) {
          const introMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content:
              'Hi! I\'m AURA — your workspace assistant for Gmail, Drive, Docs, Sheets, and Calendar. Try things like:\n\n• Search Drive for invoices from last month\n• Summarize the latest meeting notes in Docs\n• Schedule a 30‑min sync tomorrow at 3pm\n• Send an email draft to the team',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, introMessage]);
          return;
        }

        // Ask a follow-up if Drive search intent lacks a query
        if (ambiguousDriveRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content:
              'What would you like me to search for in Drive? You can specify keywords (e.g., "Q4 report"), file types (PDF, Google Docs), or a date range.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'drive_search' });
          return;
        }

        // Start Gmail send mini-flow (collect to, subject, body)
        if (gmailSendRe.test(text) || emailVerbRe.test(text)) {
          const askRecipient: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Who should I send it to? You can provide one or more emails, comma-separated.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askRecipient]);
          setPendingFollowup({ type: 'gmail_send', gmailSend: { step: 'to' } });
          return;
        }

        if (ambiguousGmailRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content:
              'What should I search for in Gmail? You can provide keywords, sender, subject, or a date range.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'gmail_search' });
          return;
        }

        if (calendarCreateRe.test(text) && !dateTimeRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content:
              'When should I schedule it? Please include the date and time (with timezone), and optionally duration and attendees.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'calendar_create', originalText: text });
          return;
        }

        if (docsCreateRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content:
              'What title should I use for the Google Doc?',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'docs_create', originalText: text });
          return;
        }

        // Gmail read follow-up
        if (gmailReadRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which email should I open? Provide subject, sender, or a timeframe.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'gmail_read' });
          return;
        }

        // Calendar list follow-up
        if (calendarListRe.test(text) && !dateTimeRe.test(text)) {
          const followupMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'For what timeframe should I list events? (e.g., today, this week, next 7 days)',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followupMessage]);
          setPendingFollowup({ type: 'calendar_list' });
          return;
        }

        // Docs update and read follow-ups
        if (docsUpdateRe.test(text)) {
          const askDoc: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which document should I update? Provide the title or paste the link.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askDoc]);
          setPendingFollowup({ type: 'docs_update', docsUpdate: { step: 'doc' } });
          return;
        }
        if (docsReadRe.test(text)) {
          const askDoc: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which document should I open? Provide the title or paste the link.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askDoc]);
          setPendingFollowup({ type: 'docs_read' });
          return;
        }

        // Drive upload/download follow-ups
        if (driveUploadRe.test(text)) {
          const askFilename: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'What is the filename (including extension)?',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askFilename]);
          setPendingFollowup({ type: 'drive_upload', driveUpload: { step: 'filename' } });
          return;
        }
        if (driveDownloadRe.test(text)) {
          const askFile: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which file should I download from Drive? Provide the name or describe it.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askFile]);
          setPendingFollowup({ type: 'drive_download' });
          return;
        }

        // Sheets read/write follow-ups
        if (sheetsReadRe.test(text)) {
          const askRange: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which spreadsheet and range should I read? (e.g., Budget Q4, Sheet1!A1:C20)',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askRange]);
          setPendingFollowup({ type: 'sheets_read' });
          return;
        }
        if (sheetsWriteRe.test(text)) {
          const askSheet: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: 'Which spreadsheet and range should I write to? (e.g., Budget Q4, Sheet1!A2)',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, askSheet]);
          setPendingFollowup({ type: 'sheets_write', sheetsWrite: { step: 'sheet' } });
          return;
        }
      }

      try {
        if (onSendMessage) {
          await onSendMessage(promptToPlan);
        } else {
          if (!userId) {
            throw new Error('User not authenticated. Please connect Google Workspace and refresh the page.');
          }

          // Conversational API: /api/chat
          const history = messages.map((m) => ({ role: m.role, content: m.content }));
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: promptToPlan, userId, conversationHistory: history }),
          });

          if (!response.ok) {
            throw new Error('Chat service failed');
          }

          const chatResult = await response.json();
          if (!chatResult.success || !chatResult.data) {
            throw new Error(chatResult.error?.message || 'Chat service error');
          }

          const { message: assistantText, suggestedTask: suggestion } = chatResult.data;

          // Append assistant reply
          const assistantMessage: MessageType = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: assistantText || ' ',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Surface suggested task (if any)
          if (suggestion && suggestion.prompt) {
            setSuggestedTask({ description: suggestion.description || 'Suggested task', prompt: suggestion.prompt });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);

        const errorMessage: MessageType = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    [userId, onSendMessage, pendingFollowup]
  );

  const executeSuggestedTask = useCallback(
    async () => {
      if (!suggestedTask || !userId) return;
      try {
        const planRes = await fetch('/api/agent/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: suggestedTask.prompt, userId }),
        });

        if (!planRes.ok) throw new Error('Failed to plan task');
        const planJson = await planRes.json();
        if (!planJson.success || !planJson.data) throw new Error(planJson.error?.message || 'Failed to plan task');

        const { taskId, steps, title } = planJson.data;
        setCurrentTaskId(taskId);

        const assistantMessage: MessageType = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'I\'ve prepared a plan. Executing it now...',
          timestamp: new Date(),
          taskDecomposition: {
            taskId,
            ...(title ? { title } : {}),
            steps: steps.map((step: any) => ({
              id: step.id,
              description: step.description,
              status: step.status ?? 'pending',
              agent: step.agent || 'worker',
              googleService: step.googleService,
            })),
          },
          executionFeed: [],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const execRes = await fetch('/api/agent/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, userId }),
        });
        if (!execRes.ok) throw new Error('Failed to execute task');
        const execJson = await execRes.json();
        if (execJson?.success && execJson.data) {
          const { status, outputs, error: executionError } = execJson.data;

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.role === 'assistant' && msg.taskDecomposition?.taskId === taskId) {
                const td = msg.taskDecomposition!;
                return {
                  ...msg,
                  taskDecomposition: {
                    taskId: td.taskId,
                    steps: td.steps.map((step) => ({
                      ...step,
                      status: status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : step.status,
                      error: status === 'failed' ? executionError || step.error : step.error,
                    })),
                  },
                };
              }
              return msg;
            })
          );

          const summaryContent = buildExecutionSummary(outputs);
          if (summaryContent) {
            const resultMessage: MessageType = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              role: 'assistant',
              content: summaryContent,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, resultMessage]);
          }
        }
      } catch (err) {
        console.error('executeSuggestedTask error:', err);
      } finally {
        setSuggestedTask(null);
      }
    },
    [suggestedTask, userId]
  );

  // Derive active task from messages
  const activeTask = messages
    .filter((m) => m.role === 'assistant' && m.taskDecomposition)
    .map((m) => ({
      id: m.taskDecomposition!.taskId,
      // Prefer a title provided by the backend/model (e.g. Gemini),
      // then fall back to the first step description.
      title:
        (m.taskDecomposition as any).title ||
        m.taskDecomposition!.steps[0]?.description ||
        'Untitled Task',
      subtasks: m.taskDecomposition!.steps,
      overallStatus: m.taskDecomposition!.steps.every((s) => s.status === 'completed')
        ? 'completed'
        : m.taskDecomposition!.steps.some((s) => s.status === 'failed')
          ? 'failed'
          : 'running',
    }))
    .pop() as any; // Cast to any to match TaskVisualizer props for now, or refine type

  return (
    <div className="flex h-full gap-4 lg:gap-6 bg-[#050712]/90 rounded-2xl border border-white/5 shadow-glass-lg p-3 sm:p-4 lg:p-5">
      <div className="flex-1 min-w-0 relative h-full">
        {/* Connection Status Indicator */}
        {currentTaskId && (
          <div className="absolute top-4 right-4 z-10">
            <div
              className={`glass-panel-sm px-3 py-2 rounded-full flex items-center gap-2 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'
                }`}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-16 right-4 z-10 max-w-xs">
            <div className="glass-panel-md p-3 rounded-lg border-l-4 border-red-500">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-300 font-medium">Connection Error</p>
                  <p className="text-xs text-white/60 mt-1">{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <ChatInterface
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          className={className}
        />

        {suggestedTask && (
          <div className="mt-3">
            <SuggestedTaskButton
              description={suggestedTask.description}
              onStart={executeSuggestedTask}
            />
          </div>
        )}
      </div>

      {/* Task Visualizer - Desktop Sidebar */}
      <div className="hidden lg:flex w-80 xl:w-96 shrink-0 h-full">
        <TaskVisualizer activeTask={activeTask} className="w-full" />
      </div>
    </div>
  );
}
