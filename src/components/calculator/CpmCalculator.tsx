import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Calculator, Percent, DollarSign, HelpCircle, 
  ExternalLink, Clock, Activity, BarChart2, 
  TrendingUp, Download, Target, AlertTriangle, 
  Check, ChevronDown, ChevronUp, Info
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
import { platformData, calculateCPMStrategy } from '@/utils/cpmCalculatorUtils';

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
}

// Dashboard metrics interface
interface DashboardMetrics {
  totalVisits: number;
  validImpressions: number;
  revenue: number;
  acceptanceRate: number;
}

export default function CpmCalculator({ className }: CpmCalculatorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('visits-to-revenue');
  const [revenueGoal, setRevenueGoal] = useState<number>(50);
  const [timeOnSite, setTimeOnSite] = useState<number>(30);
  const [useUnevenDistribution, setUseUnevenDistribution] = useState<boolean>(false);

  // Dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0
  });

  // Previous metrics for percentage change calculation
  const [prevMetrics, setPrevMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0
  });

  // Initial platform data
  const [platforms, setPlatforms] = useState<Platform[]>([
    { 
      id: "otohits", 
      name: "Otohits", 
      enabled: true, 
      cpm: platformData["Otohits"].cpm, 
      conversionFactor: platformData["Otohits"].conversionFactor,
      visitDuration: platformData["Otohits"].visitLength,
      acceptanceRate: platformData["Otohits"].acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0
    },
    { 
      id: "9hits", 
      name: "9Hits", 
      enabled: true, 
      cpm: platformData["9Hits"].cpm, 
      conversionFactor: platformData["9Hits"].conversionFactor,
      visitDuration: platformData["9Hits"].visitLength,
      acceptanceRate: platformData["9Hits"].acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0
    },
    { 
      id: "bighits4u", 
      name: "BigHits4U", 
      enabled: true, 
      cpm: platformData["BigHits4U"].cpm, 
      conversionFactor: platformData["BigHits4U"].conversionFactor,
      visitDuration: platformData["BigHits4U"].visitLength,
      acceptanceRate: platformData["BigHits4U"].acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0
    },
    { 
      id: "hitleap", 
      name: "Hitleap", 
      enabled: true, 
      cpm: platformData["Hitleap"].cpm, 
      conversionFactor: platformData["Hitleap"].conversionFactor,
      visitDuration: platformData["Hitleap"].visitLength,
      acceptanceRate: platformData["Hitleap"].acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0
    },
    { 
      id: "webhit", 
      name: "Webhit.net", 
      enabled: true, 
      cpm: platformData["Webhit.net"].cpm, 
      conversionFactor: platformData["Webhit.net"].conversionFactor,
      visitDuration: platformData["Webhit.net"].visitLength,
      acceptanceRate: platformData["Webhit.net"].acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0
    }
  ]);

  // Platform weights for uneven distribution
  const [platformWeights, setPlatformWeights] = useState<{[key: string]: number}>({
    "otohits": 1,
    "9hits": 1,
    "bighits4u": 1,
    "hitleap": 1,
    "webhit": 1
  });

  // Calculate needed credits for a platform to reach target revenue
  const calculateNeededCredits = (platform: Platform, targetRevenue: number) => {
    if (!platform.enabled || targetRevenue <= 0) return 0;
    
    const validImpressionsNeeded = (targetRevenue * 1000) / platform.cpm;
    const visitsNeeded = validImpressionsNeeded / (platform.acceptanceRate / 100);
    const totalSecondsNeeded = visitsNeeded * platform.visitDuration;
    return totalSecondsNeeded / platform.conversionFactor;
  };

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
        acceptanceRate: 0
      });
      return;
    }

    // Use the CPM strategy calculation
    const platformNames = enabledPlatforms.map(p => {
      // Map internal platform IDs to platformData keys
      if (p.id === "otohits") return "Otohits";
      if (p.id === "9hits") return "9Hits";
      if (p.id === "bighits4u") return "BigHits4U";
      if (p.id === "hitleap") return "Hitleap";
      if (p.id === "webhit") return "Webhit.net";
      return p.name;
    });

    // Calculate strategy based on enabled platforms
    const strategy = calculateCPMStrategy(platformNames, revenueGoal);
    
    // Update platforms with calculated values
    const updatedPlatforms = platforms.map(platform => {
      const result = strategy.results.find(r => {
        if (platform.id === "otohits" && r.platform === "Otohits") return true;
        if (platform.id === "9hits" && r.platform === "9Hits") return true;
        if (platform.id === "bighits4u" && r.platform === "BigHits4U") return true;
        if (platform.id === "hitleap" && r.platform === "Hitleap") return true;
        if (platform.id === "webhit" && r.platform === "Webhit.net") return true;
        return false;
      });

      if (result && platform.enabled) {
        return {
          ...platform,
          creditsNeeded: parseFloat(result.creditsNeeded),
          visitsGenerated: result.visits,
          validImpressions: result.validImpressions,
          revenue: parseFloat(result.revenue)
        };
      }
      return platform;
    });

    setPlatforms(updatedPlatforms);
    
    // Update dashboard metrics
    setDashboardMetrics({
      totalVisits: parseInt(strategy.totals.visits.toString()),
      validImpressions: parseInt(strategy.totals.validImpressions.toString()),
      revenue: parseFloat(strategy.totals.revenue),
      acceptanceRate: parseFloat(strategy.totals.acceptanceRate)
    });
  }, [platforms.map(p => p.enabled).join(','), revenueGoal, timeOnSite]);

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

  // Update platform weight
  const updatePlatformWeight = (platformId: string, value: number) => {
    setPlatformWeights(prev => ({
      ...prev,
      [platformId]: value
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
    
    // Add platform details
    doc.setFontSize(14);
    doc.text('Platform Details', 20, 105);
    
    let y = 115;
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
      
      y += 70;
    });
    
    // Save the PDF
    doc.save('CPM_Strategy_Report.pdf');
    
    toast({
      title: "Report Generated",
      description: "Your CPM strategy report has been downloaded.",
      duration: 3000,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> 
              Multi-Platform CPM Strategy Calculator
            </CardTitle>
            <CardDescription>
              Calculate revenue potential and credits needed across multiple autosurf platforms
            </CardDescription>
          </div>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visits-to-revenue">Calculate Revenue</TabsTrigger>
              <TabsTrigger value="revenue-to-credits">Plan for Revenue Goal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/5 border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round(dashboardMetrics.totalVisits).toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 bg-traffic/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-traffic" />
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
                  <div className="p-2 bg-platforms/10 rounded-full">
                    <BarChart2 className="h-5 w-5 text-platforms" />
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
                  <div className="p-2 bg-earnings/10 rounded-full">
                    <DollarSign className="h-5 w-5 text-earnings" />
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
                    <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                    <h3 className="text-2xl font-bold">
                      {Math.round(dashboardMetrics.acceptanceRate)}%
                    </h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={calculatePercentageChange(dashboardMetrics.acceptanceRate, prevMetrics.acceptanceRate) >= 0 ? "outline" : "destructive"} className="text-xs">
                    {calculatePercentageChange(dashboardMetrics.acceptanceRate, prevMetrics.acceptanceRate) >= 0 ? "+" : ""}
                    {calculatePercentageChange(dashboardMetrics.acceptanceRate, prevMetrics.acceptanceRate).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="visits-to-revenue" className="space-y-6">
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
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="time-on-site">Average Time on Site</Label>
                    <span className="text-sm text-muted-foreground">{timeOnSite}s</span>
                  </div>
                  <Slider
                    id="time-on-site"
                    min={5}
                    max={60}
                    step={1}
                    value={[timeOnSite]}
                    onValueChange={(values) => setTimeOnSite(values[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uneven-distribution"
                    checked={useUnevenDistribution}
                    onCheckedChange={setUseUnevenDistribution}
                  />
                  <Label htmlFor="uneven-distribution">Use weighted revenue distribution</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Distribute revenue goal based on platform weights instead of evenly.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                        <Label htmlFor={`platform-${platform.id}`} className="cursor-pointer">
                          {platform.name}
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CPM: ${platform.cpm.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {useUnevenDistribution && (
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium">Platform Weights</h4>
                    {platforms.filter(p => p.enabled).map((platform) => (
                      <div key={`weight-${platform.id}`} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{platform.name}</span>
                          <span>Weight: {platformWeights[platform.id]}</span>
                        </div>
                        <Slider
                          value={[platformWeights[platform.id]]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(values) => updatePlatformWeight(platform.id, values[0])}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-base font-medium">Platform Results</h3>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-4 text-left">Platform</th>
                      <th className="py-2 px-4 text-left">Credits Needed</th>
                      <th className="py-2 px-4 text-left">Expected Visits</th>
                      <th className="py-2 px-4 text-left">Valid Impressions</th>
                      <th className="py-2 px-4 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.filter(p => p.enabled).map((platform) => (
                      <tr key={`results-${platform.id}`} className="border-t">
                        <td className="py-3 px-4">{platform.name}</td>
                        <td className="py-3 px-4">{Math.round(platform.creditsNeeded).toLocaleString()}</td>
                        <td className="py-3 px-4">{Math.round(platform.visitsGenerated).toLocaleString()}</td>
                        <td className="py-3 px-4">{Math.round(platform.validImpressions).toLocaleString()}</td>
                        <td className="py-3 px-4">${platform.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/20">
                      <td className="py-3 px-4 font-medium">Total</td>
                      <td className="py-3 px-4 font-medium">
                        {Math.round(platforms.filter(p => p.enabled).reduce((sum, p) => sum + p.creditsNeeded, 0)).toLocaleString()}
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue-to-credits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Enter a revenue goal and see how many credits you need across platforms to achieve it.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="target-revenue">Target Revenue ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="target-revenue" 
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
                  <h4 className="text-sm font-medium">Selected Platforms</h4>
                  {platforms.map((platform) => (
                    <div key={`advanced-${platform.id}`} className="border rounded-md p-3 bg-muted/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`adv-platform-${platform.id}`} 
                            checked={platform.enabled}
                            onCheckedChange={() => togglePlatform(platform.id)}
                          />
                          <Label htmlFor={`adv-platform-${platform.id}`} className="font-medium cursor-pointer">
                            {platform.name}
                          </Label>
                        </div>
                        
                        {useUnevenDistribution && platform.enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`weight-${platform.id}`} className="text-xs">Weight:</Label>
                            <Input
                              id={`weight-${platform.id}`}
                              type="number"
                              min="1"
                              max="10"
                              value={platformWeights[platform.id]}
                              onChange={(e) => updatePlatformWeight(platform.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-7 text-xs"
                            />
                          </div>
                        )}
                      </div>
                      
                      {platform.enabled && (
                        <div className="space-y-3 mt-3 pt-3 border-t">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`cpm-${platform.id}`} className="text-xs">CPM Rate ($)</Label>
                              <Input
                                id={`cpm-${platform.id}`}
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={platform.cpm}
                                onChange={(e) => updatePlatform(platform.id, 'cpm', parseFloat(e.target.value) || 0.01)}
                                className="h-7 text-sm"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`acceptance-${platform.id}`} className="text-xs">Acceptance Rate (%)</Label>
                              <Input
                                id={`acceptance-${platform.id}`}
                                type="number"
                                min="0"
                                max="100"
                                value={platform.acceptanceRate}
                                onChange={(e) => updatePlatform(platform.id, 'acceptanceRate', parseFloat(e.target.value) || 0)}
                                className="h-7 text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`visit-duration-${platform.id}`} className="text-xs">Visit Duration (seconds)</Label>
                            <Input
                              id={`visit-duration-${platform.id}`}
                              type="number"
                              min="5"
                              max="120"
                              value={platform.visitDuration}
                              onChange={(e) => updatePlatform(platform.id, 'visitDuration', parseInt(e.target.value) || 5)}
                              className="h-7 text-sm"
                            />
                          </div>
                          
                          <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm">
                              <span>Credits Needed:</span>
                              <span className="font-medium">{Math.round(platform.creditsNeeded).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Revenue Contribution:</span>
                              <span className="font-medium">${platform.revenue.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="adv-uneven-distribution"
                    checked={useUnevenDistribution}
                    onCheckedChange={setUseUnevenDistribution}
                  />
                  <Label htmlFor="adv-uneven-distribution">Use weighted distribution</Label>
                </div>
                
                <Card className="bg-muted/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Credit Requirements</CardTitle>
                    <CardDescription>Credits needed to reach your revenue goal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {platforms.filter(p => p.enabled).map((platform) => (
                      <div key={`req-${platform.id}`} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-${platform.id === 'otohits' ? 'primary' : platform.id === '9hits' ? 'traffic' : platform.id === 'bighits4u' ? 'platforms' : platform.id === 'hitleap' ? 'earnings' : 'muted-foreground'}`}></div>
                          <span>{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.round(platform.creditsNeeded).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">${platform.revenue.toFixed(2)} revenue</div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-2 border-t font-medium">
                      <span>Total Revenue:</span>
                      <span>${dashboardMetrics.revenue.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Platform Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Platform</th>
                          <th className="text-right py-2">Credits per $1</th>
                          <th className="text-right py-2">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {platforms.filter(p => p.enabled).map((platform) => {
                          const creditsPerDollar = platform.creditsNeeded / Math.max(0.01, platform.revenue);
                          // Normalize efficiency - lower is better
                          const maxCreditsPerDollar = Math.max(...platforms.filter(p => p.enabled).map(p => p.creditsNeeded / Math.max(0.01, p.revenue)));
                          const efficiency = 100 - ((creditsPerDollar / maxCreditsPerDollar) * 100);
                          
                          return (
                            <tr key={`eff-${platform.id}`} className="border-b last:border-0">
                              <td className="py-2">{platform.name}</td>
                              <td className="text-right py-2">{Math.round(creditsPerDollar).toLocaleString()}</td>
                              <td className="text-right py-2 flex items-center justify-end">
                                <span className={efficiency > 70 ? "text-success" : efficiency > 40 ? "text-primary" : "text-muted-foreground"}>
                                  {Math.round(efficiency)}%
                                </span>
                                <div className="w-12 h-1.5 bg-muted ml-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${efficiency > 70 ? "bg-success" : efficiency > 40 ? "bg-primary" : "bg-muted-foreground"}`} 
                                    style={{ width: `${efficiency}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
                
                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    Efficiency rating compares how many credits each platform requires to generate $1 in revenue. Higher efficiency means fewer credits needed.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-base font-medium">Optimization Tips</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <Percent className="h-5 w-5 text-blue-500 mt-0.5" />
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
                <Target className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Balance Platform Mix</p>
                  <p className="text-xs text-muted-foreground">
                    Distribute credits across platforms based on their efficiency to maximize overall ROI.
                  </p>
                </div>
              </div>
            </div>
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
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Save Calculation
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
