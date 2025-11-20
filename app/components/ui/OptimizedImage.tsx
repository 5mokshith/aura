import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Optimized Image Component
 * 
 * Wrapper around Next.js Image component with:
 * - Automatic lazy loading
 * - Loading state
 * - Error handling
 * - Blur placeholder
 * 
 * Requirements: 19.2
 */

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  fallbackSrc?: string;
  showLoader?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  showLoader = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className="relative">
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-glass-dark backdrop-blur-sm rounded-lg">
          <LoadingSpinner />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        {...props}
      />
    </div>
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars and profile pictures
 */
interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  className = '',
}: AvatarImageProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const dimension = sizeMap[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className={`rounded-full ${className}`}
      showLoader={false}
    />
  );
}

/**
 * Thumbnail Image Component
 * Optimized for file thumbnails and previews
 */
interface ThumbnailImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ThumbnailImage({
  src,
  alt,
  width = 200,
  height = 150,
  className = '',
}: ThumbnailImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg object-cover ${className}`}
    />
  );
}
