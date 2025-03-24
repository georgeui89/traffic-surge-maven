import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export function SkipLink({ href, className, children = "Skip to content" }: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsFocused(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:rounded",
        className
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
    </a>
  );
}