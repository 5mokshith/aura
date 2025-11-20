/**
 * Responsive Design Utilities
 * Mobile-first breakpoints and helper functions
 */

export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Check if current viewport matches a breakpoint
 */
export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia(query);
  return mediaQuery.matches;
}

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const width = window.innerWidth;
  
  // Check from largest to smallest
  if (width >= breakpoints['2xl'] && values['2xl']) return values['2xl'];
  if (width >= breakpoints.xl && values.xl) return values.xl;
  if (width >= breakpoints.lg && values.lg) return values.lg;
  if (width >= breakpoints.md && values.md) return values.md;
  if (width >= breakpoints.sm && values.sm) return values.sm;
  if (width >= breakpoints.xs && values.xs) return values.xs;
  
  return defaultValue;
}

/**
 * Check if viewport is mobile (< 768px)
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
}

/**
 * Check if viewport is tablet (768px - 1023px)
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
}

/**
 * Check if viewport is desktop (>= 1024px)
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
}

/**
 * Get current breakpoint name
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'md';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Responsive class name generator
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate responsive padding classes
 */
export function responsivePadding(
  mobile: string = 'p-4',
  tablet: string = 'md:p-6',
  desktop: string = 'lg:p-8'
): string {
  return cn(mobile, tablet, desktop);
}

/**
 * Generate responsive margin classes
 */
export function responsiveMargin(
  mobile: string = 'm-4',
  tablet: string = 'md:m-6',
  desktop: string = 'lg:m-8'
): string {
  return cn(mobile, tablet, desktop);
}

/**
 * Generate responsive text size classes
 */
export function responsiveText(
  mobile: string = 'text-sm',
  tablet: string = 'md:text-base',
  desktop: string = 'lg:text-lg'
): string {
  return cn(mobile, tablet, desktop);
}

/**
 * Generate responsive grid columns
 */
export function responsiveGrid(
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3
): string {
  const mobileClass = `grid-cols-${mobile}`;
  const tabletClass = `md:grid-cols-${tablet}`;
  const desktopClass = `lg:grid-cols-${desktop}`;
  
  return cn('grid', mobileClass, tabletClass, desktopClass);
}

/**
 * Generate responsive flex direction
 */
export function responsiveFlex(
  mobile: 'row' | 'col' = 'col',
  desktop: 'row' | 'col' = 'row'
): string {
  const mobileClass = mobile === 'col' ? 'flex-col' : 'flex-row';
  const desktopClass = desktop === 'col' ? 'lg:flex-col' : 'lg:flex-row';
  
  return cn('flex', mobileClass, desktopClass);
}

/**
 * Generate responsive width classes
 */
export function responsiveWidth(
  mobile: string = 'w-full',
  tablet: string = 'md:w-auto',
  desktop: string = 'lg:w-auto'
): string {
  return cn(mobile, tablet, desktop);
}

/**
 * Generate responsive max-width classes
 */
export function responsiveMaxWidth(
  mobile: string = 'max-w-full',
  tablet: string = 'md:max-w-2xl',
  desktop: string = 'lg:max-w-4xl'
): string {
  return cn(mobile, tablet, desktop);
}
