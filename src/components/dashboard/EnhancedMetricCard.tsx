import { ReactNode, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  infoTooltip?: string;
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
  sparklineData = [],
  infoTooltip
}: EnhancedMetricCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animate the value on mount and when it changes
  useEffect(() => {
    const duration = 1000; // Animation duration in ms
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(value);
      }
    };
    
    animateValue();
  }, [value]);
  
  // Format the value based on the formatter type
  const formatValue = (val: number) => {
    if (formatter === 'currency') {
      return `$${val.toFixed(2)}`;
    } else if (formatter === 'percent') {
      return `${val.toFixed(1)}%`;
    } else {
      return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0);
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
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "transition-all duration-300 overflow-hidden h-full",
          showProgress && "border-l-4",
          showProgress && target && value >= target ? "border-l-success" : "",
          showProgress && target && value < target ? "border-l-warning" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {icon && (
                  <div className={cn("p-2 rounded-md", iconBackground)}>
                    {icon}
                  </div>
                )}
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                  {infoTooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1.5 text-muted-foreground/70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">{infoTooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className={cn("text-2xl font-semibold", color)}>
                  {valuePrefix}{formatValue(displayValue)}{valueSuffix}
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
                  <AnimatePresence>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      d={generateSparklinePath()}
                      fill="none"
                      stroke={isPositive ? "var(--success)" : "var(--destructive)"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </AnimatePresence>
                  
                  {/* Animated dot at the end of the sparkline */}
                  {isHovered && sparklineData.length > 0 && (
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      cx={80}
                      cy={30 - ((sparklineData[sparklineData.length - 1] - Math.min(...sparklineData)) / 
                          (Math.max(...sparklineData) - Math.min(...sparklineData) || 1)) * 30}
                      r="3"
                      fill={isPositive ? "var(--success)" : "var(--destructive)"}
                    />
                  )}
                </svg>
              </div>
            )}
          </div>
          
          {showProgress && target && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded-full",
                    value >= target ? "bg-success" : "bg-warning"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (value / target) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
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
    </motion.div>
  );
};