'use client';

import { useState, type KeyboardEvent } from 'react';

interface EmailDraftEditorProps {
  userId: string;
  draft: {
    to: string | string[];
    subject: string;
    body: string;
  };
  onSent?: (info: { to: string | string[]; subject: string }) => void;
  onCancel?: () => void;
}

export function EmailDraftEditor({ userId, draft, onSent, onCancel }: EmailDraftEditorProps) {
  const [toInput, setToInput] = useState(
    Array.isArray(draft.to) ? draft.to.join(', ') : draft.to || ''
  );
  const [subjectInput, setSubjectInput] = useState(draft.subject || '');
  const [bodyInput, setBodyInput] = useState(draft.body || '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBodyKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Let the textarea handle Enter normally (insert newline),
    // but prevent any global key handlers from hijacking it.
    e.stopPropagation();
  };

  const handleSend = async () => {
    if (!userId) return;

    const recipients = toInput
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (recipients.length === 0) {
      setError('Please enter at least one recipient email address.');
      return;
    }

    if (!subjectInput.trim()) {
      setError('Please provide an email subject.');
      return;
    }

    if (!bodyInput.trim()) {
      setError('Please provide an email body.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          to: recipients,
          subject: subjectInput,
          body: bodyInput,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const message = json?.error?.message || 'Failed to send email. Please try again.';
        setError(message);
        return;
      }

      if (onSent) {
        onSent({ to: recipients, subject: subjectInput });
      }
    } catch (err) {
      setError('Something went wrong while sending the email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4 glass-panel-md rounded-2xl border border-white/10 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white/90">Review and send email</h3>
      <div className="space-y-2">
        <label className="block text-xs text-white/60">To</label>
        <input
          className="w-full rounded-md bg-black/40 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          value={toInput}
          onChange={(e) => setToInput(e.target.value)}
          placeholder="Enter recipient email(s), separated by commas"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs text-white/60">Subject</label>
        <input
          className="w-full rounded-md bg-black/40 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          placeholder="Email subject"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs text-white/60">Email body</label>
        <textarea
          className="w-full min-h-[180px] rounded-md bg-black/40 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan resize-y"
          value={bodyInput}
          onChange={(e) => setBodyInput(e.target.value)}
          onKeyDown={handleBodyKeyDown}
          placeholder="Review and edit the email content here..."
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            disabled={isSending}
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={isSending}
          onClick={handleSend}
          className="px-3 py-1.5 rounded-md text-xs font-medium text-black bg-blue-600 hover:bg-cyan-300 disabled:opacity-60"
        >
          {isSending ? 'Sending…' : 'Send email'}
        </button>
      </div>
    </div>
  );
}
