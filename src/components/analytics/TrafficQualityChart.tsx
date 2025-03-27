
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrafficQualityChartProps {
  timeRange: string;
  platformFilter: string;
}

export function TrafficQualityChart({ timeRange, platformFilter }: TrafficQualityChartProps) {
  const [dataType, setDataType] = useState('acceptanceRate');
  
  // Mock data
  const generateData = () => {
    const data = [];
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const multiplier = platformFilter === 'all' ? 1 : platformFilter === '9hits' ? 1.1 : platformFilter === 'hitleap' ? 0.9 : 1.05;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const baseAcceptanceRate = 75 + Math.random() * 15;
      const baseAvgTimeOnSite = 25 + Math.random() * 20;
      const baseAvgLoadTime = 0.5 + Math.random() * 0.8;
      
      data.push({
        date: timeRange === '24h' 
          ? `${date.getHours()}:00` 
          : `${date.getMonth() + 1}/${date.getDate()}`,
        acceptanceRate: (baseAcceptanceRate * multiplier).toFixed(1),
        avgTimeOnSite: (baseAvgTimeOnSite * multiplier).toFixed(1),
        avgLoadTime: (baseAvgLoadTime * (1 / multiplier)).toFixed(2)
      });
    }
    
    return data;
  };
  
  const data = generateData();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Traffic Quality
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Traffic quality metrics measure how well your traffic performs in terms of acceptance, engagement, and technical performance.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Track key quality metrics over time
            </CardDescription>
          </div>
          <Tabs value={dataType} onValueChange={setDataType}>
            <TabsList className="h-8">
              <TabsTrigger value="acceptanceRate" className="text-xs px-3">Acceptance Rate</TabsTrigger>
              <TabsTrigger value="avgTimeOnSite" className="text-xs px-3">Time on Site</TabsTrigger>
              <TabsTrigger value="avgLoadTime" className="text-xs px-3">Load Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#666" 
              style={{ fontSize: '12px' }}
              domain={
                dataType === 'acceptanceRate' ? [50, 100] : 
                dataType === 'avgTimeOnSite' ? [0, 60] :
                [0, 2]
              }
              label={{ 
                value: dataType === 'acceptanceRate' ? '% Acceptance' : 
                       dataType === 'avgTimeOnSite' ? 'Seconds' : 
                       'Seconds',
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px', fill: '#888' }
              }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} 
              labelStyle={{ color: '#eee' }}
              formatter={(value) => [
                `${value}${dataType === 'acceptanceRate' ? '%' : dataType === 'avgLoadTime' ? 's' : 's'}`, 
                dataType === 'acceptanceRate' ? 'Acceptance Rate' : 
                dataType === 'avgTimeOnSite' ? 'Avg. Time on Site' : 
                'Avg. Load Time'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataType} 
              stroke={
                dataType === 'acceptanceRate' ? '#3b82f6' : 
                dataType === 'avgTimeOnSite' ? '#10b981' : 
                '#ef4444'
              } 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 text-sm text-muted-foreground">
          <p>
            {dataType === 'acceptanceRate' 
              ? 'Acceptance rate is the percentage of traffic that is accepted by ad networks. Higher is better.' 
              : dataType === 'avgTimeOnSite' 
              ? 'Average time on site measures how long visitors stay on your pages. Longer durations often correlate with higher acceptance rates.'
              : 'Average load time measures how quickly your pages load. Faster load times improve user experience and ad acceptance.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
