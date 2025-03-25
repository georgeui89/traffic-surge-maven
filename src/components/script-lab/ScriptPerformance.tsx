
import { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatPercent } from '@/utils/formatters';

type ValueType = string | number | Array<string | number>;

type ScriptPerformanceProps = {
  scriptId: string;
};

const ScriptPerformance: FC<ScriptPerformanceProps> = ({ scriptId }) => {
  // Mock data for script performance
  const performanceData = [
    { date: 'Mon', ctr: 4.2, acceptanceRate: 42, trafficQuality: 72 },
    { date: 'Tue', ctr: 3.8, acceptanceRate: 38, trafficQuality: 68 },
    { date: 'Wed', ctr: 5.1, acceptanceRate: 51, trafficQuality: 75 },
    { date: 'Thu', ctr: 5.7, acceptanceRate: 57, trafficQuality: 78 },
    { date: 'Fri', ctr: 4.9, acceptanceRate: 49, trafficQuality: 74 },
    { date: 'Sat', ctr: 3.5, acceptanceRate: 35, trafficQuality: 65 },
    { date: 'Sun', ctr: 3.2, acceptanceRate: 32, trafficQuality: 62 },
  ];

  const platformData = [
    { name: '9Hits', value: 35, color: 'hsl(var(--traffic))' },
    { name: 'HitLeap', value: 25, color: 'hsl(var(--platforms))' },
    { name: 'Otohits', value: 20, color: 'hsl(var(--earnings))' },
    { name: 'EasyHits4U', value: 10, color: 'hsl(var(--primary))' },
    { name: 'Others', value: 10, color: 'hsl(var(--muted-foreground))' },
  ];

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1.5">
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
              <span>CTR: </span>
              <span className="ml-1 font-medium">
                {typeof payload[0].value === 'number' ? `${payload[0].value.toFixed(2)}%` : payload[0].value}
              </span>
            </p>
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-traffic mr-2"></span>
              <span>Acceptance Rate: </span>
              <span className="ml-1 font-medium">
                {typeof payload[1].value === 'number' ? `${payload[1].value}%` : payload[1].value}
              </span>
            </p>
            <p className="text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-earnings mr-2"></span>
              <span>Traffic Quality: </span>
              <span className="ml-1 font-medium">
                {typeof payload[2].value === 'number' ? `${payload[2].value}/100` : payload[2].value}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the bar chart
  const PlatformTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <div className="mt-2">
            <p className="text-sm">
              <span>Share: </span>
              <span className="font-medium">
                {typeof payload[0].value === 'number' ? `${payload[0].value}%` : payload[0].value}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-modern border border-border/50 overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/50">
        <CardTitle className="text-xl">Script Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="w-full mb-4 bg-muted/30">
            <TabsTrigger value="metrics" className="flex-1">Metrics</TabsTrigger>
            <TabsTrigger value="platforms" className="flex-1">Platform Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="mt-0">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorAcceptance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--traffic))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--traffic))" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--earnings))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--earnings))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="ctr" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorCtr)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="acceptanceRate" 
                    stroke="hsl(var(--traffic))" 
                    fillOpacity={1} 
                    fill="url(#colorAcceptance)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="trafficQuality" 
                    stroke="hsl(var(--earnings))" 
                    fillOpacity={1} 
                    fill="url(#colorQuality)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                <div className="text-sm text-muted-foreground">Average CTR</div>
                <div className="text-xl font-bold mt-1 text-primary">4.3%</div>
              </div>
              <div className="bg-traffic/10 rounded-lg p-3 border border-traffic/30">
                <div className="text-sm text-muted-foreground">Acceptance Rate</div>
                <div className="text-xl font-bold mt-1 text-traffic">43%</div>
              </div>
              <div className="bg-earnings/10 rounded-lg p-3 border border-earnings/30">
                <div className="text-sm text-muted-foreground">Traffic Quality</div>
                <div className="text-xl font-bold mt-1 text-earnings">72/100</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="platforms" className="mt-0">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={true} vertical={false} />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                  <Tooltip content={<PlatformTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Platform Share" radius={[0, 4, 4, 0]} barSize={24}>
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg mt-4 border border-border/50">
              <h4 className="font-medium mb-2">Platform Insights</h4>
              <p className="text-sm text-muted-foreground">
                Your script performs best on 9Hits with 35% traffic share. Consider optimizing for HitLeap to improve overall performance.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScriptPerformance;
