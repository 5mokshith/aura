import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURA - Agentic Unified Reasoning Assistant',
  description: 'AI-powered conversational interface for Google Workspace automation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
