
import { HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HelpLabelProps {
  htmlFor?: string;
  label: string;
  helpText: string;
  className?: string;
  usePopover?: boolean;
}

export function HelpLabel({ htmlFor, label, helpText, className, usePopover = false }: HelpLabelProps) {
  if (usePopover) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Label htmlFor={htmlFor} className="cursor-pointer">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-neon-cyan transition-colors" />
              <span className="sr-only">Help</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm" side="right">
            <div className="space-y-2">
              <h4 className="font-medium">Help: {label}</h4>
              <p className="text-muted-foreground">{helpText}</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label htmlFor={htmlFor} className="cursor-pointer">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-neon-cyan transition-colors" />
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

// Helper function to add tooltip to any component
export function withTooltip(Component: React.ComponentType<any>, helpText: string) {
  return (props: any) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Component {...props} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{helpText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simple help icon that can be added next to any element
export function HelpIcon({ text, className, iconClass, asPopover = false }: { text: string; className?: string; iconClass?: string; asPopover?: boolean }) {
  if (asPopover) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-5 w-5 p-0 ${className}`}>
            <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-neon-cyan transition-colors ${iconClass}`} />
            <span className="sr-only">Help</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm" side="right">
          <div className="space-y-2">
            <h4 className="font-medium">Help</h4>
            <p className="text-muted-foreground">{text}</p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-5 w-5 p-0 ${className}`}>
            <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-neon-cyan transition-colors ${iconClass}`} />
            <span className="sr-only">Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="max-w-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Section header with help information
export function SectionHeader({ title, description, helpText, className }: { title: string; description?: string; helpText?: string; className?: string }) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {helpText && <HelpIcon text={helpText} />}
      </div>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
