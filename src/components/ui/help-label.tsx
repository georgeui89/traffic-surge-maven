
import { HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HelpLabelProps {
  htmlFor?: string;
  label: string;
  helpText: string;
  className?: string;
}

export function HelpLabel({ htmlFor, label, helpText, className }: HelpLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label htmlFor={htmlFor} className="cursor-pointer">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Help</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{helpText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
