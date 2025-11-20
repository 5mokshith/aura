/**
 * WCAG 2.1 Level AA Audit Utilities
 * Comprehensive accessibility checking and reporting
 */

import {
  getContrastRatio,
  hexToRgb,
  meetsWCAG_AA,
  auditAccessibility,
  type AccessibilityIssue,
} from './accessibility';

/**
 * Color contrast audit for design system
 */
export interface ColorContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  recommendation?: string;
}

export function auditColorContrasts(): ColorContrastResult[] {
  const results: ColorContrastResult[] = [];

  // Define color combinations used in the app
  const colorPairs: Array<{ fg: string; bg: string; name: string }> = [
    // Glass panels with white text
    { fg: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', name: 'White text on glass-light' },
    { fg: '#ffffff', bg: 'rgba(255, 255, 255, 0.15)', name: 'White text on glass-medium' },
    { fg: '#ffffff', bg: 'rgba(255, 255, 255, 0.2)', name: 'White text on glass-strong' },
    
    // Neon colors on dark backgrounds
    { fg: '#00f0ff', bg: '#000000', name: 'Neon cyan on black' },
    { fg: '#a855f7', bg: '#000000', name: 'Neon purple on black' },
    { fg: '#ec4899', bg: '#000000', name: 'Neon pink on black' },
    { fg: '#3b82f6', bg: '#000000', name: 'Neon blue on black' },
    
    // Status colors
    { fg: '#4ade80', bg: '#000000', name: 'Success green on black' },
    { fg: '#f87171', bg: '#000000', name: 'Error red on black' },
    { fg: '#d1d5db', bg: '#000000', name: 'Pending gray on black' },
    
    // Text on glass panels (simulated with dark background)
    { fg: '#ffffff', bg: '#1a1a1a', name: 'White text on dark glass' },
    { fg: '#d1d5db', bg: '#1a1a1a', name: 'Gray text on dark glass' },
  ];

  for (const pair of colorPairs) {
    const fgRgb = hexToRgb(pair.fg);
    const bgRgb = hexToRgb(pair.bg);

    if (!fgRgb || !bgRgb) continue;

    const ratio = getContrastRatio(fgRgb, bgRgb);
    const passesAA = meetsWCAG_AA(fgRgb, bgRgb, false);
    const passesAALarge = meetsWCAG_AA(fgRgb, bgRgb, true);

    results.push({
      foreground: pair.fg,
      background: pair.bg,
      ratio: Math.round(ratio * 100) / 100,
      passesAA,
      passesAALarge,
      recommendation: !passesAA
        ? 'Increase contrast or use larger text (18pt+)'
        : undefined,
    });
  }

  return results;
}

/**
 * Keyboard navigation audit
 */
export interface KeyboardNavigationIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning';
  wcagCriterion: string;
}

export function auditKeyboardNavigation(
  container: HTMLElement = document.body
): KeyboardNavigationIssue[] {
  const issues: KeyboardNavigationIssue[] = [];

  // Check for interactive elements without keyboard access
  const interactiveElements = container.querySelectorAll(
    'div[onclick], span[onclick], a, button, input, select, textarea'
  );

  interactiveElements.forEach((element) => {
    const htmlElement = element as HTMLElement;

    // Check if element is focusable
    const tabindex = htmlElement.getAttribute('tabindex');
    const isFocusable =
      ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(htmlElement.tagName) ||
      (tabindex !== null && parseInt(tabindex) >= 0);

    if (!isFocusable && htmlElement.onclick) {
      issues.push({
        element: htmlElement.tagName.toLowerCase(),
        issue: 'Interactive element not keyboard accessible',
        severity: 'error',
        wcagCriterion: '2.1.1 Keyboard',
      });
    }

    // Check for positive tabindex (anti-pattern)
    if (tabindex && parseInt(tabindex) > 0) {
      issues.push({
        element: htmlElement.tagName.toLowerCase(),
        issue: 'Positive tabindex disrupts natural tab order',
        severity: 'warning',
        wcagCriterion: '2.4.3 Focus Order',
      });
    }
  });

  return issues;
}

/**
 * ARIA attributes audit
 */
export interface AriaAuditIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning';
  wcagCriterion: string;
}

