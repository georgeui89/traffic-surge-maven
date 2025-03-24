import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedMetricCardProps {
  title: string;
  value: number;
  formatter?: 'number' | 'currency' | 'percent';
  icon?: ReactNode;
  iconBackground?: string;
  footnote?: string;
  color?: string;
  previousValue?: number;
  showChangePercent?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  target?: number;
  showProgress?: boolean;
  sparklineData?: number[];
}

export const EnhancedMetricCard = ({
  title,
  value,
  formatter = 'number',
  icon,
  iconBackground,
  footnote,
  color,
  previousValue,
  showChangePercent = false,
  valuePrefix = '',
  valueSuffix = '',
  target,
  showProgress = false,
  sparklineData = []
}: EnhancedMetricCardProps) => {
  // Format the value based on the formatter type
  const formatValue = (val: number) => {
    if (formatter === 'currency') {
      return `$${val.toFixed(2)}`;
    } else if (formatter === 'percent') {
      return `${val.toFixed(1)}%`;
    } else {
      return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString();
    }
  };

  // Calculate percent change
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return 0;
    return ((value - previousValue) / previousValue) * 100;
  };

  const percentChange = calculateChange();
  const isPositive = percentChange >= 0;

  // Generate sparkline SVG path
  const generateSparklinePath = () => {
    if (!sparklineData.length) return '';
    
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const width = 80;
    const height = 30;
    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points}`;
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md overflow-hidden",
      showProgress && "border-l-4",
      showProgress && target && value >= target ? "border-l-success" : "",
      showProgress && target && value < target ? "border-l-warning" : ""
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {icon && (
                <div className={cn("p-2 rounded-md", iconBackground)}>
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-2xl font-semibold", color)}>
                {valuePrefix}{formatValue(value)}{valueSuffix}
              </p>
              
              {showChangePercent && previousValue !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center text-xs font-medium rounded-full px-1.5 py-0.5",
                        isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                      )}>
                        {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                        {Math.abs(percentChange).toFixed(1)}%
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous: {formatValue(previousValue)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {footnote && (
              <p className="text-xs text-muted-foreground">{footnote}</p>
            )}
          </div>
          
          {sparklineData.length > 0 && (
            <div className="h-[30px] w-[80px]">
              <svg width="80" height="30" className="overflow-visible">
                <path
                  d={generateSparklinePath()}
                  fill="none"
                  stroke={isPositive ? "var(--success)" : "var(--destructive)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        
        {showProgress && target && (
          <div className="mt-4">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  value >= target ? "bg-success" : "bg-warning"
                )}
                style={{ width: `${Math.min(100, (value / target) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>$0</span>
              <span>Goal: ${target}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};