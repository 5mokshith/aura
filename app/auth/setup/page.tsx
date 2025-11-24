'use client';

import { Suspense } from 'react';
import { Bot, Mail, FileText, FolderOpen, Sheet, Calendar, CheckCircle2 } from 'lucide-react';
import { OAuthSetup as OAuthSetupComponent } from '@/app/components/auth/OAuthSetup';

// Mock components - replace with your actual components
function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
}

function OAuthSetupWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <OAuthSetupComponent />
    </Suspense>
  );
}

export default function AuthSetupPage() {
  const integrations = [
    { icon: Mail, name: "Gmail", description: "Send and search emails" },
    { icon: FolderOpen, name: "Drive", description: "Search and manage files" },
    { icon: FileText, name: "Docs", description: "Create and edit documents" },
    { icon: Sheet, name: "Sheets", description: "Analyze spreadsheet data" },
    { icon: Calendar, name: "Calendar", description: "Schedule and manage events" }
  ];

  const features = [
    "Natural language instructions",
    "Automatic task planning",
    "Multi-step workflow execution",
    "Automatic verification & correction",
    "Cross-app integrations"
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#0f0f14] text-gray-100">
      {/* Left Side - About AURA */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between border-r border-gray-800">
        <div className="space-y-10">
          {/* Logo & Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">AURA</h1>
                <p className="text-xs text-gray-400">Agentic Unified Reasoning Assistant</p>
              </div>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              An AI-powered agent system that integrates with Google Workspace to automate real-world workflows through natural language.
            </p>
          </div>

          {/* What AURA Does */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">How it works</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-medium">1</span>
                </div>
                <p className="text-gray-400">
                  <span className="text-gray-300 font-medium">Describe your task:</span> Tell AURA what you need in plain English
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-medium">2</span>
                </div>
                <p className="text-gray-400">
                  <span className="text-gray-300 font-medium">AI plans the workflow:</span> Breaks down your request into steps
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-medium">3</span>
                </div>
                <p className="text-gray-400">
                  <span className="text-gray-300 font-medium">Execute across apps:</span> AURA handles Gmail, Drive, Docs, Sheets, and Calendar
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-medium">4</span>
                </div>
                <p className="text-gray-400">
                  <span className="text-gray-300 font-medium">Get results:</span> Validated, verified outcomes delivered to you
                </p>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Workspace Integrations</h2>
            <div className="grid grid-cols-2 gap-3">
              {integrations.map((integration, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <integration.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-200">{integration.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{integration.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Key Capabilities</h2>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Built with Next.js, Node.js, and Supabase</p>
          <p>© 2024 AURA. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">AURA</h1>
              <p className="text-xs text-gray-400">Agentic Unified Reasoning Assistant</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <OAuthSetupWrapper />
          </div>

          {/* Mobile Features Summary */}
          <div className="lg:hidden mt-8 p-6 bg-gray-900/30 border border-gray-800 rounded-xl">
            <h3 className="text-sm font-medium text-gray-300 mb-4">What you can do with AURA</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}