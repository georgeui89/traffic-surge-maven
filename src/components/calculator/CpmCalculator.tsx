
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Calculator, Percent, DollarSign, HelpCircle, 
  ExternalLink, Clock, Activity, BarChart2, 
  TrendingUp, Download, Target, AlertTriangle, 
  Check, ChevronDown, ChevronUp, Info, Zap,
  PieChart, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  platformData, 
  calculateCPMStrategy,
  distributeRevenue, 
  generateMultiPlatformResults,
  calculateCreditsForRevenue,
  calculateRevenueFromCredits,
  formatTime
} from '@/utils/cpmCalculatorUtils';

interface CpmCalculatorProps {
  className?: string;
}

// Platform interface
interface Platform {
  id: string;
  name: string;
  enabled: boolean;
  cpm: number;
  conversionFactor: number;
  visitDuration: number;
  acceptanceRate: number;
  creditsNeeded: number;
  visitsGenerated: number;
  validImpressions: number;
  revenue: number;
  efficiency: number;
  color: string;
  timeEstimate: string;
}

// Dashboard metrics interface
interface DashboardMetrics {
  totalVisits: number;
  validImpressions: number;
  revenue: number;
  acceptanceRate: number;
  totalCredits: number;
  timeEstimate: string;
}

// Distribution method type
type DistributionMethod = 'equal' | 'weighted' | 'optimal' | 'manual';

