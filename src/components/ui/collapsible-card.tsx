import { useState } from 'react';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleCardProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  summaryContent?: React.ReactNode;
  actions?: React.ReactNode;
  allowFullscreen?: boolean;
}

export const CollapsibleCard = ({
  title,
  description,
  defaultOpen = false,
  children,
  className,
  summaryContent,
  actions,
  allowFullscreen = false
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // If going to fullscreen, ensure content is visible
    if (!isFullscreen && !isOpen) {
      setIsOpen(true);
    }
  };
  
  return (
    <motion.div
      layout
      className={cn(
        "transition-all duration-200",
        isFullscreen ? "fixed inset-4 z-50" : "relative",
        className
      )}
      style={{
        boxShadow: isFullscreen ? "0 0 0 100vmax rgba(0, 0, 0, 0.5)" : "none"
      }}
    >
      <Card className={cn(
        "transition-all duration-200 h-full",
        isFullscreen && "overflow-auto"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <motion.div layout="position">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </motion.div>
            <div className="flex items-center gap-1">
              {actions}
              
              {allowFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 p-0"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </Button>
              )}
              
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
          </div>
          
          {!isOpen && summaryContent && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2"
            >
              {summaryContent}
            </motion.div>
          )}
        </CardHeader>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};