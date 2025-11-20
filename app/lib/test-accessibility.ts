/**
 * Accessibility Testing Utilities
 * Run comprehensive WCAG 2.1 Level AA tests
 */

import { runWCAGAudit, generateAuditReportText, exportAuditReportJSON } from './wcag-audit';

/**
 * Run accessibility audit and log results to console
 */
export function testAccessibility(container?: HTMLElement) {
  if (typeof window === 'undefined') {
    console.warn('Accessibility testing can only run in browser environment');
    return;
  }

  console.log('🔍 Running WCAG 2.1 Level AA Accessibility Audit...\n');

  const report = runWCAGAudit(container);

  console.log('📊 Audit Summary:');
  console.log(`   Total Issues: ${report.summary.totalIssues}`);
  console.log(`   Errors: ${report.summary.errors}`);
  console.log(`   Warnings: ${report.summary.warnings}`);
  console.log(`   Pass Rate: ${report.summary.passRate}%\n`);

  if (report.summary.errors > 0) {
    console.error('❌ Critical accessibility errors found!');
  } else if (report.summary.warnings > 0) {
    console.warn('⚠️  Accessibility warnings found');
  } else {
    console.log('✅ No accessibility issues found!');
  }

  // Log color contrast results
  if (report.colorContrasts.length > 0) {
    console.log('\n🎨 Color Contrast Results:');
    report.colorContrasts.forEach((result) => {
      const status = result.passesAA ? '✓' : '✗';
      console.log(`   ${status} ${result.ratio}:1 - ${result.foreground} on ${result.background}`);
      if (result.recommendation) {
        console.log(`      💡 ${result.recommendation}`);
      }
    });
  }

  // Log keyboard navigation issues
  if (report.keyboardNavigation.length > 0) {
    console.log('\n⌨️  Keyboard Navigation Issues:');
    report.keyboardNavigation.forEach((issue) => {
      console.log(`   [${issue.severity.toUpperCase()}] ${issue.element}: ${issue.issue}`);
      console.log(`      WCAG: ${issue.wcagCriterion}`);
    });
  }

  // Log ARIA issues
  if (report.ariaAttributes.length > 0) {
    console.log('\n🏷️  ARIA Attribute Issues:');
    report.ariaAttributes.forEach((issue) => {
      console.log(`   [${issue.severity.toUpperCase()}] ${issue.element}: ${issue.issue}`);
      console.log(`      WCAG: ${issue.wcagCriterion}`);
    });
  }

  // Log touch target issues
  if (report.touchTargets.length > 0) {
    console.log('\n👆 Touch Target Issues:');
    report.touchTargets.forEach((issue) => {
      console.log(`   [${issue.severity.toUpperCase()}] ${issue.element}: ${issue.width}x${issue.height}px`);
      console.log(`      ${issue.issue}`);
      console.log(`      WCAG: ${issue.wcagCriterion}`);
    });
  }

  // Log general accessibility issues
  if (report.generalAccessibility.length > 0) {
    console.log('\n🔧 General Accessibility Issues:');
    report.generalAccessibility.forEach((issue) => {
      console.log(`   [${issue.severity.toUpperCase()}] ${issue.element.tagName}: ${issue.issue}`);
      console.log(`      WCAG: ${issue.wcagCriterion}`);
    });
  }

  console.log('\n📄 Full Report:');
  console.log('   Use downloadAuditReport() to save the full report');

  return report;
}

/**
 * Download audit report as text file
 */
export function downloadAuditReport(format: 'text' | 'json' = 'text', container?: HTMLElement) {
  if (typeof window === 'undefined') return;

  const report = runWCAGAudit(container);
  const content = format === 'json' 
    ? exportAuditReportJSON(report)
    : generateAuditReportText(report);

  const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wcag-audit-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`✅ Audit report downloaded as ${a.download}`);
}

/**
 * Test specific WCAG criteria
 */
export function testWCAGCriteria(criterion: string, container?: HTMLElement) {
  const report = runWCAGAudit(container);
  const allIssues = [
    ...report.keyboardNavigation,
    ...report.ariaAttributes,
    ...report.touchTargets,
    ...report.generalAccessibility,
  ];

  const criterionIssues = allIssues.filter((issue) => 
    issue.wcagCriterion.toLowerCase().includes(criterion.toLowerCase())
  );

  if (criterionIssues.length === 0) {
    console.log(`✅ No issues found for WCAG criterion: ${criterion}`);
  } else {
    console.log(`❌ Found ${criterionIssues.length} issue(s) for WCAG criterion: ${criterion}`);
    criterionIssues.forEach((issue) => {
      console.log(`   [${issue.severity.toUpperCase()}] ${issue.issue}`);
    });
  }

  return criterionIssues;
}

