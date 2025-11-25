'use client';

import { Suspense } from 'react';
import { Bot, Mail, FileText, FolderOpen, Sheet, Calendar, CheckCircle2 } from 'lucide-react';

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

function OAuthSetupComponent() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">Connect Your Workspace</h2>
        <p className="text-gray-400 text-sm">Authorize AURA to access your Google Workspace apps</p>
      </div>
      
      <div className="space-y-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Mail className="w-5 h-5" />
          Connect Google Account
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-gray-900 text-gray-500">OR</span>
          </div>
        </div>
        
        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Skip for Now
        </button>
      </div>
      
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>By connecting, you agree to our Terms of Service</p>
        <p>We use industry-standard OAuth 2.0 for secure authentication</p>
      </div>
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
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f0f14] to-[#141420] text-gray-100 relative">
      {/* Animated border glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative h-full w-full flex">
        {/* Left Side - About AURA */}
        <div className="hidden lg:flex lg:w-1/2 h-full relative">
          <div className="absolute inset-4">
            {/* Glowing border container */}
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-50 animate-pulse"></div>
              <div className="absolute inset-[2px] bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-black/95 rounded-2xl backdrop-blur-xl"></div>
              
              {/* Content */}
              <div className="relative h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="space-y-8">
                  {/* Logo & Brand with border effect */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 blur-md opacity-50 rounded-lg"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center border border-blue-400/50">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">AURA</h1>
                        <p className="text-xs text-blue-300">Agentic Unified Reasoning Assistant</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed pl-1">
                      An AI-powered agent system that integrates with Google Workspace to automate real-world workflows through natural language.
                    </p>
                  </div>

                  {/* How it works with enhanced borders */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">How it works</h2>
                    <div className="space-y-3">
                      {[
                        { num: "1", title: "Describe your task:", desc: "Tell AURA what you need in plain English" },
                        { num: "2", title: "AI plans the workflow:", desc: "Breaks down your request into steps" },
                        { num: "3", title: "Execute across apps:", desc: "AURA handles Gmail, Drive, Docs, Sheets, and Calendar" },
                        { num: "4", title: "Get results:", desc: "Validated, verified outcomes delivered to you" }
                      ].map((step, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                          <div className="relative flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 group-hover:border-blue-500/50 transition-all">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-blue-600 blur-md opacity-0 group-hover:opacity-50 rounded-full transition-opacity"></div>
                              <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-400/50 flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">{step.num}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-200 font-medium">{step.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Integrations with glowing cards */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace Integrations</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {integrations.map((integration, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                          <div className="relative bg-gray-800/50 border border-gray-700/50 group-hover:border-blue-500/50 rounded-xl p-3 transition-all backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center">
                                <integration.icon className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="text-sm font-semibold text-gray-100">{integration.name}</span>
                            </div>
                            <p className="text-xs text-gray-400">{integration.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Features with bullets */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Capabilities</h2>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/20 border border-gray-700/30 hover:border-blue-500/30 transition-colors">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border border-blue-400/50 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-800/50">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Built with Next.js, Node.js, and Supabase</p>
                    <p>© 2024 AURA. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex-1 h-full flex flex-col relative">
          <div className="absolute inset-4">
            {/* Mobile header */}
            <div className="lg:hidden mb-4 relative">
              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center border border-blue-400/50">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">AURA</h1>
                  <p className="text-[10px] text-blue-300">Agentic Unified Reasoning Assistant</p>
                </div>
              </div>
            </div>

            {/* Auth Card with enhanced borders */}
            <div className="relative h-[calc(100%-5rem)] lg:h-full w-full rounded-2xl overflow-hidden">
              {/* Multi-layered glowing border effect */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-600 via-blue-600 to-purple-600 opacity-30 animate-pulse"></div>
              </div>
              
              {/* Inner container */}
              <div className="absolute inset-[2px] bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-black/95 rounded-2xl backdrop-blur-xl overflow-hidden">
                {/* Content area with scroll */}
                <div className="h-full overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800/50">
                  <div className="max-w-md mx-auto">
                    {/* Decorative top element */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-50 rounded-full"></div>
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-4 border-gray-900 shadow-2xl flex items-center justify-center">
                          <Bot className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    <OAuthSetupWrapper />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}