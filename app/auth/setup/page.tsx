'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaRobot } from 'react-icons/fa6';
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
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center items-center p-10">
        <div className="mb-6 text-center">
          <div className="text-4xl font-bold mb-2"></div>
          <h1 className="text-3xl font-semibold mb-2">Log in</h1>
          <p className="text-gray-400">Welcome back! Please login to continue.</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || !termsAccepted}
          className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 py-3 mb-3 rounded border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              <FcGoogle className="mr-2" /> Continue with Google
            </>
          )}
        </button>

        <div className="flex items-center my-4">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-400 cursor-pointer">
            I agree to the Terms & Conditions
          </label>
        </div>
      </div>

      {/* Right side - Gradient background */}
      <div className="w-1/2 relative flex justify-center items-center" style={{
        background: 'linear-gradient(180deg, #1a2a6c, #b21f1f, #fdbb2d)'
      }}>
        <div className="absolute w-3/4">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl mr-4 shadow-lg flex items-center justify-center">
              <FaRobot className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-md">AURA</h2>
              <p className="text-blue-100 text-sm font-medium tracking-wide drop-shadow-sm">Agentic Unified Reasoning Assistant</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Ask AURA to make your work easier."
            className="w-full py-4 px-6 rounded-2xl text-white text-lg focus:outline-none shadow-lg bg-white/10 backdrop-blur-md placeholder:text-white/70 placeholder:font-bold"
          />
        </div>
      </div>
    </div>
  );
}