/**
 * Test color contrast for specific colors
 */
export function testColorContrast(foreground: string, background: string) {
  const { hexToRgb, getContrastRatio, meetsWCAG_AA } = require('./accessibility');

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    console.error('Invalid color format. Use hex format (e.g., #ffffff)');
    return;
  }

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const passesAA = meetsWCAG_AA(fgRgb, bgRgb, false);
  const passesAALarge = meetsWCAG_AA(fgRgb, bgRgb, true);

  console.log(`🎨 Color Contrast Test:`);
  console.log(`   Foreground: ${foreground}`);
  console.log(`   Background: ${background}`);
  console.log(`   Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`   WCAG AA (normal text): ${passesAA ? '✅ Pass' : '❌ Fail'} (requires 4.5:1)`);
  console.log(`   WCAG AA (large text): ${passesAALarge ? '✅ Pass' : '❌ Fail'} (requires 3:1)`);

  if (!passesAA) {
    console.log(`   💡 Recommendation: Increase contrast or use larger text (18pt+)`);
  }

  return { ratio, passesAA, passesAALarge };
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation() {
  if (typeof window === 'undefined') return;

  console.log('⌨️  Testing Keyboard Navigation...\n');

  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  console.log(`Found ${focusableElements.length} focusable elements`);

  let issues = 0;

  focusableElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const tabindex = htmlElement.getAttribute('tabindex');

    // Check for positive tabindex (anti-pattern)
    if (tabindex && parseInt(tabindex) > 0) {
      console.warn(`   ⚠️  Element ${index + 1}: Positive tabindex (${tabindex}) disrupts natural tab order`);
      issues++;
    }

    // Check for missing accessible name
    const hasText = htmlElement.textContent?.trim();
    const hasAriaLabel = htmlElement.hasAttribute('aria-label');
    const hasAriaLabelledBy = htmlElement.hasAttribute('aria-labelledby');

    if (htmlElement.tagName === 'BUTTON' && !hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(`   ⚠️  Element ${index + 1}: Button missing accessible name`);
      issues++;
    }
  });

  if (issues === 0) {
    console.log('✅ No keyboard navigation issues found');
  } else {
    console.log(`\n❌ Found ${issues} keyboard navigation issue(s)`);
  }

  return issues;
}

/**
 * Test screen reader compatibility
 */
export function testScreenReaderCompatibility() {
  if (typeof window === 'undefined') return;

  console.log('📢 Testing Screen Reader Compatibility...\n');

  let issues = 0;

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      console.warn(`   ⚠️  Image ${index + 1}: Missing alt attribute`);
      issues++;
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const htmlInput = input as HTMLInputElement;
    if (htmlInput.type === 'hidden') return;

    const hasLabel = document.querySelector(`label[for="${htmlInput.id}"]`);
    const hasAriaLabel = htmlInput.hasAttribute('aria-label');
    const hasAriaLabelledBy = htmlInput.hasAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(`   ⚠️  Input ${index + 1}: Missing label`);
      issues++;
    }
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(`   ⚠️  Button ${index + 1}: Missing accessible name`);
      issues++;
    }
  });

  if (issues === 0) {
    console.log('✅ No screen reader compatibility issues found');
  } else {
    console.log(`\n❌ Found ${issues} screen reader compatibility issue(s)`);
  }

  return issues;
}

/**
 * Make testing functions available globally in development
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testAccessibility = testAccessibility;
  (window as any).downloadAuditReport = downloadAuditReport;
  (window as any).testWCAGCriteria = testWCAGCriteria;
  (window as any).testColorContrast = testColorContrast;
  (window as any).testKeyboardNavigation = testKeyboardNavigation;
  (window as any).testScreenReaderCompatibility = testScreenReaderCompatibility;

  console.log('🔧 Accessibility testing tools loaded. Available commands:');
  console.log('   - testAccessibility() - Run full WCAG audit');
  console.log('   - downloadAuditReport() - Download audit report');
  console.log('   - testWCAGCriteria("2.4.7") - Test specific criterion');
  console.log('   - testColorContrast("#ffffff", "#000000") - Test color contrast');
  console.log('   - testKeyboardNavigation() - Test keyboard access');
  console.log('   - testScreenReaderCompatibility() - Test screen reader support');
}
