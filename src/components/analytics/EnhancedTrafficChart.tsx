import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateDailyTrafficData, generateHourlyTrafficData } from '@/utils/mockData';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps,
  Brush,
  ReferenceLine
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedTrafficChartProps {
  title: string;
  description?: string;
  timeRange: string;
  platformFilter: string;
  dataKey: string;
  color: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
  showBrush?: boolean;
  showControls?: boolean;
  height?: number;
}

export const EnhancedTrafficChart = ({
  title,
  description,
  timeRange,
  platformFilter,
  dataKey,
  color,
  secondaryDataKey,
  secondaryColor,
  showBrush = true,
  showControls = true,
  height = 300
}: EnhancedTrafficChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area');
  const [dataGranularity, setDataGranularity] = useState<'daily' | 'hourly'>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const chartRef = useRef<any>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Generate data based on time range and granularity
    setTimeout(() => {
      if (dataGranularity === 'hourly') {
        setChartData(generateHourlyTrafficData(24));
      } else {
        const days = timeRange === '24h' ? 1 : 
                    timeRange === '7d' ? 7 : 
                    timeRange === '30d' ? 30 : 90;
        setChartData(generateDailyTrafficData(days));
      }
      setIsLoading(false);
    }, 500);
  }, [timeRange, dataGranularity, platformFilter]);
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    if (chartData.length <= 4) return;
    
    const currentLength = chartData.length;
    const midPoint = Math.floor(currentLength / 2);
    const start = Math.max(0, midPoint - Math.floor(currentLength / 4));
    const end = Math.min(currentLength - 1, midPoint + Math.floor(currentLength / 4));
    
    setZoomDomain([start, end]);
  };
  
  const handleZoomOut = () => {
    setZoomDomain(null);
  };
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Calculate average for reference line
  const calculateAverage = (data: any[], key: string) => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, item) => acc + item[key], 0);
    return sum / data.length;
  };
  
  const average = calculateAverage(chartData, dataKey);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Select 
                value={dataGranularity} 
                onValueChange={(value) => setDataGranularity(value as 'daily' | 'hourly')}
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Granularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs 
                value={chartType} 
                onValueChange={(value) => setChartType(value as 'line' | 'bar' | 'area')}
                className="h-8"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="line" className="px-2 h-8">
                    <LineChartIcon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="area" className="px-2 h-8">
                    <PieChart className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="px-2 h-8">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleZoomOut}
                disabled={!zoomDomain}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className={`h-[${height}px] w-full`}>
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-[250px] bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    ref={chartRef}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis 
                      dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine 
                      y={average} 
                      stroke="var(--muted-foreground)" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: "Average", 
                        position: "insideBottomRight",
                        fill: "var(--muted-foreground)",
                        fontSize: 12
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey={dataKey}
                      name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                      animationDuration={1000}
                    />
                    {secondaryDataKey && secondaryColor && (
                      <Line
                        type="monotone"
                        dataKey={secondaryDataKey}
                        name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)}
                        stroke={secondaryColor}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                        animationDuration={1000}
                      />
                    )}
                    {showBrush && (
                      <Brush 
                        dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                        height={30} 
                        stroke="var(--primary)"
                        startIndex={zoomDomain ? zoomDomain[0] : undefined}
                        endIndex={zoomDomain ? zoomDomain[1] : undefined}
                      />
                    )}
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    ref={chartRef}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis 
                      dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine 
                      y={average} 
                      stroke="var(--muted-foreground)" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: "Average", 
                        position: "insideBottomRight",
                        fill: "var(--muted-foreground)",
                        fontSize: 12
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey={dataKey}
                      name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                      stroke={color}
                      fill={`${color}40`}
                      strokeWidth={2}
                      activeDot={{ r: 4 }}
                      animationDuration={1000}
                    />
                    {secondaryDataKey && secondaryColor && (
                      <Area
                        type="monotone"
                        dataKey={secondaryDataKey}
                        name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)}
                        stroke={secondaryColor}
                        fill={`${secondaryColor}40`}
                        strokeWidth={2}
                        activeDot={{ r: 4 }}
                        animationDuration={1000}
                      />
                    )}
                    {showBrush && (
                      <Brush 
                        dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                        height={30} 
                        stroke="var(--primary)"
                        startIndex={zoomDomain ? zoomDomain[0] : undefined}
                        endIndex={zoomDomain ? zoomDomain[1] : undefined}
                      />
                    )}
                  </AreaChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    ref={chartRef}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis 
                      dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine 
                      y={average} 
                      stroke="var(--muted-foreground)" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: "Average", 
                        position: "insideBottomRight",
                        fill: "var(--muted-foreground)",
                        fontSize: 12
                      }} 
                    />
                    <Bar
                      dataKey={dataKey}
                      name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                      fill={color}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                    />
                    {secondaryDataKey && secondaryColor && (
                      <Bar
                        dataKey={secondaryDataKey}
                        name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)}
                        fill={secondaryColor}
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                    )}
                    {showBrush && (
                      <Brush 
                        dataKey={dataGranularity === 'daily' ? 'date' : 'time'} 
                        height={30} 
                        stroke="var(--primary)"
                        startIndex={zoomDomain ? zoomDomain[0] : undefined}
                        endIndex={zoomDomain ? zoomDomain[1] : undefined}
                      />
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};