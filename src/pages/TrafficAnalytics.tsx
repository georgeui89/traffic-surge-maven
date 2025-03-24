import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Filter, ArrowDown, Calendar, Download, RefreshCw, ZoomIn, ZoomOut, BarChart3, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTrafficChart } from '@/components/analytics/EnhancedTrafficChart';
import { EnhancedMetricCard } from '@/components/dashboard/EnhancedMetricCard';
import { generateDailyTrafficData } from '@/utils/mockData';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { motion } from 'framer-motion';
import { TrafficHeatmap } from '@/components/analytics/TrafficHeatmap';
import { TrafficSourcesPieChart } from '@/components/analytics/TrafficSourcesPieChart';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { TypographyH2, TypographyMuted } from '@/components/ui/typography';

type TimeRange = '24h' | '7d' | '30d' | '90d';

const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'heatmap'>('overview');
  const { toast } = useToast();
  
  useEffect(() => {
    loadData();
  }, [timeRange, platformFilter]);
  
  const loadData = () => {
    setIsLoading(true);
    
    // Simulate data loading
    setTimeout(() => {
      const days = timeRange === '24h' ? 1 : 
                  timeRange === '7d' ? 7 : 
                  timeRange === '30d' ? 30 : 90;
      
      setChartData(generateDailyTrafficData(days));
      setIsLoading(false);
    }, 800);
  };
  
  const handleRefresh = () => {
    loadData();
    toast({
      title: "Data Refreshed",
      description: "Traffic analytics data has been updated.",
      type: "success",
      duration: 3000,
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV format.",
      type: "info",
      duration: 3000,
    });
  };

  // Aggregate some metrics
  const totalVisits = chartData.reduce((sum, day) => sum + day.visits, 0);
  const totalImpressions = chartData.reduce((sum, day) => sum + day.impressions, 0);
  const acceptanceRate = totalVisits > 0 ? (totalImpressions / totalVisits) * 100 : 0;
  const avgTimeOnSite = 65; // seconds, would come from real data
  const conversionRate = 2.8; // percentage, would come from real data
  
  // Generate sparkline data
  const visitsSparkline = chartData.slice(-7).map(day => day.visits / 1000);
  const impressionsSparkline = chartData.slice(-7).map(day => day.impressions / 1000);
  const acceptanceSparkline = chartData.slice(-7).map((day, i, arr) => {
    if (i === 0) return acceptanceRate;
    return (day.impressions / day.visits) * 100;
  });
  
  return (
    <div className="page-container">
      <Breadcrumbs className="mb-6" showShareButton />
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <TypographyH2 animate>Traffic Analytics</TypographyH2>
            <TypographyMuted animate>Analyze traffic quality, sources, and performance metrics</TypographyMuted>
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
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
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
          
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'overview' | 'detailed' | 'heatmap')}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EnhancedMetricCard
            title="Total Visits"
            value={totalVisits}
            previousValue={totalVisits * 0.9}
            showChangePercent={true}
            icon={<TrendingUp className="h-4 w-4 text-traffic" />}
            iconBackground="bg-traffic/10"
            footnote={`Last ${timeRange}`}
            color="text-traffic"
            sparklineData={visitsSparkline}
            infoTooltip="Total number of visits across all platforms"
          />
          
          <EnhancedMetricCard
            title="Valid Impressions"
            value={totalImpressions}
            previousValue={totalImpressions * 0.85}
            showChangePercent={true}
            icon={<TrendingUp className="h-4 w-4 text-platforms" />}
            iconBackground="bg-platforms/10"
            footnote={`Last ${timeRange}`}
            color="text-platforms"
            sparklineData={impressionsSparkline}
            infoTooltip="Impressions that were accepted by ad networks"
          />
          
          <EnhancedMetricCard
            title="Acceptance Rate"
            value={acceptanceRate}
            formatter="percent"
            previousValue={acceptanceRate * 0.95}
            showChangePercent={true}
            icon={<ArrowDown className="h-4 w-4 text-warning" />}
            iconBackground="bg-warning/10"
            footnote={`Last ${timeRange}`}
            color="text-warning"
            sparklineData={acceptanceSparkline}
            infoTooltip="Percentage of visits that resulted in valid impressions"
          />
          
          <EnhancedMetricCard
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
            infoTooltip="Average time visitors spend on your site"
          />
        </motion.div>
        
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedTrafficChart 
                title="Traffic Overview" 
                description="Visits and impressions over time"
                timeRange={timeRange}
                platformFilter={platformFilter}
                dataKey="visits"
                color="var(--traffic)"
                secondaryDataKey="impressions"
                secondaryColor="var(--platforms)"
                height={400}
              />
            </div>
            
            <div>
              <TrafficSourcesPieChart 
                title="Traffic Sources" 
                description="Distribution by platform"
                timeRange={timeRange}
                height={400}
              />
            </div>
          </div>
        )}
        
        {viewMode === 'detailed' && (
          <div className="grid grid-cols-1 gap-6">
            <EnhancedTrafficChart 
              title="Detailed Traffic Analysis" 
              description="Comprehensive view of traffic metrics"
              timeRange={timeRange}
              platformFilter={platformFilter}
              dataKey="visits"
              color="var(--traffic)"
              secondaryDataKey="impressions"
              secondaryColor="var(--platforms)"
              height={500}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CollapsibleCard
                title="Platform Performance"
                description="Comparison across traffic sources"
                defaultOpen={true}
              >
                <div className="h-[300px]">
                  {/* Platform performance chart would go here */}
                  <div className="h-full flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                    <p className="text-muted-foreground">Platform performance chart</p>
                  </div>
                </div>
              </CollapsibleCard>
              
              <CollapsibleCard
                title="Acceptance Rate Trends"
                description="Changes in traffic quality over time"
                defaultOpen={true}
              >
                <div className="h-[300px]">
                  {/* Acceptance rate chart would go here */}
                  <div className="h-full flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                    <p className="text-muted-foreground">Acceptance rate chart</p>
                  </div>
                </div>
              </CollapsibleCard>
            </div>
          </div>
        )}
        
        {viewMode === 'heatmap' && (
          <div className="grid grid-cols-1 gap-6">
            <TrafficHeatmap 
              title="Traffic Heatmap" 
              description="Visualize traffic patterns by day and hour"
              timeRange={timeRange}
              platformFilter={platformFilter}
            />
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Traffic Quality Optimization Suggestions</CardTitle>
            <CardDescription>AI-powered recommendations to improve your traffic quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning"></span>
                  Low Acceptance Rate on HitLeap
                </h3>
                <p className="text-sm text-muted-foreground">Consider increasing time-on-site duration to improve traffic quality and acceptance rate.</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">Apply Fix</Button>
                </div>
              </div>
              
              <div className="p-4 bg-success/10 border border-success/20 rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  High Performance on 9Hits
                </h3>
                <p className="text-sm text-muted-foreground">9Hits is showing great acceptance rate. Consider allocating more budget to this platform.</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">Optimize Budget</Button>
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  New Opportunity Detected
                </h3>
                <p className="text-sm text-muted-foreground">Our AI has detected a potential opportunity to improve traffic quality by adjusting campaign settings.</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrafficAnalytics;