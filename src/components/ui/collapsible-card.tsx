import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  summaryContent?: React.ReactNode;
}

export const CollapsibleCard = ({
  title,
  description,
  defaultOpen = false,
  children,
  className,
  summaryContent
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'}</span>
          </Button>
        </div>
        
        {!isOpen && summaryContent && (
          <div className="mt-2">{summaryContent}</div>
        )}
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};