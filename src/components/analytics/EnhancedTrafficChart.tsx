import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateDailyTrafficData, generateHourlyTrafficData } from '@/utils/mockData';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';

interface EnhancedTrafficChartProps {
  title: string;
  description?: string;
  timeRange: string;
  platformFilter: string;
  dataKey: string;
  color: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
}

export const EnhancedTrafficChart = ({
  title,
  description,
  timeRange,
  platformFilter,
  dataKey,
  color,
  secondaryDataKey,
  secondaryColor
}: EnhancedTrafficChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dataGranularity, setDataGranularity] = useState<'daily' | 'hourly'>('daily');
  
  useEffect(() => {
    // Generate data based on time range and granularity
    if (dataGranularity === 'hourly') {
      setChartData(generateHourlyTrafficData(24));
    } else {
      const days = timeRange === '24h' ? 1 : 
                  timeRange === '7d' ? 7 : 
                  timeRange === '30d' ? 30 : 90;
      setChartData(generateDailyTrafficData(days));
    }
  }, [timeRange, dataGranularity, platformFilter]);
  
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
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
              onValueChange={(value) => setChartType(value as 'line' | 'bar')}
              className="h-8"
            >
              <TabsList className="h-8">
                <TabsTrigger value="line" className="px-2 h-8">
                  <LineChartIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="bar" className="px-2 h-8">
                  <BarChart3 className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
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
                  />
                )}
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                <Bar
                  dataKey={dataKey}
                  name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
                {secondaryDataKey && secondaryColor && (
                  <Bar
                    dataKey={secondaryDataKey}
                    name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)}
                    fill={secondaryColor}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};