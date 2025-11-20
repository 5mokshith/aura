'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { Mail, Calendar, FileText, Send } from 'lucide-react';

/**
 * Glassmorphism Components Example
 * 
 * This component demonstrates the usage of the glassmorphism design system components.
 * It showcases buttons, inputs, and modals with various configurations.
 */
export const GlassmorphismExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Invalid email address');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-panel p-6 rounded-lg animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">
            Glassmorphism Design System
          </h1>
          <p className="text-white/70">
            Explore the AURA glassmorphism components with neon accents and smooth animations.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="glass-panel p-6 rounded-lg animate-slide-up">
          <h2 className="text-2xl font-semibold text-white mb-4">Buttons</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="cyan">Cyan</Button>
                <Button variant="purple">Purple</Button>
                <Button variant="pink">Pink</Button>
                <Button variant="blue">Blue</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="cyan" size="sm">Small</Button>
                <Button variant="cyan" size="md">Medium</Button>
                <Button variant="cyan" size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">With Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="cyan">
                  <Mail className="w-5 h-5" />
                  Send Email
                </Button>
                <Button variant="purple">
                  <Calendar className="w-5 h-5" />
                  Schedule
                </Button>
                <Button variant="pink">
                  <FileText className="w-5 h-5" />
                  Create Doc
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/70 mb-2">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="cyan" isLoading>
                  Loading...
                </Button>
                <Button variant="purple" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="glass-panel p-6 rounded-lg animate-slide-up">
          <h2 className="text-2xl font-semibold text-white mb-4">Inputs</h2>
          
          <div className="space-y-4 max-w-md">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              errorText={emailError}
              isRequired
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              helperText="Must be at least 8 characters"
              isRequired
            />

            <Input
              label="Username"
              type="text"
              placeholder="Choose a username"
              helperText="This will be visible to others"
            />

            <Button
              variant="cyan"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full"
            >
              <Send className="w-5 h-5" />
              Submit Form
            </Button>
          </div>
        </div>

        {/* Task Cards Section */}
        <div className="glass-panel p-6 rounded-lg animate-slide-up">
          <h2 className="text-2xl font-semibold text-white mb-4">Task Cards</h2>
          
          <div className="space-y-4">
            <div className="task-card-pending">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Pending Task</h3>
                <span className="status-pending">Pending</span>
              </div>
              <p className="text-sm text-white/70">
                This task is waiting to be executed.
              </p>
            </div>

            <div className="task-card-running">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Running Task</h3>
                <span className="status-running">Running</span>
              </div>
              <p className="text-sm text-white/70">
                This task is currently being executed with a pulsing glow effect.
              </p>
            </div>

            <div className="task-card-completed">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Completed Task</h3>
                <span className="status-completed">Completed</span>
              </div>
              <p className="text-sm text-white/70">
                This task has been successfully completed.
              </p>
            </div>

            <div className="task-card-failed">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Failed Task</h3>
                <span className="status-failed">Failed</span>
              </div>
              <p className="text-sm text-white/70">
                This task encountered an error during execution.
              </p>
            </div>
          </div>
        </div>

        {/* Message Bubbles Section */}
        <div className="glass-panel p-6 rounded-lg animate-slide-up">
          <h2 className="text-2xl font-semibold text-white mb-4">Message Bubbles</h2>
          
          <div className="space-y-4">
            <div className="message-user">
              <p className="text-white">
                This is a user message bubble, right-aligned with glassmorphism styling.
              </p>
            </div>

            <div className="message-assistant">
              <p className="text-white mb-2">
                This is an assistant message bubble, left-aligned with stronger glass effect.
              </p>
              <div className="task-card mt-2">
                <p className="text-sm text-white/80">
                  Task decomposition can be displayed within assistant messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Success!"
        size="md"
      >
        <p className="text-white/90 mb-4">
          Your form has been submitted successfully. This modal demonstrates the glassmorphism modal component with focus trapping and keyboard navigation.
        </p>
        <div className="flex gap-4">
          <Button variant="cyan" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="default" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GlassmorphismExample;
