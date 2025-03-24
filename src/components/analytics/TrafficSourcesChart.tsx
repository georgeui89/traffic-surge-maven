
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercent } from '@/utils/formatters';

type TrafficSourcesChartProps = {
  timeRange: string;
  platformFilter: string;
};

export const TrafficSourcesChart = ({ timeRange, platformFilter }: TrafficSourcesChartProps) => {
  // Mock data for traffic sources
  const data = [
    { name: '9Hits', value: 35, color: 'hsl(var(--traffic))' },
    { name: 'HitLeap', value: 25, color: 'hsl(var(--platforms))' },
    { name: 'Otohits', value: 20, color: 'hsl(var(--earnings))' },
    { name: 'EasyHits4U', value: 10, color: 'hsl(var(--primary))' },
    { name: 'Others', value: 10, color: 'hsl(var(--muted-foreground))' },
  ];
  
  // If a platform filter is applied, adjust the chart
  const filteredData = platformFilter === 'all' 
    ? data 
    : [
        ...data.filter(item => item.name.toLowerCase().includes(platformFilter.toLowerCase())),
        { name: 'Others', value: data.reduce((sum, item) => !item.name.toLowerCase().includes(platformFilter.toLowerCase()) ? sum + item.value : sum, 0), color: 'hsl(var(--muted-foreground))' }
      ].filter(item => item.value > 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span>Traffic Share: </span>
              <span className="font-medium">{payload[0].value}%</span>
            </p>
            <p className="text-sm">
              <span>Estimated Visits: </span>
              <span className="font-medium">{formatNumber(payload[0].value * 100)}</span>
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
        <CardTitle className="text-base font-medium">Traffic Sources Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-1/2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h3 className="text-sm font-medium mb-3">Key Insights</h3>
            <div className="space-y-3">
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm font-medium">Diversification Needed</p>
                <p className="text-xs text-muted-foreground mt-1">Your traffic sources are concentrated on a few platforms. Consider diversifying to reduce risk.</p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm font-medium">9Hits Performance</p>
                <p className="text-xs text-muted-foreground mt-1">9Hits provides the highest traffic volume with good quality. Consider increasing your investment.</p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm font-medium">Low EasyHits4U Utilization</p>
                <p className="text-xs text-muted-foreground mt-1">EasyHits4U is underutilized but shows promise. Consider testing more campaigns.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
