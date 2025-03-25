
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const metricCardVariants = cva(
  "p-6 relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card hover:shadow-hover border border-border/50",
        primary: "bg-primary/10 hover:bg-primary/15 border border-primary/30",
        success: "bg-success/10 hover:bg-success/15 border border-success/30",
        warning: "bg-warning/10 hover:bg-warning/15 border border-warning/30",
        danger: "bg-destructive/10 hover:bg-destructive/15 border border-destructive/30",
        traffic: "bg-traffic/10 hover:bg-traffic/15 border border-traffic/30",
        earnings: "bg-earnings/10 hover:bg-earnings/15 border border-earnings/30",
        platforms: "bg-platforms/10 hover:bg-platforms/15 border border-platforms/30",
        glass: "bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15",
        modern: "bg-gradient-to-br from-card to-muted/50 border border-border/30",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string
  value: number | string
  icon?: React.ReactNode
  change?: number
  trend?: "up" | "down" | "neutral"
  suffix?: string
  prefix?: string
  isLoading?: boolean
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, variant, title, value, icon, change, trend, suffix, prefix, isLoading, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(metricCardVariants({ variant }), 
          "rounded-lg shadow-modern", 
          isLoading && "animate-pulse", 
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              {prefix && <span className="text-sm mr-1">{prefix}</span>}
              <h3 className="text-2xl font-bold tracking-tight">
                {isLoading ? <div className="h-8 w-20 bg-muted/50 rounded-md animate-pulse"></div> : value}
              </h3>
              {suffix && <span className="text-sm ml-1">{suffix}</span>}
            </div>
          </div>
          
          {icon && (
            <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm shadow-sm">
              {icon}
            </div>
          )}
        </div>
        
        {(trend || change !== undefined) && (
          <div className="mt-4 flex items-center text-sm">
            {trend === "up" && <ArrowUpIcon className="mr-1 h-4 w-4 text-success" />}
            {trend === "down" && <ArrowDownIcon className="mr-1 h-4 w-4 text-destructive" />}
            
            {change !== undefined && (
              <span className={cn(
                trend === "up" && "text-success", 
                trend === "down" && "text-destructive",
                "font-medium"
              )}>
                {change > 0 && "+"}
                {change}%
              </span>
            )}
            
            <span className="ml-2 text-muted-foreground">from previous period</span>
          </div>
        )}
      </Card>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
