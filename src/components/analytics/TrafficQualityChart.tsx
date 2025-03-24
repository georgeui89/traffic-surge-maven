
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/formatters';
import { generateDailyTrafficData } from '@/utils/mockData';

type TrafficQualityChartProps = {
  timeRange: string;
  platformFilter: string;
};

export const TrafficQualityChart = ({ timeRange, platformFilter }: TrafficQualityChartProps) => {
  // Generate data based on the selected time range
  const getDaysFromRange = () => {
    switch (timeRange) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 7;
    }
  };
  
  // Mock data for traffic quality
  const rawData = generateDailyTrafficData(getDaysFromRange());
  
  // Enhance data with quality metrics
  const data = rawData.map(day => ({
    ...day,
    qualityScore: Math.round(Math.random() * 40 + 60), // 60-100 scale
    bounceRate: Math.round(Math.random() * 30 + 20), // 20-50% range
    sessionTime: Math.round(Math.random() * 100 + 30), // 30-130 seconds
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1.5">
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-traffic mr-2"></span>
              <span>Quality Score: </span>
              <span className="ml-1 font-medium">{payload[0].value}/100</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-destructive mr-2"></span>
              <span>Bounce Rate: </span>
              <span className="ml-1 font-medium">{payload[1].value}%</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
              <span>Session Time: </span>
              <span className="ml-1 font-medium">{payload[2].value} sec</span>
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Traffic Quality Indicators</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--muted))' }}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              domain={[0, 160]}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="qualityScore" 
              name="Quality Score" 
              stroke="hsl(var(--traffic))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: 'hsl(var(--traffic))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="bounceRate" 
              name="Bounce Rate %" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="sessionTime" 
              name="Session Time (sec)" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
