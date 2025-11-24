import { Suspense } from 'react';
import { Bot, Mail, FileText, FolderOpen, Sheet, Calendar, CheckCircle2 } from 'lucide-react';

// Mock components - replace with your actual components
function OAuthSetup() {
  const handleGoogleAuth = () => {
    console.log('Initiating Google OAuth...');
    // Add your OAuth logic here
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-3">Connect to AURA</h1>
        <p className="text-gray-400 leading-relaxed">
          Sign in with your Google account to grant AURA access to your workspace tools and start automating your workflows.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">AURA will request access to:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Gmail (send and read emails)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Google Drive (search and manage files)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Google Docs (create and edit documents)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Google Sheets (read and write spreadsheets)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Google Calendar (manage events)
            </li>
          </ul>
        </div>

        <button 
          onClick={handleGoogleAuth}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
      
      <div className="pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 leading-relaxed">
          By continuing, you agree to AURA's{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">Privacy Policy</a>. Your data is encrypted and never shared with third parties.
        </p>
      </div>
    </div>
  );
}

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
      <OAuthSetup />
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