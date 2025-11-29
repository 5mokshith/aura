'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaRobot } from 'react-icons/fa6';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // Call the OAuth redirect endpoint
      const response = await fetch('/api/auth/google/redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // Store CSRF token in sessionStorage for verification
        if (data.csrfToken) {
          sessionStorage.setItem('oauth_csrf_token', data.csrfToken);
        }

        // Redirect to Google OAuth
        window.location.href = data.redirectUrl;
      } else {
        console.error('Failed to initiate OAuth:', data.error);
        alert('Failed to connect with Google. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Login */}
      <div className="w-1/2 bg-[#0f1419] text-white flex flex-col justify-center items-center px-20">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold mb-3">Log in</h1>
          <p className="text-gray-400 mb-12">Welcome back!</p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || !termsAccepted}
            className="flex items-center justify-center w-full bg-[#1a2332] hover:bg-[#232d3f] py-4 px-6 mb-6 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <FcGoogle className="mr-3 text-xl" /> Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-400 cursor-pointer">
              I agree to the <span className="underline">Terms & Conditions</span>
            </label>
          </div>

          <div className="mt-auto pt-20">
            <p className="text-gray-600 text-sm">© 2024 AURA. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side - Gradient background with AURA branding */}
      <div
        className="w-1/2 relative flex flex-col justify-center items-center p-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #5b4d9f 0%, #a84d6f 30%, #d85f4f 60%, #ff7f3f 100%)'
        }}
      >
        {/* Decorative Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large circle bottom right */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-[3px] border-white/10"></div>
          {/* Medium circle bottom right */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border-[2px] border-white/10"></div>
          {/* Small accent circle */}
          <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full border-[2px] border-white/10"></div>
        </div>

        <div className="w-full max-w-lg relative z-10">
          {/* AURA Logo and Title */}
          <div className="flex flex-col items-center mb-12">
            <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-2xl">
              <FaRobot className="text-white text-4xl" />
            </div>
            <h2 className="text-6xl font-bold text-white tracking-tight mb-2">AURA</h2>
            <p className="text-white/90 text-base font-medium tracking-wide">Agentic Unified Reasoning Assistant</p>
          </div>

          {/* Input Field with Arrow Button */}
          <div className="relative mb-12">
            <input
              type="text"
              placeholder="Ask AURA anything..."
              className="w-full py-5 px-6 pr-16 rounded-2xl text-white text-base focus:outline-none shadow-2xl bg-white/10 backdrop-blur-md placeholder:text-white/60 border border-white/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-full p-3 transition-all shadow-lg">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-base">Automate tedious tasks</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-base">Integrate with your Google Workspace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}