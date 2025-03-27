
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        success: "bg-success/20 text-success",
        warning: "bg-warning/20 text-warning",
        destructive: "bg-destructive/20 text-destructive",
        info: "bg-primary/20 text-primary",
        positive: "bg-green-500/20 text-green-600 dark:text-green-400",
        negative: "bg-red-500/20 text-red-600 dark:text-red-400",
        neutral: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
        muted: "bg-muted/60 text-muted-foreground",
        error: "bg-destructive/20 text-destructive",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label: string;
  className?: string;
  withDot?: boolean;
  loading?: boolean;
}

export function StatusBadge({ 
  label, 
  variant, 
  size,
  className, 
  withDot = false,
  loading = false 
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className, "flex items-center gap-1.5")}>
      {withDot && <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        {
          "bg-success": variant === "success",
          "bg-warning": variant === "warning",
          "bg-destructive": variant === "destructive" || variant === "error",
          "bg-primary": variant === "info",
          "bg-muted-foreground": variant === "default" || variant === "muted",
          "bg-green-500": variant === "positive",
          "bg-red-500": variant === "negative",
          "bg-blue-500": variant === "neutral",
        }
      )} />}
      {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
      {label}
    </span>
  );
}
