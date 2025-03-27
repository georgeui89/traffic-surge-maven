
import React from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm font-mono">
      {children}
    </pre>
  );
}
