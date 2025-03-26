
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-destructive/10 text-destructive border border-destructive/20",
        info: "bg-traffic/10 text-traffic border border-traffic/20",
        muted: "bg-muted/50 text-muted-foreground border border-muted/30",
      },
      size: {
        default: "h-6",
        sm: "h-5 text-[10px]",
        lg: "h-7 px-3",
      },
      withDot: {
        true: "pl-2",
      },
      interactive: {
        true: "cursor-pointer hover:bg-opacity-80 active:transform active:scale-95",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      withDot: false,
      interactive: false,
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  onClick?: () => void;
  loading?: boolean;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, withDot, label, interactive, loading, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({ variant, size, withDot, interactive }), 
          "shadow-sm hover:shadow-md transition-all duration-200",
          loading && "opacity-70 cursor-wait",
          className
        )}
        onClick={!loading && onClick ? onClick : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {withDot && (
          <span className={cn(
            "mr-1 h-2 w-2 rounded-full", 
            variant === "default" && "bg-primary",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "error" && "bg-destructive",
            variant === "info" && "bg-traffic",
            variant === "muted" && "bg-muted-foreground",
            loading && "animate-pulse",
          )} />
        )}
        {loading ? (
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{label}</span>
          </div>
        ) : label}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
