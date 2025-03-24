import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface TrafficHeatmapProps {
  title: string;
  description?: string;
  timeRange: string;
  platformFilter: string;
}

export const TrafficHeatmap = ({
  title,
  description,
  timeRange,
  platformFilter
}: TrafficHeatmapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [metric, setMetric] = useState('visits');
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Hours of the day
  const hours = Array.from({ length: 24 }, (_, i) => 
    i === 0 ? '12am' : 
    i < 12 ? `${i}am` : 
    i === 12 ? '12pm' : 
    `${i - 12}pm`
  );
  
  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock heatmap data
    setTimeout(() => {
      const data: number[][] = [];
      
      // Generate data for each day
      for (let day = 0; day < 7; day++) {
        const dayData: number[] = [];
        
        // Generate data for each hour
        for (let hour = 0; hour < 24; hour++) {
          // Create a pattern with higher traffic during working hours
          let baseValue = 0;
          
          // Weekday pattern
          if (day < 5) {
            // Working hours (9am-5pm)
            if (hour >= 9 && hour < 17) {
              baseValue = 70 + Math.random() * 30;
            } 
            // Early morning and evening
            else if ((hour >= 6 && hour < 9) || (hour >= 17 && hour < 22)) {
              baseValue = 40 + Math.random() * 30;
            } 
            // Late night
            else {
              baseValue = 10 + Math.random() * 20;
            }
          } 
          // Weekend pattern
          else {
            // Daytime
            if (hour >= 10 && hour < 22) {
              baseValue = 50 + Math.random() * 30;
            } 
            // Night
            else {
              baseValue = 15 + Math.random() * 15;
            }
          }
          
          // Add some randomness
          const value = Math.round(baseValue * (0.8 + Math.random() * 0.4));
          dayData.push(value);
        }
        
        data.push(dayData);
      }
      
      setHeatmapData(data);
      setIsLoading(false);
    }, 1000);
  }, [timeRange, platformFilter, metric]);
  
  // Find the min and max values for color scaling
  const allValues = heatmapData.flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  
  // Color scale function
  const getColor = (value: number) => {
    if (allValues.length === 0) return 'rgba(0, 0, 0, 0.1)';
    
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    
    if (metric === 'visits') {
      // Blue scale for visits
      return `rgba(59, 130, 246, ${0.2 + normalizedValue * 0.8})`;
    } else if (metric === 'impressions') {
      // Purple scale for impressions
      return `rgba(139, 92, 246, ${0.2 + normalizedValue * 0.8})`;
    } else {
      // Green scale for conversion
      return `rgba(16, 185, 129, ${0.2 + normalizedValue * 0.8})`;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visits">Visits</SelectItem>
                <SelectItem value="impressions">Impressions</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[500px] w-full flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-[450px] bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex">
                <div className="w-20"></div>
                <div className="flex-1 flex">
                  {hours.map((hour, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className="text-xs text-muted-foreground">
                        {i % 3 === 0 ? hour : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {days.map((day, dayIndex) => (
                <div key={day} className="flex h-16">
                  <div className="w-20 flex items-center">
                    <span className="text-sm">{day}</span>
                  </div>
                  <div className="flex-1 flex">
                    {hours.map((_, hourIndex) => {
                      const value = heatmapData[dayIndex]?.[hourIndex] || 0;
                      
                      return (
                        <motion.div 
                          key={hourIndex}
                          className="flex-1 m-0.5 rounded cursor-pointer relative group"
                          style={{ backgroundColor: getColor(value) }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: (dayIndex * 24 + hourIndex) * 0.001 }}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-full h-full"></div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <div className="font-medium">{day}, {hours[hourIndex]}</div>
                                  <div className="mt-1">{metric}: {value}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Low</span>
                  <div className="h-2 w-32 rounded bg-gradient-to-r from-blue-100 to-blue-600"></div>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Based on {timeRange} of data</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};