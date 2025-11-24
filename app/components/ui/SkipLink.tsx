'use client';

/**
 * Skip to Main Content Link
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 * 
 * Provides keyboard users a way to skip repetitive navigation
 * and jump directly to the main content area.
 */

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({ href = '#main-content', children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground focus:top-0 focus:left-0"
    >
      {children}
    </a>
  );
}

/**
 * Main Content Wrapper
 * Provides the target for skip links
 */

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function MainContent({ children, className = '', id = 'main-content' }: MainContentProps) {
  return (
    <main
      id={id}
      role="main"
      className={className}
      tabIndex={-1}
    >
      {children}
    </main>
  );
}
