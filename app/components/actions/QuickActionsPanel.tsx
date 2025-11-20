'use client';

import { useState } from 'react';
import {
  Mail,
  FolderSearch,
  Calendar,
  FileText,
  FileEdit,
  Send,
  X,
  Menu,
} from 'lucide-react';
import { QuickActionButton, QuickAction } from './QuickActionButton';

interface QuickActionsPanelProps {
  onActionClick: (prompt: string) => void;
  className?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'gmail',
    label: 'Open Gmail',
    icon: Mail,
    prompt: 'Show my latest emails',
    color: 'cyan',
  },
  {
    id: 'drive',
    label: 'Find a file',
    icon: FolderSearch,
    prompt: 'Search my Drive',
    color: 'blue',
  },
  {
    id: 'calendar',
    label: 'Create event',
    icon: Calendar,
    prompt: 'Add calendar event',
    color: 'purple',
  },
  {
    id: 'summarize',
    label: 'Summarize doc',
    icon: FileText,
    prompt: 'Summarize a document',
    color: 'pink',
  },
  {
    id: 'newdoc',
    label: 'New Google Doc',
    icon: FileEdit,
    prompt: 'Create a new Google Doc',
    color: 'cyan',
  },
  {
    id: 'email',
    label: 'Draft email',
    icon: Send,
    prompt: 'Draft an email',
    color: 'purple',
  },
];

export function QuickActionsPanel({ onActionClick, className = '' }: QuickActionsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (prompt: string) => {
    onActionClick(prompt);
    // Close drawer on mobile after action
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile: Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 glass-button-cyan p-3 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle quick actions"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile: Vertical Drawer */}
      <div
        className={`
          md:hidden fixed top-0 right-0 h-full w-64 z-40
          glass-sidebar
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `}
      >
        <div className="flex flex-col gap-3 p-4 mt-16">
          {quickActions.map((action) => (
            <QuickActionButton
              key={action.id}
              action={action}
              onClick={handleActionClick}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 glass-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop: Horizontal Layout */}
      <div
        className={`
          hidden md:flex
          items-center justify-center gap-4
          glass-panel
          rounded-2xl p-4
          ${className}
        `}
      >
        {quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={handleActionClick}
          />
        ))}
      </div>
    </>
  );
}
