/**
 * Asset Optimization Utilities
 * 
 * Utilities for optimizing images, fonts, and other assets
 * Requirements: 19.2
 */

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map((width) => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  breakpoints: { maxWidth: string; size: string }[] = [
    { maxWidth: '640px', size: '100vw' },
    { maxWidth: '1024px', size: '50vw' },
    { maxWidth: '1536px', size: '33vw' },
  ]
): string {
  const sizeStrings = breakpoints.map(
    (bp) => `(max-width: ${bp.maxWidth}) ${bp.size}`
  );
  sizeStrings.push('25vw'); // Default size
  return sizeStrings.join(', ');
}

/**
 * Compress image URL for Google Drive thumbnails
 */
export function getOptimizedThumbnail(
  thumbnailLink: string | undefined,
  size: number = 200
): string {
  if (!thumbnailLink) {
    return '/images/file-placeholder.png';
  }

  // Google Drive thumbnail optimization
  // Replace =s220 with desired size
  return thumbnailLink.replace(/=s\d+/, `=s${size}`);
}

/**
 * Get optimized Google user avatar
 */
export function getOptimizedAvatar(
  avatarUrl: string | undefined,
  size: number = 96
): string {
  if (!avatarUrl) {
    return '/images/avatar-placeholder.png';
  }

  // Google avatar optimization
  if (avatarUrl.includes('googleusercontent.com')) {
    // Remove existing size parameter and add new one
    const baseUrl = avatarUrl.split('=')[0];
    return `${baseUrl}=s${size}-c`;
  }

  return avatarUrl;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    img.src = src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, options);

  observer.observe(img);
}

/**
 * Convert image to WebP format (client-side)
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate optimal image dimensions while maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#1a1a2e'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Prefetch images for better performance
 */
export function prefetchImages(urls: string[]): void {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Check if image format is supported
 */
export function isImageFormatSupported(format: 'webp' | 'avif'): boolean {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const mimeType = format === 'webp' ? 'image/webp' : 'image/avif';
  return canvas.toDataURL(mimeType).indexOf(`data:${mimeType}`) === 0;
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (isImageFormatSupported('avif')) return 'avif';
  if (isImageFormatSupported('webp')) return 'webp';
  return 'jpeg';
}
