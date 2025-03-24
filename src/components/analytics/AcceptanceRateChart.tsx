
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercent } from '@/utils/formatters';
import { platforms } from '@/utils/mockData';

type AcceptanceRateChartProps = {
  timeRange: string;
  platformFilter: string;
};

export const AcceptanceRateChart = ({ timeRange, platformFilter }: AcceptanceRateChartProps) => {
  // Filter platforms based on the selected filter
  const filteredPlatforms = platformFilter === 'all' 
    ? platforms 
    : platforms.filter(p => p.id.toLowerCase().includes(platformFilter.toLowerCase()));
  
  // Add mock acceptance rate data to platforms
  const data = filteredPlatforms.map(platform => ({
    name: platform.name,
    acceptanceRate: Math.round(Math.random() * 60 + 20), // 20-80% range
  })).sort((a, b) => b.acceptanceRate - a.acceptanceRate);
  
  // Target acceptance rate line
  const targetRate = 40; // 40% is a good target
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm mt-1.5">
            <span>Acceptance Rate: </span>
            <span className="font-medium">{payload[0].value}%</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Target: {targetRate}%
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Platform Acceptance Rates</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--muted))' }}
              tickFormatter={value => `${value}%`}
            />
            <YAxis 
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} />
            <ReferenceLine 
              x={targetRate} 
              stroke="hsl(var(--warning))" 
              strokeDasharray="3 3" 
              strokeWidth={2}
              label={{ 
                value: 'Target', 
                position: 'top', 
                fill: 'hsl(var(--warning))',
                fontSize: 12,
              }} 
            />
            <Bar dataKey="acceptanceRate" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.acceptanceRate >= targetRate ? 'hsl(var(--success))' : 'hsl(var(--warning))'}
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
