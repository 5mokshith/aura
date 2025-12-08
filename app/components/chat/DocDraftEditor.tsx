'use client';

import { useState } from 'react';

interface DocDraftEditorProps {
  userId: string;
  draft: {
    title: string;
    body: string;
    taskId?: string;
    stepId?: string;
  };
  onCreated?: (info: { title: string; url?: string }) => void;
  onCancel?: () => void;
}

export function DocDraftEditor({ userId, draft, onCreated, onCancel }: DocDraftEditorProps) {
  const [titleInput, setTitleInput] = useState(draft.title || '');
  const [bodyInput, setBodyInput] = useState(draft.body || '');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!userId) return;

    const title = titleInput.trim();
    const body = bodyInput.trim();

    if (!title) {
      setError('Please provide a document title.');
      return;
    }

    if (!body) {
      setError('Please provide some content for the document.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const paragraphs = body
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const content = paragraphs.map((text) => ({
        type: 'paragraph' as const,
        text,
      }));

      const res = await fetch('/api/docs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title,
          content,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const message = json?.error?.message || 'Failed to create document. Please try again.';
        setError(message);
        return;
      }

      if (onCreated) {
        onCreated({ title: json.data?.title || title, url: json.data?.url });
      }
    } catch (err) {
      setError('Something went wrong while creating the document. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mt-4 glass-panel-md rounded-2xl border border-white/10 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white/90">Review and create Google Doc</h3>
      <div className="space-y-2">
        <label className="block text-xs text-white/60">Title</label>
        <input
          className="w-full rounded-md bg-black/40 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Document title"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs text-white/60">Content</label>
        <textarea
          className="w-full min-h-[220px] rounded-md bg-black/40 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan resize-y"
          value={bodyInput}
          onChange={(e) => setBodyInput(e.target.value)}
          placeholder="Review and edit the document content here..."
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            disabled={isCreating}
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={isCreating}
          onClick={handleCreate}
          className="px-3 py-1.5 rounded-md text-xs font-medium text-black bg-neon-cyan hover:bg-cyan-300 disabled:opacity-60"
        >
          {isCreating ? 'Creating…' : 'Create Doc'}
        </button>
      </div>
    </div>
  );
}
