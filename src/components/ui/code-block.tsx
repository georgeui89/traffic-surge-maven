
import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ 
  children, 
  className, 
  language, 
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Code snippet copied to clipboard",
        duration: 2000,
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <pre className={cn(
        "p-4 rounded-md bg-muted overflow-x-auto text-sm font-mono",
        showLineNumbers && "pl-12 relative"
      )}>
        {language && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{language}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCheck className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Copy code</span>
            </Button>
          </div>
        )}
        
        {showLineNumbers && typeof children === 'string' && (
          <div className="absolute left-0 top-0 pt-4 pb-4 px-2 text-xs text-muted-foreground select-none">
            {children.split('\n').map((_, i) => (
              <div key={i} className="text-right pr-2">{i + 1}</div>
            ))}
          </div>
        )}
        
        <code className="block">{children}</code>
      </pre>
    </div>
  );
}
