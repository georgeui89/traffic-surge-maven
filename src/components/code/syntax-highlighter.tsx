
import React from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';

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
    <CodeBlock
      language={language}
      showLineNumbers={showLineNumbers}
      className={className}
    >
      {children}
    </CodeBlock>
  );
}