export function auditAriaAttributes(
  container: HTMLElement = document.body
): AriaAuditIssue[] {
  const issues: AriaAuditIssue[] = [];

  // Check buttons without accessible names
  container.querySelectorAll('button').forEach((button) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: 'button',
        issue: 'Button missing accessible name',
        severity: 'error',
        wcagCriterion: '4.1.2 Name, Role, Value',
      });
    }
  });

  // Check images without alt text
  container.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        element: 'img',
        issue: 'Image missing alt attribute',
        severity: 'error',
        wcagCriterion: '1.1.1 Non-text Content',
      });
    }
  });

  // Check form inputs without labels
  container.querySelectorAll('input, select, textarea').forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    if (htmlInput.type === 'hidden') return;

    const hasLabel = container.querySelector(`label[for="${htmlInput.id}"]`);
    const hasAriaLabel = htmlInput.hasAttribute('aria-label');
    const hasAriaLabelledBy = htmlInput.hasAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: input.tagName.toLowerCase(),
        issue: 'Form input missing label',
        severity: 'error',
        wcagCriterion: '3.3.2 Labels or Instructions',
      });
    }
  });

  // Check for aria-hidden on focusable elements
  container.querySelectorAll('[aria-hidden="true"]').forEach((element) => {
    const htmlElement = element as HTMLElement;
    const tabindex = htmlElement.getAttribute('tabindex');

    if (tabindex && parseInt(tabindex) >= 0) {
      issues.push({
        element: htmlElement.tagName.toLowerCase(),
        issue: 'aria-hidden element is focusable',
        severity: 'error',
        wcagCriterion: '4.1.2 Name, Role, Value',
      });
    }
  });

  // Check for proper role usage
  container.querySelectorAll('[role]').forEach((element) => {
    const role = element.getAttribute('role');
    const validRoles = [
      'alert',
      'alertdialog',
      'button',
      'checkbox',
      'dialog',
      'gridcell',
      'link',
      'log',
      'marquee',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'progressbar',
      'radio',
      'scrollbar',
      'searchbox',
      'slider',
      'spinbutton',
      'status',
      'switch',
      'tab',
      'tabpanel',
      'textbox',
      'timer',
      'tooltip',
      'treeitem',
      'combobox',
      'grid',
      'listbox',
      'menu',
      'menubar',
      'radiogroup',
      'tablist',
      'tree',
      'treegrid',
      'application',
      'article',
      'cell',
      'columnheader',
      'definition',
      'directory',
      'document',
      'feed',
      'figure',
      'group',
      'heading',
      'img',
      'list',
      'listitem',
      'math',
      'none',
      'note',
      'presentation',
      'region',
      'row',
      'rowgroup',
      'rowheader',
      'separator',
      'table',
      'term',
      'toolbar',
      'banner',
      'complementary',
      'contentinfo',
      'form',
      'main',
      'navigation',
      'region',
      'search',
    ];

    if (role && !validRoles.includes(role)) {
      issues.push({
        element: element.tagName.toLowerCase(),
        issue: `Invalid ARIA role: ${role}`,
        severity: 'error',
        wcagCriterion: '4.1.2 Name, Role, Value',
      });
    }
  });

  return issues;
}

/**
 * Touch target size audit
 */
export interface TouchTargetIssue {
  element: string;
  width: number;
  height: number;
  issue: string;
  severity: 'error' | 'warning';
  wcagCriterion: string;
}

export function auditTouchTargets(
  container: HTMLElement = document.body
): TouchTargetIssue[] {
  const issues: TouchTargetIssue[] = [];
  const minSize = 44; // WCAG 2.1 Level AA minimum

  const interactiveElements = container.querySelectorAll(
    'button, a, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]'
  );

  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.width < minSize || rect.height < minSize) {
      issues.push({
        element: element.tagName.toLowerCase(),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        issue: `Touch target too small (minimum ${minSize}x${minSize}px)`,
        severity: rect.width < 40 || rect.height < 40 ? 'error' : 'warning',
        wcagCriterion: '2.5.5 Target Size',
      });
    }
  });

  return issues;
}

/**
 * Complete WCAG 2.1 Level AA audit
 */
export interface WCAGAuditReport {
  timestamp: Date;
  colorContrasts: ColorContrastResult[];
  keyboardNavigation: KeyboardNavigationIssue[];
  ariaAttributes: AriaAuditIssue[];
  touchTargets: TouchTargetIssue[];
  generalAccessibility: AccessibilityIssue[];
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    passRate: number;
  };
}

