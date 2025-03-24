import * as React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  infoTooltip?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  required?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  infoTooltip,
  collapsible = false,
  defaultCollapsed = false,
  required = false,
  ...props
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">
                {title}
                {required && <span className="text-destructive ml-1">*</span>}
              </h3>
              
              {infoTooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{infoTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {collapsible && (
                <button 
                  type="button"
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? 'Show' : 'Hide'}
                </button>
              )}
            </div>
          )}
          
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      
      {!collapsible || !isCollapsed ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoTooltip?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required = false,
  infoTooltip,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <label 
          htmlFor={htmlFor} 
          className="block text-sm font-medium"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          
          {infoTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="inline-block h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{infoTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </label>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      <div>{children}</div>
      
      {error && (
        <motion.p 
          className="text-xs text-destructive"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}