import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './styles/globals.css';
import { QueryProvider } from './components/providers/QueryProvider';
import { SkipLink } from './components/ui/SkipLink';

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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('aura-preferences');
                if (stored) {
                  const prefs = JSON.parse(stored);
                  if (prefs.theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } else {
                  // Default to dark mode
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                // Default to dark mode on error
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 min-h-screen`}
      >
        <SkipLink />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
