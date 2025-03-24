import { useState, useEffect } from 'react';
import { Activity, DollarSign, TrendingUp, Percent, Server, Globe, MonitorPlay, Calendar, Download, RefreshCw, Filter } from 'lucide-react';
import { EnhancedMetricCard } from '@/components/dashboard/EnhancedMetricCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { PlatformStatus } from '@/components/dashboard/PlatformStatus';
import { dashboardSummary, generateDailyTrafficData } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [sparklineData, setSparklineData] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate sparkline data for metric cards
    const data = generateDailyTrafficData(7);
    setSparklineData(data.map(item => item.visits / 1000));
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard Refreshed",
        description: "All metrics and charts have been updated.",
        type: "success",
        duration: 3000,
      });
    }, 1500);
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your dashboard data is being exported to CSV.",
      type: "info",
      duration: 3000,
    });
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col gap-6">
        {/* Enhanced Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor your traffic performance and earnings</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport} className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Key Metrics Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <EnhancedMetricCard
            title="Total Visits"
            value={dashboardSummary.totalVisits}
            formatter="number"
            icon={<Activity className="h-4 w-4 text-traffic" />}
            iconBackground="bg-traffic/10"
            footnote="Last 30 days"
            color="text-traffic"
            sparklineData={sparklineData}
            previousValue={dashboardSummary.totalVisits * 0.9}
            showChangePercent={true}
          />
          
          <EnhancedMetricCard
            title="Valid Impressions"
            value={dashboardSummary.validImpressions}
            formatter="number"
            icon={<TrendingUp className="h-4 w-4 text-platforms" />}
            iconBackground="bg-platforms/10"
            footnote="Last 30 days"
            color="text-platforms"
            sparklineData={sparklineData.map(v => v * 0.4)}
            previousValue={dashboardSummary.validImpressions * 0.85}
            showChangePercent={true}
          />
          
          <EnhancedMetricCard
            title="Revenue"
            value={dashboardSummary.revenue}
            target={dashboardSummary.dailyGoal}
            formatter="currency"
            icon={<DollarSign className="h-4 w-4 text-earnings" />}
            iconBackground="bg-earnings/10"
            showProgress={true}
            footnote="Today vs. Daily Goal"
            color="text-earnings"
            sparklineData={sparklineData.map(v => v * 0.05)}
            previousValue={dashboardSummary.revenue * 0.92}
            showChangePercent={true}
          />
          
          <EnhancedMetricCard
            title="Acceptance Rate"
            value={dashboardSummary.acceptanceRate}
            formatter="percent"
            icon={<Percent className="h-4 w-4 text-warning" />}
            iconBackground="bg-warning/10"
            footnote="Average last 7 days"
            color="text-warning"
            sparklineData={[32, 35, 38, 36, 34, 36, 38]}
            previousValue={dashboardSummary.acceptanceRate * 0.95}
            showChangePercent={true}
          />
        </motion.div>
        
        {/* Main Content Area with Tabs */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <Tabs defaultValue="overview">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="platforms">Platforms</TabsTrigger>
                </TabsList>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrafficChart />
              </div>
              <div>
                <PlatformStatus />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Secondary Content */}
        <ResponsiveGrid cols={{ default: 1, lg: 3 }}>
          <div className="lg:col-span-2">
            <CollapsibleCard 
              title="Earnings Breakdown" 
              description="Revenue by platform and time period"
              defaultOpen={true}
            >
              <EarningsChart />
            </CollapsibleCard>
          </div>
          
          <div>
            <CollapsibleCard 
              title="Resource Status" 
              description="RDPs, platforms, and campaigns"
              defaultOpen={true}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-rdp" />
                    <span>Active RDPs</span>
                  </div>
                  <span className="font-medium">{dashboardSummary.activeRdps} / {dashboardSummary.totalRdps}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-platforms" />
                    <span>Active Platforms</span>
                  </div>
                  <span className="font-medium">{dashboardSummary.platforms.active} / {dashboardSummary.platforms.total}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                  <div className="flex items-center gap-2">
                    <MonitorPlay className="h-4 w-4 text-primary" />
                    <span>Active Campaigns</span>
                  </div>
                  <span className="font-medium">{dashboardSummary.activeCampaigns} / {dashboardSummary.totalCampaigns}</span>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        </ResponsiveGrid>
      </div>
    </div>
  );
};

export default Dashboard;