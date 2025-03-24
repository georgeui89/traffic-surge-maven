
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { generateDailyTrafficData, generateHourlyTrafficData } from '@/utils/mockData';

type TimeRange = '24h' | '7d' | '30d' | '90d';

export const TrafficChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  // Get the appropriate data based on the time range
  const getData = () => {
    switch (timeRange) {
      case '24h':
        return generateHourlyTrafficData();
      case '7d':
        return generateDailyTrafficData(7);
      case '30d':
        return generateDailyTrafficData(30);
      case '90d':
        return generateDailyTrafficData(90);
      default:
        return generateDailyTrafficData(7);
    }
  };
  
  const data = getData();
  
  // Get the x-axis key based on the time range
  const getXAxisKey = () => {
    return timeRange === '24h' ? 'time' : 'date';
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-traffic mr-2"></span>
              <span>Visits: </span>
              <span className="ml-1 font-medium">{formatNumber(payload[0].value)}</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-earnings mr-2"></span>
              <span>Impressions: </span>
              <span className="ml-1 font-medium">{formatNumber(payload[1].value)}</span>
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-base font-medium">Traffic Trends</CardTitle>
        <Tabs 
          defaultValue="7d" 
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          className="h-8"
        >
          <TabsList className="bg-muted/40">
            <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-3">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-3">30d</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-3">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--traffic))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--traffic))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--earnings))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--earnings))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey={getXAxisKey()} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--muted))' }}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              tickFormatter={value => {
                if (value >= 1000) return `${(value / 1000).toString()}k`;
                return value.toString();
              }}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                return <span className="text-xs ml-2">{value}</span>;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="visits" 
              name="Visits"
              stroke="hsl(var(--traffic))" 
              fillOpacity={1}
              fill="url(#colorVisits)" 
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'hsl(var(--traffic))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
            <Area 
              type="monotone" 
              dataKey="impressions" 
              name="Valid Impressions"
              stroke="hsl(var(--earnings))" 
              fillOpacity={1}
              fill="url(#colorImpressions)" 
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'hsl(var(--earnings))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
