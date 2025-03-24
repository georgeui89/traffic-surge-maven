
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { generateDailyTrafficData } from '@/utils/mockData';

type TimeRange = '7d' | '30d' | '90d' | 'ytd';

export const EarningsChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  // Generate appropriate data based on the selected time range
  const getData = () => {
    switch (timeRange) {
      case '7d':
        return generateDailyTrafficData(7);
      case '30d':
        return generateDailyTrafficData(30);
      case '90d':
        return generateDailyTrafficData(90);
      case 'ytd':
        // Year to date - would typically fetch this from an API
        return generateDailyTrafficData(90); // Using 90 days as a placeholder
      default:
        return generateDailyTrafficData(7);
    }
  };
  
  const data = getData();
  
  // Calculate daily goal line based on settings
  const dailyGoal = 5; // This would come from user settings
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm mt-1">
            <span>Revenue: </span>
            <span className="font-medium">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-base font-medium">Daily Earnings</CardTitle>
        <Tabs 
          defaultValue="7d" 
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          className="h-8"
        >
          <TabsList className="bg-muted/40">
            <TabsTrigger value="7d" className="text-xs px-3">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-3">30d</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs px-3">90d</TabsTrigger>
            <TabsTrigger value="ytd" className="text-xs px-3">YTD</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
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
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              tickFormatter={value => formatCurrency(value)}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} />
            <ReferenceLine 
              y={dailyGoal} 
              stroke="hsl(var(--success))" 
              strokeDasharray="3 3" 
              strokeWidth={2}
              label={{ 
                value: 'Goal', 
                position: 'right', 
                fill: 'hsl(var(--success))',
                fontSize: 12,
              }} 
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.revenue >= dailyGoal ? 'hsl(var(--success))' : 'hsl(var(--earnings))'}
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
