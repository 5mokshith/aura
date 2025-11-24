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
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed top-4 right-4 z-50 glass-button-cyan p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle quick actions"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile: Vertical Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-30 glass-overlay backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`
                md:hidden fixed top-0 right-0 h-full w-72 z-40
                glass-panel-strong border-l border-white/10
                shadow-2xl
                ${className}
              `}
            >
              <div className="flex flex-col gap-4 p-6 mt-20 overflow-y-auto h-[calc(100vh-5rem)]">
                <h3 className="text-lg font-display font-semibold text-white/90 mb-2">Quick Actions</h3>
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <QuickActionButton
                      action={action}
                      onClick={handleActionClick}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop: Grid Layout */}
      <div
        className={`
          hidden md:grid
          grid-cols-2 lg:grid-cols-3
          gap-4 lg:gap-6
          max-w-4xl mx-auto
          ${className}
        `}
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <QuickActionButton
              action={action}
              onClick={handleActionClick}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
