
import { useState } from 'react';
import { TrendingUp, Clock, Filter, ArrowDown, Calendar, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TrafficQualityChart } from '@/components/analytics/TrafficQualityChart';
import { AcceptanceRateChart } from '@/components/analytics/AcceptanceRateChart';
import { TrafficSourcesChart } from '@/components/analytics/TrafficSourcesChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generateDailyTrafficData } from '@/utils/mockData';

type TimeRange = '24h' | '7d' | '30d' | '90d';

const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Traffic analytics data has been updated.",
        duration: 3000,
      });
    }, 1500);
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV format.",
      duration: 3000,
    });
  };

  // Mock data for metrics
  const data = generateDailyTrafficData(30);
  const mostRecentDay = data[data.length - 1];
  
  // Aggregate some metrics
  const totalVisits = data.reduce((sum, day) => sum + day.visits, 0);
  const totalImpressions = data.reduce((sum, day) => sum + day.impressions, 0);
  const acceptanceRate = totalVisits > 0 ? (totalImpressions / totalVisits) * 100 : 0;
  const avgTimeOnSite = 65; // seconds, would come from real data
  const conversionRate = 2.8; // percentage, would come from real data
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Traffic Analytics</h1>
          <p className="page-description">Analyze traffic quality, sources, and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
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
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="9hits">9Hits</SelectItem>
              <SelectItem value="hitleap">HitLeap</SelectItem>
              <SelectItem value="otohits">Otohits</SelectItem>
              <SelectItem value="other">Other Platforms</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-2" />
            More Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Visits"
          value={totalVisits}
          previousValue={totalVisits * 0.9}
          showChangePercent={true}
          icon={<TrendingUp className="h-4 w-4 text-traffic" />}
          iconBackground="bg-traffic/10"
          footnote={`Last ${timeRange}`}
          color="text-traffic"
        />
        
        <MetricCard
          title="Valid Impressions"
          value={totalImpressions}
          previousValue={totalImpressions * 0.85}
          showChangePercent={true}
          icon={<TrendingUp className="h-4 w-4 text-platforms" />}
          iconBackground="bg-platforms/10"
          footnote={`Last ${timeRange}`}
          color="text-platforms"
        />
        
        <MetricCard
          title="Acceptance Rate"
          value={acceptanceRate}
          formatter="percent"
          previousValue={acceptanceRate * 0.95}
          showChangePercent={true}
          icon={<ArrowDown className="h-4 w-4 text-warning" />}
          iconBackground="bg-warning/10"
          footnote={`Last ${timeRange}`}
          color="text-warning"
        />
        
        <MetricCard
          title="Avg. Time on Site"
          value={avgTimeOnSite}
          valuePrefix=""
          valueSuffix=" sec"
          previousValue={avgTimeOnSite * 1.05}
          showChangePercent={true}
          icon={<Clock className="h-4 w-4 text-primary" />}
          iconBackground="bg-primary/10"
          footnote={`Last ${timeRange}`}
          color="text-primary"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrafficQualityChart timeRange={timeRange} platformFilter={platformFilter} />
        <AcceptanceRateChart timeRange={timeRange} platformFilter={platformFilter} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <TrafficSourcesChart timeRange={timeRange} platformFilter={platformFilter} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Traffic Quality Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
              <h3 className="text-sm font-medium mb-2">Low Acceptance Rate on HitLeap</h3>
              <p className="text-sm text-muted-foreground">Consider increasing time-on-site duration to improve traffic quality and acceptance rate.</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">Apply Fix</Button>
              </div>
            </div>
            
            <div className="p-4 bg-success/10 border border-success/20 rounded-md">
              <h3 className="text-sm font-medium mb-2">High Performance on 9Hits</h3>
              <p className="text-sm text-muted-foreground">9Hits is showing great acceptance rate. Consider allocating more budget to this platform.</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">Optimize Budget</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAnalytics;