export function runWCAGAudit(container?: HTMLElement): WCAGAuditReport {
  const colorContrasts = auditColorContrasts();
  const keyboardNavigation = container ? auditKeyboardNavigation(container) : [];
  const ariaAttributes = container ? auditAriaAttributes(container) : [];
  const touchTargets = container ? auditTouchTargets(container) : [];
  const generalAccessibility = container ? auditAccessibility(container) : [];

  const allIssues = [
    ...keyboardNavigation,
    ...ariaAttributes,
    ...touchTargets,
    ...generalAccessibility,
  ];

  const errors = allIssues.filter((issue) => issue.severity === 'error').length;
  const warnings = allIssues.filter((issue) => issue.severity === 'warning').length;
  const totalIssues = errors + warnings;

  // Calculate pass rate based on color contrasts and issues
  const colorContrastPasses = colorContrasts.filter((c) => c.passesAA).length;
  const colorContrastTotal = colorContrasts.length;
  const passRate =
    totalIssues === 0 && colorContrastTotal > 0
      ? (colorContrastPasses / colorContrastTotal) * 100
      : totalIssues === 0
      ? 100
      : Math.max(0, 100 - (errors * 10 + warnings * 5));

  return {
    timestamp: new Date(),
    colorContrasts,
    keyboardNavigation,
    ariaAttributes,
    touchTargets,
    generalAccessibility,
    summary: {
      totalIssues,
      errors,
      warnings,
      passRate: Math.round(passRate),
    },
  };
}

/**
 * Generate audit report as text
 */
export function generateAuditReportText(report: WCAGAuditReport): string {
  let text = '# WCAG 2.1 Level AA Accessibility Audit Report\n\n';
  text += `Generated: ${report.timestamp.toLocaleString()}\n\n`;

  text += '## Summary\n\n';
  text += `- Total Issues: ${report.summary.totalIssues}\n`;
  text += `- Errors: ${report.summary.errors}\n`;
  text += `- Warnings: ${report.summary.warnings}\n`;
  text += `- Pass Rate: ${report.summary.passRate}%\n\n`;

  if (report.colorContrasts.length > 0) {
    text += '## Color Contrast Results\n\n';
    report.colorContrasts.forEach((result) => {
      const status = result.passesAA ? '✓ PASS' : '✗ FAIL';
      text += `${status} - Ratio: ${result.ratio}:1\n`;
      text += `  Foreground: ${result.foreground}\n`;
      text += `  Background: ${result.background}\n`;
      if (result.recommendation) {
        text += `  Recommendation: ${result.recommendation}\n`;
      }
      text += '\n';
    });
  }

  if (report.keyboardNavigation.length > 0) {
    text += '## Keyboard Navigation Issues\n\n';
    report.keyboardNavigation.forEach((issue) => {
      text += `[${issue.severity.toUpperCase()}] ${issue.element}\n`;
      text += `  Issue: ${issue.issue}\n`;
      text += `  WCAG: ${issue.wcagCriterion}\n\n`;
    });
  }

  if (report.ariaAttributes.length > 0) {
    text += '## ARIA Attribute Issues\n\n';
    report.ariaAttributes.forEach((issue) => {
      text += `[${issue.severity.toUpperCase()}] ${issue.element}\n`;
      text += `  Issue: ${issue.issue}\n`;
      text += `  WCAG: ${issue.wcagCriterion}\n\n`;
    });
  }

  if (report.touchTargets.length > 0) {
    text += '## Touch Target Issues\n\n';
    report.touchTargets.forEach((issue) => {
      text += `[${issue.severity.toUpperCase()}] ${issue.element}\n`;
      text += `  Size: ${issue.width}x${issue.height}px\n`;
      text += `  Issue: ${issue.issue}\n`;
      text += `  WCAG: ${issue.wcagCriterion}\n\n`;
    });
  }

  if (report.generalAccessibility.length > 0) {
    text += '## General Accessibility Issues\n\n';
    report.generalAccessibility.forEach((issue) => {
      text += `[${issue.severity.toUpperCase()}] ${issue.element.tagName}\n`;
      text += `  Issue: ${issue.issue}\n`;
      text += `  WCAG: ${issue.wcagCriterion}\n\n`;
    });
  }

  return text;
}

/**
 * Export audit report as JSON
 */
export function exportAuditReportJSON(report: WCAGAuditReport): string {
  return JSON.stringify(report, null, 2);
}
