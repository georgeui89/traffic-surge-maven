
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data for performance metrics
const ctrData = [
  { name: 'Basic', value: 18.5, fill: '#3498db' },
  { name: 'Mobile Opt', value: 22.7, fill: '#2ecc71' },
  { name: 'Extended', value: 15.2, fill: '#e74c3c' },
  { name: 'Geo-Target', value: 0, fill: '#95a5a6' }
];

const cpmData = [
  { name: 'Basic', value: 4.2, fill: '#3498db' },
  { name: 'Mobile Opt', value: 5.15, fill: '#2ecc71' },
  { name: 'Extended', value: 3.85, fill: '#e74c3c' },
  { name: 'Geo-Target', value: 0, fill: '#95a5a6' }
];

const acceptanceRateData = [
  { name: 'Basic', value: 92, fill: '#3498db' },
  { name: 'Mobile Opt', value: 87, fill: '#2ecc71' },
  { name: 'Extended', value: 94, fill: '#e74c3c' },
  { name: 'Geo-Target', value: 0, fill: '#95a5a6' }
];

const timeSeriesData = [
  { date: '06/01', basic: 16.2, mobile: 18.3, extended: 14.1 },
  { date: '06/02', basic: 16.8, mobile: 19.5, extended: 14.3 },
  { date: '06/03', basic: 17.1, mobile: 20.2, extended: 14.5 },
  { date: '06/04', basic: 17.5, mobile: 20.8, extended: 14.7 },
  { date: '06/05', basic: 17.8, mobile: 21.2, extended: 14.9 },
  { date: '06/06', basic: 18.0, mobile: 21.8, extended: 15.0 },
  { date: '06/07', basic: 18.5, mobile: 22.7, extended: 15.2 }
];

const chartConfigs = {
  basic: { color: '#3498db', label: 'Basic Redirect' },
  mobile: { color: '#2ecc71', label: 'Mobile Optimized' },
  extended: { color: '#e74c3c', label: 'Extended Delay' },
};

export const ScriptPerformance: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  return (
    <div className="space-y-8 animate-warp-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-futuristic text-gradient-cyan">Performance Analytics</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-neon-cyan/30 focus:ring-neon-cyan/20">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent className="glass-card border-neon-cyan/20">
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="bg-background/20 backdrop-blur-sm text-neon-cyan border-neon-cyan/30 font-normal">
            Last Updated: Just now
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="comparison" className="animate-fade-in">
        <TabsList className="bg-background/50 backdrop-blur-sm p-1 border border-border/50 w-auto inline-flex">
          <TabsTrigger 
            value="comparison"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan"
          >
            Variant Comparison
          </TabsTrigger>
          <TabsTrigger 
            value="trends"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan"
          >
            Performance Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-neon-cyan/20 overflow-hidden hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-futuristic text-gradient-cyan">Click-Through Rate (CTR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ctrData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neon-cyan/10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis tickFormatter={(value) => `${value}%`} stroke="#888" />
                      <Tooltip formatter={(value) => [`${value}%`, 'CTR']} contentStyle={{ backgroundColor: '#0D1B2A', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 212, 255, 0.2)' }} />
                      <Bar dataKey="value" fill="#00D4FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-neon-cyan/20 overflow-hidden hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-futuristic text-gradient-cyan">CPM ($ per 1000 impressions)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cpmData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neon-cyan/10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis tickFormatter={(value) => `$${value}`} stroke="#888" />
                      <Tooltip formatter={(value) => {
                        // Fix: Check if value is a number before calling toFixed
                        const formattedValue = typeof value === 'number' 
                          ? `$${value.toFixed(2)}` 
                          : `$${value}`;
                        return [formattedValue, 'CPM'];
                      }} contentStyle={{ backgroundColor: '#0D1B2A', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 212, 255, 0.2)' }} />
                      <Bar dataKey="value" fill="#FF007A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-neon-cyan/20 overflow-hidden hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-futuristic text-gradient-cyan">Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={acceptanceRateData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neon-cyan/10" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis tickFormatter={(value) => `${value}%`} stroke="#888" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Acceptance']} contentStyle={{ backgroundColor: '#0D1B2A', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 212, 255, 0.2)' }} />
                      <Bar dataKey="value" fill="#FFD700" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <Card className="glass-card border-neon-cyan/20 overflow-hidden hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-futuristic text-gradient-cyan">CTR Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    basic: { color: '#00D4FF', label: 'Basic Redirect' },
                    mobile: { color: '#FF007A', label: 'Mobile Optimized' },
                    extended: { color: '#FFD700', label: 'Extended Delay' },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neon-cyan/10" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis tickFormatter={(value) => `${value}%`} stroke="#888" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="basic" name="Basic Redirect" stroke="#00D4FF" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="mobile" name="Mobile Optimized" stroke="#FF007A" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="extended" name="Extended Delay" stroke="#FFD700" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
