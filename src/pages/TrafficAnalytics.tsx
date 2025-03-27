import { useState } from 'react';
import { TrendingUp, Clock, Filter, ArrowDown, Calendar, Download, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TrafficQualityChart } from '@/components/analytics/TrafficQualityChart';
import { AcceptanceRateChart } from '@/components/analytics/AcceptanceRateChart';
import { TrafficSourcesChart } from '@/components/analytics/TrafficSourcesChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generateDailyTrafficData } from '@/utils/mockData';
import { ScenarioPlanner } from '@/components/budget/ScenarioPlanner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TimeRange = '24h' | '7d' | '30d' | '90d';

const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFixDialog, setShowFixDialog] = useState(false);
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
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

  const handleApplyFix = () => {
    setShowFixDialog(false);
    toast({
      title: "Fix Applied",
      description: "HitLeap time-on-site duration has been increased to improve acceptance rate.",
      duration: 3000,
    });
  };

  const handleOptimizeBudget = () => {
    setShowOptimizeDialog(false);
    toast({
      title: "Budget Optimized",
      description: "Budget has been reallocated to focus more on 9Hits platform.",
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
          <ScenarioPlanner />
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
              <SelectItem value="bighits4u">BigHits4U</SelectItem>
              <SelectItem value="webhitnet">Webhit.net</SelectItem>
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
          <CardTitle className="flex items-center gap-2">
            Traffic Quality Optimization Suggestions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">AI-powered recommendations to improve your traffic quality and performance.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
              <h3 className="text-sm font-medium mb-2">Low Acceptance Rate on HitLeap</h3>
              <p className="text-sm text-muted-foreground">Consider increasing time-on-site duration to improve traffic quality and acceptance rate.</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setShowFixDialog(true)}>Apply Fix</Button>
              </div>
            </div>
            
            <div className="p-4 bg-success/10 border border-success/20 rounded-md">
              <h3 className="text-sm font-medium mb-2">High Performance on 9Hits</h3>
              <p className="text-sm text-muted-foreground">9Hits is showing great acceptance rate. Consider allocating more budget to this platform.</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setShowOptimizeDialog(true)}>Optimize Budget</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Acceptance Rate Fix Dialog */}
      <Dialog open={showFixDialog} onOpenChange={setShowFixDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Optimization Fix</DialogTitle>
            <DialogDescription>
              Increase time-on-site duration for HitLeap traffic to improve acceptance rate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">Current Configuration</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Platform:</span>
                  <span>HitLeap</span>
                  <span className="text-muted-foreground">Current Time-on-Site:</span>
                  <span>15 seconds</span>
                  <span className="text-muted-foreground">Acceptance Rate:</span>
                  <span className="text-warning">72.4%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-on-site">New Time-on-Site Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="time-on-site">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds (Recommended)</SelectItem>
                    <SelectItem value="45">45 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Increasing time-on-site to 30 seconds may improve acceptance rate by approximately 12-15%.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">Projected Impact</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">New Acceptance Rate:</span>
                  <span className="text-success">83-87%</span>
                  <span className="text-muted-foreground">Est. Revenue Increase:</span>
                  <span className="text-success">+14.8%</span>
                  <span className="text-muted-foreground">Credits Used:</span>
                  <span>Same as current</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFixDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFix}>
              Apply Fix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Optimize Budget Dialog */}
      <Dialog open={showOptimizeDialog} onOpenChange={setShowOptimizeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Optimize Budget Allocation</DialogTitle>
            <DialogDescription>
              Reallocate budget to focus more on high-performing platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">Platform Performance</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">9Hits Acceptance Rate:</span>
                  <span className="text-success">89.7%</span>
                  <span className="text-muted-foreground">HitLeap Acceptance Rate:</span>
                  <span className="text-warning">72.4%</span>
                  <span className="text-muted-foreground">Current Budget Split:</span>
                  <span>Equal (50% / 50%)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reallocation-strategy">Reallocation Strategy</Label>
                <Select defaultValue="70-30">
                  <SelectTrigger id="reallocation-strategy">
                    <SelectValue placeholder="Select allocation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60-40">60% 9Hits / 40% HitLeap</SelectItem>
                    <SelectItem value="70-30">70% 9Hits / 30% HitLeap (Recommended)</SelectItem>
                    <SelectItem value="80-20">80% 9Hits / 20% HitLeap</SelectItem>
                    <SelectItem value="custom">Custom Allocation</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This reallocation focuses more budget on the platform with higher acceptance rate and ROI.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">Projected Impact</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Overall Acceptance Rate:</span>
                  <span className="text-success">+8.3%</span>
                  <span className="text-muted-foreground">Est. Revenue Increase:</span>
                  <span className="text-success">+11.2%</span>
                  <span className="text-muted-foreground">Est. ROI Increase:</span>
                  <span className="text-success">+15.7%</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOptimizeBudget}>
              Apply Optimization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrafficAnalytics;
