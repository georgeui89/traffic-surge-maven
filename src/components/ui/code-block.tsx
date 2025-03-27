
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  return (
    <pre className={cn("p-4 rounded-md bg-muted overflow-x-auto text-sm font-mono", className)}>
      {language && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <code className="block">{children}</code>
    </pre>
  );
}
