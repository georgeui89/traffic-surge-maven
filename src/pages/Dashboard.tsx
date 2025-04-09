
import { Activity, DollarSign, TrendingUp, Percent, Server, Globe, MonitorPlay, RefreshCw, Download, Filter, HelpCircle, BarChart2 } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { PlatformStatus } from '@/components/dashboard/PlatformStatus';
import { dashboardSummary } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const navigate = useNavigate();
  
  const handleRefresh = () => {
    toast.loading("Refreshing dashboard data...");
    
    // Simulate refresh delay
    setTimeout(() => {
      toast.success("Dashboard data refreshed successfully!");
    }, 1000);
  };
  
  const handleExport = () => {
    toast.loading("Preparing export...");
    
    // Simulate export delay
    setTimeout(() => {
      toast.success("Dashboard data exported successfully!");
      
      // Create and trigger a download for demonstration
      const element = document.createElement('a');
      const file = new Blob(['Dashboard Export - Sample Data'], 
        { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'dashboard-export.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };
  
  return (
    <div className="page-container">
      <div className="page-header backdrop-blur-sm bg-background/60 sticky top-0 z-10 p-4 mb-4 rounded-lg shadow-modern border border-border/30">
        <div>
          <h1 className="page-title text-gradient-primary">Dashboard</h1>
          <p className="page-description">Monitor your traffic performance and earnings</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => toast.success("Filters dialog will open here")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Visits"
          value={dashboardSummary.totalVisits.toLocaleString()}
          icon={<Activity className="h-4 w-4 text-traffic" />}
          variant="traffic"
          trend="up"
          change={8.2}
          className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30"
        />
        
        <MetricCard
          title="Valid Impressions"
          value={dashboardSummary.validImpressions.toLocaleString()}
          icon={<TrendingUp className="h-4 w-4 text-platforms" />}
          variant="platforms"
          trend="up"
          change={5.7}
          className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30"
        />
        
        <MetricCard
          title="Revenue"
          value={`$${dashboardSummary.revenue.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-earnings" />}
          variant="earnings"
          trend="up"
          change={12.3}
          className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30"
        />
        
        <MetricCard
          title="Acceptance Rate"
          value={`${dashboardSummary.acceptanceRate}%`}
          icon={<Percent className="h-4 w-4 text-warning" />}
          variant="warning"
          trend="down"
          change={2.1}
          className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30 h-full">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Traffic Trends</CardTitle>
                  <CardDescription>Monitor traffic patterns across all platforms</CardDescription>
                </div>
                <Tabs 
                  defaultValue="7d" 
                  value={timeRange}
                  onValueChange={setTimeRange}
                  className="h-8"
                >
                  <TabsList className="bg-muted/40">
                    <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
                    <TabsTrigger value="7d" className="text-xs px-3">7d</TabsTrigger>
                    <TabsTrigger value="30d" className="text-xs px-3">30d</TabsTrigger>
                    <TabsTrigger value="90d" className="text-xs px-3">90d</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <TrafficChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30 h-full">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Platform Status</CardTitle>
                  <CardDescription>Current health of connected platforms</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <PlatformStatus />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Daily Earnings</CardTitle>
                  <CardDescription>Track your revenue over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="bar">
                    <SelectTrigger className="w-[110px] h-8">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar View</SelectItem>
                      <SelectItem value="line">Line View</SelectItem>
                      <SelectItem value="area">Area View</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost">
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Earnings:</div>
                  <div className="text-2xl font-semibold">$145.67</div>
                </div>
                <StatusBadge variant="success" label="+12.5% vs last period" withDot />
              </div>
              <EarningsChart />
            </CardContent>
            <CardFooter className="border-t border-border/30 bg-muted/10 p-3">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Tip:</span> Earnings peak on Tuesdays and Wednesdays
                </div>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-rdp/10 p-2 rounded">
                    <Server className="h-4 w-4 text-rdp" />
                  </div>
                  <h3 className="font-medium">Active RDPs</h3>
                </div>
                <StatusBadge variant="success" label="Healthy" size="sm" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold">{dashboardSummary.activeRdps}</div>
                <div className="text-sm text-muted-foreground">
                  of {dashboardSummary.totalRdps} total
                </div>
              </div>
              <div className="mt-4 w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-rdp h-2 rounded-full" 
                  style={{ width: `${(dashboardSummary.activeRdps / dashboardSummary.totalRdps) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-platforms/10 p-2 rounded">
                    <Globe className="h-4 w-4 text-platforms" />
                  </div>
                  <h3 className="font-medium">Active Platforms</h3>
                </div>
                <StatusBadge variant="warning" label="2 Issues" size="sm" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold">{dashboardSummary.platforms.active}</div>
                <div className="text-sm text-muted-foreground">
                  of {dashboardSummary.platforms.total} total
                </div>
              </div>
              <div className="mt-4 w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-platforms h-2 rounded-full" 
                  style={{ width: `${(dashboardSummary.platforms.active / dashboardSummary.platforms.total) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <MonitorPlay className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium">Active Campaigns</h3>
                </div>
                <StatusBadge variant="info" label="Running" size="sm" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-3xl font-bold">{dashboardSummary.activeCampaigns}</div>
                <div className="text-sm text-muted-foreground">
                  of {dashboardSummary.totalCampaigns} total
                </div>
              </div>
              <div className="mt-4 w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(dashboardSummary.activeCampaigns / dashboardSummary.totalCampaigns) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30 mb-8">
        <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 shadow-modern hover:shadow-hover transition-all duration-300"
              onClick={() => navigate('/traffic-analytics')}
            >
              <Activity className="h-6 w-6" />
              <span>View Traffic</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 shadow-modern hover:shadow-hover transition-all duration-300"
              onClick={() => navigate('/rdp-management')}
            >
              <Server className="h-6 w-6" />
              <span>Manage RDPs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 shadow-modern hover:shadow-hover transition-all duration-300"
              onClick={() => navigate('/campaigns')}
            >
              <MonitorPlay className="h-6 w-6" />
              <span>Create Campaign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 shadow-modern hover:shadow-hover transition-all duration-300"
              onClick={() => navigate('/reporting')}
            >
              <DollarSign className="h-6 w-6" />
              <span>View Earnings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
