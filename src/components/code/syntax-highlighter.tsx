
import React from 'react';
import { cn } from '@/lib/utils';

interface SyntaxHighlighterProps {
  language?: string;
  children: string | React.ReactNode;
  className?: string;
  showLineNumbers?: boolean;
}

export function SyntaxHighlighter({ 
  language = 'javascript', 
  children, 
  className,
  showLineNumbers = false 
}: SyntaxHighlighterProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-0 right-0 p-1 text-xs text-muted-foreground bg-muted rounded-bl">
        {language}
      </div>
      <pre 
        className={cn(
          "p-4 pt-6 rounded-md bg-muted overflow-x-auto text-sm font-mono",
          showLineNumbers && "pl-12 relative"
        )}
      >
        {showLineNumbers && (
          <div className="absolute left-0 top-0 pt-6 pb-4 px-2 text-xs text-muted-foreground select-none">
            {typeof children === 'string' && 
              children.split('\n').map((_, i) => (
                <div key={i} className="text-right pr-2">{i + 1}</div>
              ))
            }
          </div>
        )}
        <code className="block">{children}</code>
      </pre>
    </div>
  );
}
