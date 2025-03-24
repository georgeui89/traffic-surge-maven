import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'eager' | 'lazy';
}

export function OptimizedImage({
  src,
  alt,
  fallback = '',
  aspectRatio = '16/9',
  objectFit = 'cover',
  loading = 'lazy',
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setError(true);
    if (fallback) {
      setImgSrc(fallback);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted",
        className
      )}
      style={{ aspectRatio }}
    >
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <span className="sr-only">Loading image</span>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          objectFit === 'contain' && "object-contain",
          objectFit === 'cover' && "object-cover",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
      
      {error && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}