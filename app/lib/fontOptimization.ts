/**
 * Font Optimization Utilities
 * 
 * Utilities for optimizing font loading and performance
 * Requirements: 19.2
 */

/**
 * Preload critical fonts
 */
export function preloadFonts(): void {
  if (typeof window === 'undefined') return;

  const fonts = [
    {
      family: 'Inter',
      weight: '400',
      style: 'normal',
    },
    {
      family: 'Inter',
      weight: '600',
      style: 'normal',
    },
    {
      family: 'Space Grotesk',
      weight: '700',
      style: 'normal',
    },
  ];

  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = `/fonts/${font.family.toLowerCase().replace(' ', '-')}-${font.weight}.woff2`;
    document.head.appendChild(link);
  });
}

/**
 * Font display strategy
 * Using 'swap' for better performance and avoiding FOIT (Flash of Invisible Text)
 */
export const fontDisplayStrategy = 'swap';

/**
 * Subset fonts to reduce file size
 * Only include characters that are actually used
 */
export const fontSubsets = [
  'latin',
  'latin-ext',
];

/**
 * Font loading optimization with Font Loading API
 */
export async function loadFontOptimized(
  fontFamily: string,
  fontWeight: string = '400',
  fontStyle: string = 'normal'
): Promise<void> {
  if (typeof window === 'undefined' || !('FontFace' in window)) return;

  try {
    const fontFace = new FontFace(
      fontFamily,
      `url(/fonts/${fontFamily.toLowerCase().replace(' ', '-')}-${fontWeight}.woff2) format('woff2')`,
      {
        weight: fontWeight,
        style: fontStyle,
        display: 'swap',
      }
    );

    await fontFace.load();
    document.fonts.add(fontFace);
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
  }
}

/**
 * Preload critical fonts on page load
 */
export function initializeFontOptimization(): void {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  preloadFonts();

  // Load fonts with Font Loading API
  if ('fonts' in document) {
    Promise.all([
      loadFontOptimized('Inter', '400'),
      loadFontOptimized('Inter', '600'),
      loadFontOptimized('Space Grotesk', '700'),
    ]).catch((error) => {
      console.error('Font loading failed:', error);
    });
  }
}