export default function CpmCalculator({ className }: CpmCalculatorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('calculate-credits');
  const [revenueGoal, setRevenueGoal] = useState<number>(50);
  const [timeOnSite, setTimeOnSite] = useState<number>(30);
  const [distributionMethod, setDistributionMethod] = useState<DistributionMethod>('equal');
  const [useUnevenDistribution, setUseUnevenDistribution] = useState<boolean>(false);

  // Dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0,
    totalCredits: 0,
    timeEstimate: '0h 0m 0s'
  });

  // Previous metrics for percentage change calculation
  const [prevMetrics, setPrevMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0,
    totalCredits: 0,
    timeEstimate: '0h 0m 0s'
  });

  // Initial platform data
  const [platforms, setPlatforms] = useState<Platform[]>(
    Object.entries(platformData).map(([key, data]) => ({ 
      id: key.toLowerCase().replace('.', ''), 
      name: key, 
      enabled: true, 
      cpm: data.cpm, 
      conversionFactor: data.conversionFactor,
      visitDuration: data.visitLength,
      acceptanceRate: data.acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0,
      efficiency: data.efficiency,
      color: data.color,
      timeEstimate: '0h 0m 0s'
    }))
  );

  // Custom distribution percentages for manual distribution
  const [customDistribution, setCustomDistribution] = useState<Record<string, number>>(
    Object.entries(platformData).reduce((acc, [key, _]) => {
      acc[key] = 20; // Default to 20% per platform (adjust based on number of platforms)
      return acc;
    }, {} as Record<string, number>)
  );

  // Update calculations when inputs change
  useEffect(() => {
    // Store previous metrics before updating
    setPrevMetrics({ ...dashboardMetrics });
    
    const enabledPlatforms = platforms.filter(p => p.enabled);
    if (enabledPlatforms.length === 0) {
      setDashboardMetrics({
        totalVisits: 0,
        validImpressions: 0,
        revenue: 0,
        acceptanceRate: 0,
        totalCredits: 0,
        timeEstimate: '0h 0m 0s'
      });
      return;
    }

    // Convert platform objects to names for the calculation function
    const platformNames = enabledPlatforms.map(p => p.name);
    
    // Prepare custom distribution if used
    const customDistributionObject = useUnevenDistribution ? 
      enabledPlatforms.reduce((acc, platform) => {
        acc[platform.name] = customDistribution[platform.name] || 0;
        return acc;
      }, {} as Record<string, number>) :
      {};
    
    // Calculate strategy based on distribution method
    const strategy = calculateCPMStrategy(
      platformNames, 
      revenueGoal, 
      useUnevenDistribution ? 'manual' : distributionMethod,
      customDistributionObject
    );
    
    // Update platforms with calculated values
    const updatedPlatforms = platforms.map(platform => {
      const result = strategy.results.find(r => r.platform === platform.name);
      
      if (result && platform.enabled) {
        return {
          ...platform,
          creditsNeeded: result.creditsNeeded,
          visitsGenerated: result.visits,
          validImpressions: result.validImpressions,
          revenue: result.revenue,
          timeEstimate: result.timeEstimate
        };
      }
      return platform;
    });

    setPlatforms(updatedPlatforms);
    
    // Update dashboard metrics
    setDashboardMetrics({
      totalVisits: strategy.totals.visits,
      validImpressions: strategy.totals.validImpressions,
      revenue: strategy.totals.revenue,
      acceptanceRate: parseFloat(strategy.totals.acceptanceRate.toFixed(2)),
      totalCredits: strategy.totals.credits,
      timeEstimate: strategy.totals.timeEstimate
    });
  }, [
    platforms.map(p => p.enabled).join(','), 
    revenueGoal, 
    distributionMethod, 
    useUnevenDistribution, 
    JSON.stringify(customDistribution)
  ]);

  // Calculate percentage change between current and previous metrics
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Toggle platform enabled status
  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  // Update platform parameters
  const updatePlatform = (platformId: string, field: string, value: number) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, [field]: value } : p
    ));
  };

  // Update platform custom distribution percentage
  const updatePlatformDistribution = (platformName: string, value: number) => {
    setCustomDistribution(prev => ({
      ...prev,
      [platformName]: value
    }));
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('CPM Strategy Report', 20, 20);
    
    // Add dashboard metrics
    doc.setFontSize(14);
    doc.text('Dashboard Metrics', 20, 35);
    doc.setFontSize(12);
    doc.text(`Total Revenue Goal: $${revenueGoal.toFixed(2)}`, 25, 45);
    doc.text(`Total Visits: ${Math.round(dashboardMetrics.totalVisits).toLocaleString()}`, 25, 55);
    doc.text(`Valid Impressions: ${Math.round(dashboardMetrics.validImpressions).toLocaleString()}`, 25, 65);
    doc.text(`Total Revenue: $${dashboardMetrics.revenue.toFixed(2)}`, 25, 75);
    doc.text(`Average Acceptance Rate: ${Math.round(dashboardMetrics.acceptanceRate)}%`, 25, 85);
    doc.text(`Total Credits Required: ${Math.round(dashboardMetrics.totalCredits).toLocaleString()}`, 25, 95);
    doc.text(`Estimated Time: ${dashboardMetrics.timeEstimate}`, 25, 105);
    
    // Add platform details
    doc.setFontSize(14);
    doc.text('Platform Details', 20, 125);
    
    let y = 135;
    platforms.filter(p => p.enabled).forEach((platform) => {
      // If we're about to go off the page, add a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Platform: ${platform.name}`, 25, y);
      doc.text(`CPM Rate: $${platform.cpm.toFixed(2)}`, 25, y + 10);
      doc.text(`Visit Duration: ${platform.visitDuration}s`, 25, y + 20);
      doc.text(`Acceptance Rate: ${platform.acceptanceRate}%`, 25, y + 30);
      doc.text(`Required Credits: ${Math.round(platform.creditsNeeded).toLocaleString()}`, 25, y + 40);
      doc.text(`Revenue Contribution: $${platform.revenue.toFixed(2)}`, 25, y + 50);
      doc.text(`Estimated Time: ${platform.timeEstimate}`, 25, y + 60);
      
      y += 80;
    });
    
    // Add distribution method information
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Distribution Strategy', 20, 20);
    doc.setFontSize(12);
    doc.text(`Method: ${useUnevenDistribution ? 'Custom Distribution' : distributionMethod}`, 25, 30);
    
    if (useUnevenDistribution) {
      doc.text('Custom Percentages:', 25, 40);
      let customY = 50;
      platforms.filter(p => p.enabled).forEach(platform => {
        doc.text(`${platform.name}: ${customDistribution[platform.name] || 0}%`, 30, customY);
        customY += 10;
      });
    }
    
    // Add optimization tips
    doc.setFontSize(14);
    doc.text('Optimization Tips', 20, customY ? customY + 20 : 60);
    doc.setFontSize(10);
    doc.text('1. Increase time on site to improve acceptance rates', 25, customY ? customY + 30 : 70);
    doc.text('2. Focus on high-value regions for better CPM rates', 25, customY ? customY + 40 : 80);
    doc.text('3. Distribute credits across platforms based on efficiency', 25, customY ? customY + 50 : 90);
    doc.text('4. Optimize for mobile traffic which typically has higher CPM', 25, customY ? customY + 60 : 100);
    
    // Save the PDF
    doc.save('CPM_Strategy_Report.pdf');
    
    toast({
      title: "Report Generated",
      description: "Your CPM strategy report has been downloaded.",
      duration: 3000,
    });
  };

  // Reset all settings
  const resetSettings = () => {
    setRevenueGoal(50);
    setTimeOnSite(30);
    setDistributionMethod('equal');
    setUseUnevenDistribution(false);
    
    // Reset platforms to default values
    setPlatforms(Object.entries(platformData).map(([key, data]) => ({ 
      id: key.toLowerCase().replace('.', ''), 
      name: key, 
      enabled: true, 
      cpm: data.cpm, 
      conversionFactor: data.conversionFactor,
      visitDuration: data.visitLength,
      acceptanceRate: data.acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0,
      efficiency: data.efficiency,
      color: data.color,
      timeEstimate: '0h 0m 0s'
    })));
    
    // Reset custom distribution
    setCustomDistribution(
      Object.entries(platformData).reduce((acc, [key, _]) => {
        acc[key] = 20;
        return acc;
      }, {} as Record<string, number>)
    );
    
    toast({
      title: "Settings Reset",
      description: "All calculator settings have been reset to defaults.",
      duration: 2000,
    });
  };

  // Calculate efficiency rating (1-100) for a platform
  const calculateEfficiencyRating = (platform: Platform): number => {
    const creditsPerDollar = platform.creditsNeeded / Math.max(0.01, platform.revenue);
    
    // Get the max and min credits per dollar across all enabled platforms
    const enabledPlatforms = platforms.filter(p => p.enabled);
    if (enabledPlatforms.length <= 1) return 100; // If only one platform, it's 100% efficient
    
    const allCreditsPerDollar = enabledPlatforms.map(p => 
      p.creditsNeeded / Math.max(0.01, p.revenue)
    );
    
    const maxCreditsPerDollar = Math.max(...allCreditsPerDollar);
    const minCreditsPerDollar = Math.min(...allCreditsPerDollar);
    
    // If all platforms have the same efficiency, return 100
    if (maxCreditsPerDollar === minCreditsPerDollar) return 100;
    
    // Normalize to 0-100 scale, where lower credits per dollar (more efficient) means higher score
    const normalizedValue = 100 - (((creditsPerDollar - minCreditsPerDollar) / (maxCreditsPerDollar - minCreditsPerDollar)) * 100);
    return Math.round(normalizedValue);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> 
              Ultimate CPM Strategy Calculator
            </CardTitle>
            <CardDescription>
              Plan and optimize your autosurf traffic strategy across multiple platforms
            </CardDescription>
          </div>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculate-credits">Plan for Revenue Goal</TabsTrigger>
              <TabsTrigger value="calculate-revenue">Calculate Revenue</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="bg-muted/5 border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round(dashboardMetrics.totalVisits).toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={calculatePercentageChange(dashboardMetrics.totalVisits, prevMetrics.totalVisits) >= 0 ? "outline" : "destructive"} className="text-xs">
                    {calculatePercentageChange(dashboardMetrics.totalVisits, prevMetrics.totalVisits) >= 0 ? "+" : ""}
                    {calculatePercentageChange(dashboardMetrics.totalVisits, prevMetrics.totalVisits).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/5 border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Impressions</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round(dashboardMetrics.validImpressions).toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-full">
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={calculatePercentageChange(dashboardMetrics.validImpressions, prevMetrics.validImpressions) >= 0 ? "outline" : "destructive"} className="text-xs">
                    {calculatePercentageChange(dashboardMetrics.validImpressions, prevMetrics.validImpressions) >= 0 ? "+" : ""}
                    {calculatePercentageChange(dashboardMetrics.validImpressions, prevMetrics.validImpressions).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/5 border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <h3 className="text-2xl font-bold">
                      ${dashboardMetrics.revenue.toFixed(2)}
                    </h3>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={calculatePercentageChange(dashboardMetrics.revenue, prevMetrics.revenue) >= 0 ? "outline" : "destructive"} className="text-xs">
                    {calculatePercentageChange(dashboardMetrics.revenue, prevMetrics.revenue) >= 0 ? "+" : ""}
                    {calculatePercentageChange(dashboardMetrics.revenue, prevMetrics.revenue).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/5 border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round(dashboardMetrics.totalCredits).toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 bg-cyan-500/10 rounded-full">
                    <Activity className="h-5 w-5 text-cyan-500" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-muted/20">
                    {dashboardMetrics.timeEstimate}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="calculate-credits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue-goal">Revenue Goal ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="revenue-goal" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={revenueGoal}
                      onChange={(e) => setRevenueGoal(parseFloat(e.target.value) || 0)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Distribution Method</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button 
                        variant={!useUnevenDistribution && distributionMethod === 'equal' ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setUseUnevenDistribution(false);
                          setDistributionMethod('equal');
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'equal' ? 'opacity-100' : 'opacity-0'}`} />
                          <span>Equal</span>
                        </div>
                      </Button>
                      
                      <Button 
                        variant={!useUnevenDistribution && distributionMethod === 'weighted' ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setUseUnevenDistribution(false);
                          setDistributionMethod('weighted');
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'weighted' ? 'opacity-100' : 'opacity-0'}`} />
                          <span>Weighted</span>
                        </div>
                      </Button>
                      
                      <Button 
                        variant={!useUnevenDistribution && distributionMethod === 'optimal' ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setUseUnevenDistribution(false);
                          setDistributionMethod('optimal');
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'optimal' ? 'opacity-100' : 'opacity-0'}`} />
                          <span>Optimal</span>
                        </div>
                      </Button>
                      
                      <Button 
                        variant={useUnevenDistribution ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          setUseUnevenDistribution(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${useUnevenDistribution ? 'opacity-100' : 'opacity-0'}`} />
                          <span>Manual</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                          <Info className="h-4 w-4" />
                          <span>About distribution methods</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          <strong>Equal:</strong> Divides revenue goal equally across platforms<br />
                          <strong>Weighted:</strong> Distributes based on platform performance metrics<br />
                          <strong>Optimal:</strong> Maximizes efficiency based on platform metrics<br />
                          <strong>Manual:</strong> Set custom percentage for each platform
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {useUnevenDistribution && (
                    <div className="mt-4 space-y-4 border rounded-md p-4">
                      <h4 className="text-sm font-medium">Manual Distribution</h4>
                      {platforms.filter(p => p.enabled).map((platform) => (
                        <div key={`dist-${platform.id}`} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{platform.name}</span>
                            <span>{customDistribution[platform.name] || 0}%</span>
                          </div>
                          <Slider
                            value={[customDistribution[platform.name] || 0]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(values) => updatePlatformDistribution(platform.name, values[0])}
                            className={`${platform.color ? `[&>[role=slider]]:bg-[${platform.color}]` : ''}`}
                          />
                        </div>
                      ))}
                      
                      <div className="text-xs text-muted-foreground">
                        Total: {platforms
                          .filter(p => p.enabled)
                          .reduce((sum, p) => sum + (customDistribution[p.name] || 0), 0)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/10">
                <h3 className="text-base font-medium mb-3">Platform Selection</h3>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`platform-${platform.id}`} 
                          checked={platform.enabled}
                          onCheckedChange={() => togglePlatform(platform.id)}
                        />
                        <Label htmlFor={`platform-${platform.id}`} className="cursor-pointer flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: platform.color || '#CCCCCC' }}
                          ></div>
                          {platform.name}
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CPM: ${platform.cpm.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Platform Settings</h4>
                  <Alert variant="default" className="bg-muted/20">
                    <AlertDescription className="text-xs flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Advanced platform settings are available in the Settings tab
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Platform Results</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetSettings}>
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left">Platform</th>
                      <th className="py-2 px-4 text-left">Credits Needed</th>
                      <th className="py-2 px-4 text-left">Expected Visits</th>
                      <th className="py-2 px-4 text-left">Valid Impressions</th>
                      <th className="py-2 px-4 text-left">Revenue</th>
                      <th className="py-2 px-4 text-left">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.filter(p => p.enabled).map((platform) => (
                      <tr key={`results-${platform.id}`} className="border-t">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: platform.color || '#CCCCCC' }}
                            ></div>
                            {platform.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {Math.round(platform.creditsNeeded).toLocaleString()}
                          <div className="text-xs text-muted-foreground">{platform.timeEstimate}</div>
                        </td>
                        <td className="py-3 px-4">{Math.round(platform.visitsGenerated).toLocaleString()}</td>
                        <td className="py-3 px-4">{Math.round(platform.validImpressions).toLocaleString()}</td>
                        <td className="py-3 px-4">${platform.revenue.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${calculateEfficiencyRating(platform) > 80 ? "bg-green-500" : calculateEfficiencyRating(platform) > 50 ? "bg-blue-500" : "bg-amber-500"}`} 
                                style={{ width: `${calculateEfficiencyRating(platform)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{calculateEfficiencyRating(platform)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/20">
                      <td className="py-3 px-4 font-medium">Total</td>
                      <td className="py-3 px-4 font-medium">
                        {Math.round(dashboardMetrics.totalCredits).toLocaleString()}
                        <div className="text-xs font-normal">{dashboardMetrics.timeEstimate}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {Math.round(dashboardMetrics.totalVisits).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {Math.round(dashboardMetrics.validImpressions).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${dashboardMetrics.revenue.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculate-revenue" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue from Credits</CardTitle>
                  <CardDescription>
                    Calculate potential revenue based on available credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4 bg-muted/30">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="flex items-center gap-2">
                      <span>This mode will be available in the next update</span>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center justify-center p-10 rounded-lg bg-gradient-to-b from-muted/10 to-muted/30">
                    <div className="text-center">
                      <Clock className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        We're working on a feature to calculate expected revenue from your available credits across multiple platforms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-base font-medium">Optimization Tips</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Improve Acceptance Rate</p>
                  <p className="text-xs text-muted-foreground">
                    Increase time on site to at least 30 seconds and ensure your site loads quickly to improve acceptance rates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Maximize CPM</p>
                  <p className="text-xs text-muted-foreground">
                    Focus on high-value regions like US, Canada, UK, and implement mobile-friendly designs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Optimize Time on Site</p>
                  <p className="text-xs text-muted-foreground">
                    Add engaging content or use delayed redirects to keep visitors on your site longer.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <PieChart className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Balance Platform Mix</p>
                  <p className="text-xs text-muted-foreground">
                    Distribute credits across platforms based on their efficiency to maximize overall ROI.
                  </p>
                </div>
              </div>
            </div>
            
            <Alert className="bg-primary/5 border-primary/20 mt-4">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                Use the "Optimal" distribution method for the most efficient allocation of your revenue goal across platforms.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Results are estimates based on the provided inputs.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={resetSettings}>
            <Calculator className="h-4 w-4 mr-2" />
            Reset Calculation
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
