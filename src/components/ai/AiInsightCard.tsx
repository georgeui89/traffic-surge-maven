
import { ReactNode } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, HelpCircle, Lightbulb, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AiInsightCardProps {
  title: string;
  description: string;
  reasoning: string;
  icon?: ReactNode;
  impact?: 'high' | 'medium' | 'low';
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
  type?: 'success' | 'warning' | 'info' | 'default';
  className?: string;
}

export function AiInsightCard({
  title,
  description,
  reasoning,
  icon = <Wand2 className="h-5 w-5" />,
  impact = 'medium',
  actionButton,
  secondaryButton,
  type = 'default',
  className
}: AiInsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/10';
      case 'warning':
        return 'border-warning/20 bg-warning/10';
      case 'info':
        return 'border-primary/20 bg-primary/10';
      default:
        return 'border-border/50 bg-muted/30';
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };
  
  const getImpactBadge = () => {
    switch (impact) {
      case 'high':
        return <Badge variant="outline" className="border-success text-success bg-success/10">High Impact</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-warning text-warning bg-warning/10">Medium Impact</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground bg-muted/10">Low Impact</Badge>;
    }
  };
  
  return (
    <Card className={cn("transition-all", getTypeStyles(), className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-background", getIconColor())}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {getImpactBadge()}
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0 pb-2">
          <div className="border-l-2 border-muted-foreground/20 pl-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm text-foreground mb-1">AI Reasoning</p>
                <p>{reasoning}</p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2 text-xs h-7"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 mr-1" />
              Show Details
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          {secondaryButton && (
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.label}
            </Button>
          )}
          
          {actionButton && (
            <Button
              size="sm"
              className="h-7"
              onClick={actionButton.onClick}
            >
              {actionButton.label}
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
