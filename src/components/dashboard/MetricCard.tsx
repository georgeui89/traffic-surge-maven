
import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

type MetricCardProps = {
  title: string;
  value: number;
  tooltipText?: string;
  previousValue?: number;
  showChangePercent?: boolean;
  icon?: ReactNode;
  iconBackground?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  target?: number;
  formatter?: 'number' | 'currency' | 'percent';
  color?: string;
  footnote?: string;
  className?: string;
  showProgress?: boolean;
};

export const MetricCard = ({
  title,
  value,
  tooltipText,
  previousValue,
  showChangePercent = false,
  icon,
  iconBackground = 'bg-primary/10',
  valuePrefix = '',
  valueSuffix = '',
  target,
  formatter = 'number',
  color,
  footnote,
  className,
  showProgress = false,
}: MetricCardProps) => {
  // Calculate change
  const hasChange = previousValue !== undefined;
  const changeValue = hasChange ? value - previousValue : 0;
  const changePercent = hasChange 
    ? previousValue > 0 
      ? ((value - previousValue) / previousValue) * 100 
      : 0 
    : 0;
  const isPositiveChange = changeValue >= 0;
  
  // Calculate progress
  const progressPercent = target ? Math.min(Math.max((value / target) * 100, 0), 100) : 0;
  
  // Format the value
  let formattedValue: string;
  switch (formatter) {
    case 'currency':
      formattedValue = formatCurrency(value);
      break;
    case 'percent':
      formattedValue = formatPercent(value, 1);
      break;
    case 'number':
    default:
      formattedValue = formatNumber(value);
  }
  
  return (
    <Card className={cn('overflow-hidden transition-all duration-200 h-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn('p-2 rounded-md', iconBackground)}>
                {icon}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              {tooltipText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          {hasChange && showChangePercent && (
            <div 
              className={cn(
                'flex items-center text-xs px-1.5 py-0.5 rounded',
                isPositiveChange ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'
              )}
            >
              {isPositiveChange ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(changePercent).toFixed(1)}%
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          className={cn(
            'text-2xl font-semibold tracking-tight',
            color
          )}
        >
          {valuePrefix}{formattedValue}{valueSuffix}
        </div>
        
        {showProgress && target && (
          <div className="mt-2 space-y-1">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatter === 'currency' ? formatCurrency(value) : value}</span>
              <span>{formatter === 'currency' ? formatCurrency(target) : target}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {footnote && (
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">{footnote}</p>
        </CardFooter>
      )}
    </Card>
  );
};
