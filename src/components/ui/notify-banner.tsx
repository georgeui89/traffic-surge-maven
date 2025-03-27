
import * as React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const notifyBannerVariants = cva(
  "relative w-full flex items-center justify-between p-4 rounded-md border",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        success: "bg-success/10 border-success/20 text-success",
        error: "bg-destructive/10 border-destructive/20 text-destructive",
        warning: "bg-warning/10 border-warning/20 text-warning",
        info: "bg-info/10 border-info/20 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NotifyBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notifyBannerVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
}

export function NotifyBanner({
  className,
  variant,
  icon,
  title,
  description,
  action,
  onClose,
  ...props
}: NotifyBannerProps) {
  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={cn(notifyBannerVariants({ variant }), className)}
      {...props}
    >
      <div className="flex gap-3 items-start">
        <div className="flex-shrink-0">{icon || getDefaultIcon()}</div>
        <div className="flex-1">
          {title && <div className="font-medium">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  );
}
