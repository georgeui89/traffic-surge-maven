
import { useState, useEffect } from 'react';
import { Server, DollarSign, Activity, TrendingUp, AlertTriangle, Info, Download, PieChart, BarChart, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';

const RdpScaler = () => {
  const [rdpCount, setRdpCount] = useState(3);
  const [costPerRdp, setCostPerRdp] = useState(5);
  const [visitsPerRdp, setVisitsPerRdp] = useState(5000);
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [cpmRate, setCpmRate] = useState(4.5);
  const [optimizationMode, setOptimizationMode] = useState('profit');
  const [provider, setProvider] = useState('aws');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [savedConfigurations, setSavedConfigurations] = useState<any[]>([]);
  const [configName, setConfigName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Calculated values
  const [totalCost, setTotalCost] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [isRentable, setIsRentable] = useState(false);
  const [optimizedRdpCount, setOptimizedRdpCount] = useState(3);
  
  // Advanced settings
  const [cpuUtilization, setCpuUtilization] = useState(70);
  const [sessionDuration, setSessionDuration] = useState(30);
  const [trafficQuality, setTrafficQuality] = useState('medium');
  const [useProxies, setUseProxies] = useState(false);
  
  // Provider specific costs
  const providerCosts = {
    aws: { base: 5, proxy: 2, scaling: 0.9 },
    digitalocean: { base: 4, proxy: 1.5, scaling: 0.85 },
    azure: { base: 6, proxy: 2.5, scaling: 0.95 },
    gcp: { base: 5.5, proxy: 2, scaling: 0.9 },
    other: { base: 5, proxy: 2, scaling: 1 }
  };
  
  useEffect(() => {
    calculateMetrics();
    loadSavedConfigurations();
  }, [rdpCount, costPerRdp, visitsPerRdp, acceptanceRate, cpmRate, provider, cpuUtilization, sessionDuration, trafficQuality, useProxies]);
  
  const calculateMetrics = () => {
    // Apply provider-specific costs
    const providerCost = providerCosts[provider];
    const adjustedCostPerRdp = useProxies 
      ? costPerRdp + providerCost.proxy 
      : costPerRdp;
    
    // Apply scaling factor based on number of RDPs (bulk discount)
    const scalingFactor = rdpCount > 5 ? providerCost.scaling : 1;
    const scaledCostPerRdp = adjustedCostPerRdp * scalingFactor;
    
    // Calculate total cost
    const cost = rdpCount * scaledCostPerRdp;
    setTotalCost(cost);
    
    // Adjust visits based on CPU utilization and session duration
    const utilizationFactor = cpuUtilization / 100;
    const durationImpact = sessionDuration > 20 ? (1 - (sessionDuration - 20) * 0.01) : 1;
    const adjustedVisitsPerRdp = visitsPerRdp * utilizationFactor * durationImpact;
    
    // Apply traffic quality modifier
    let qualityModifier = 1;
    if (trafficQuality === 'high') qualityModifier = 1.2;
    if (trafficQuality === 'low') qualityModifier = 0.8;
    
    // Calculate valid impressions
    const validImpressions = rdpCount * adjustedVisitsPerRdp * (acceptanceRate / 100) * qualityModifier;
    
    // Calculate revenue based on CPM
    const revenue = (validImpressions / 1000) * cpmRate;
    setTotalRevenue(revenue);
    
    // Calculate profit and ROI
    const calculatedProfit = revenue - cost;
    setProfit(calculatedProfit);
    
    const calculatedRoi = cost > 0 ? (calculatedProfit / cost) * 100 : 0;
    setRoi(calculatedRoi);
    
    // Determine if the operation is rentable
    setIsRentable(calculatedProfit > 0);
    
    // Calculate optimal RDP count based on optimization mode
    calculateOptimalRdpCount(scaledCostPerRdp, adjustedVisitsPerRdp, qualityModifier);
  };
  
  const calculateOptimalRdpCount = (scaledCostPerRdp: number, adjustedVisitsPerRdp: number, qualityModifier: number) => {
    const revenuePerRdp = (adjustedVisitsPerRdp * (acceptanceRate / 100) * qualityModifier / 1000) * cpmRate;
    
    if (optimizationMode === 'profit') {
      // Find the maximum profit point - more sophisticated algorithm
      if (revenuePerRdp > scaledCostPerRdp) {
        // Calculate marginal profit and find optimal point
        // For a simple model, we'll use a more realistic maximum based on provider limits
        // In a real system, this would involve more complex calculations
        const baseOptimal = Math.round((revenuePerRdp / scaledCostPerRdp) * 5);
        const maxRdps = provider === 'digitalocean' ? 15 : 20; // Example provider limits
        setOptimizedRdpCount(Math.min(baseOptimal, maxRdps));
      } else {
        setOptimizedRdpCount(0);
      }
    } else if (optimizationMode === 'roi') {
      // For ROI, we want the highest percentage return
      if (revenuePerRdp > scaledCostPerRdp) {
        // A simpler approach for ROI optimization is fewer RDPs but with better quality
        const ratio = revenuePerRdp / scaledCostPerRdp;
        // Adjust for diminishing returns
        const optimal = Math.max(1, Math.round(Math.log(ratio * 5) / Math.log(1.5)));
        setOptimizedRdpCount(optimal);
      } else {
        setOptimizedRdpCount(0);
      }
    }
  };
  
  const applyOptimizedRdpCount = () => {
    setRdpCount(optimizedRdpCount);
    toast({
      title: "Optimization Applied",
      description: `RDP count set to optimal value of ${optimizedRdpCount} for ${optimizationMode === 'profit' ? 'maximum profit' : 'maximum ROI'}.`,
      duration: 3000,
    });
  };
  
  const exportConfiguration = () => {
    const configuration = {
      rdpCount,
      costPerRdp,
      visitsPerRdp,
      acceptanceRate,
      cpmRate,
      optimizationMode,
      provider,
      advanced: {
        cpuUtilization,
        sessionDuration,
        trafficQuality,
        useProxies
      },
      results: {
        totalCost,
        totalRevenue,
        profit,
        roi
      },
      timestamp: new Date().toISOString()
    };
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(configuration, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rdp-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration Exported",
      description: "Your RDP configuration has been exported as JSON.",
      duration: 3000,
    });
  };
  
  const saveCurrentConfiguration = () => {
    if (!configName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for this configuration.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const newConfig = {
      id: Date.now().toString(),
      name: configName,
      rdpCount,
      costPerRdp,
      visitsPerRdp,
      acceptanceRate,
      cpmRate,
      optimizationMode,
      provider,
      advanced: {
        cpuUtilization,
        sessionDuration,
        trafficQuality,
        useProxies
      },
      timestamp: new Date().toISOString()
    };
    
    const updatedConfigs = [...savedConfigurations, newConfig];
    setSavedConfigurations(updatedConfigs);
    localStorage.setItem('rdpConfigurations', JSON.stringify(updatedConfigs));
    
    setConfigName('');
    toast({
      title: "Configuration Saved",
      description: `"${configName}" has been saved to your local configurations.`,
      duration: 3000,
    });
  };
  
  const loadConfiguration = (config) => {
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setRdpCount(config.rdpCount);
      setCostPerRdp(config.costPerRdp);
      setVisitsPerRdp(config.visitsPerRdp);
      setAcceptanceRate(config.acceptanceRate);
      setCpmRate(config.cpmRate);
      setOptimizationMode(config.optimizationMode);
      setProvider(config.provider);
      
      // Load advanced settings if available
      if (config.advanced) {
        setCpuUtilization(config.advanced.cpuUtilization);
        setSessionDuration(config.advanced.sessionDuration);
        setTrafficQuality(config.advanced.trafficQuality);
        setUseProxies(config.advanced.useProxies);
      }
      
      setIsLoading(false);
      toast({
        title: "Configuration Loaded",
        description: `"${config.name}" has been loaded successfully.`,
        duration: 3000,
      });
    }, 500);
  };
  
  const loadSavedConfigurations = () => {
    const savedConfigs = localStorage.getItem('rdpConfigurations');
    if (savedConfigs) {
      try {
        setSavedConfigurations(JSON.parse(savedConfigs));
      } catch (e) {
        console.error("Error loading saved configurations:", e);
        localStorage.removeItem('rdpConfigurations');
      }
    }
  };
  
  const deleteConfiguration = (configId) => {
    const updatedConfigs = savedConfigurations.filter(config => config.id !== configId);
    setSavedConfigurations(updatedConfigs);
    localStorage.setItem('rdpConfigurations', JSON.stringify(updatedConfigs));
    
    toast({
      title: "Configuration Deleted",
      description: "The configuration has been removed from your saved list.",
      duration: 3000,
    });
  };
  
  // Render pie chart data for visualization
  const renderPieChartData = () => {
    const costPercentage = (totalCost / (totalRevenue + 0.001)) * 100;
    const profitPercentage = 100 - costPercentage;
    
    return [
      { name: "Cost", value: totalCost > 0 ? totalCost : 0, color: "#ef4444" },
      { name: "Profit", value: profit > 0 ? profit : 0, color: "#22c55e" }
    ];
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">RDP Scaler</h1>
          <p className="page-description">Optimize your RDP resources for maximum profitability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportConfiguration}>
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>RDP Scaling Calculator</CardTitle>
              <CardDescription>
                Find the optimal number of RDP instances based on cost and revenue projections
              </CardDescription>
              <Tabs 
                defaultValue="profit" 
                value={optimizationMode}
                onValueChange={setOptimizationMode}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profit">Maximize Profit</TabsTrigger>
                  <TabsTrigger value="roi">Maximize ROI</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rdp-provider">RDP Provider</Label>
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger id="rdp-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon Web Services</SelectItem>
                        <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                        <SelectItem value="gcp">Google Cloud</SelectItem>
                        <SelectItem value="other">Other Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="rdp-count">Number of RDPs</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          value={rdpCount}
                          onChange={(e) => setRdpCount(parseInt(e.target.value) || 1)}
                          className="w-16 text-right"
                        />
                        <span className="text-sm text-muted-foreground">RDPs</span>
                      </div>
                    </div>
                    <Slider
                      id="rdp-count"
                      min={1}
                      max={50}
                      step={1}
                      value={[rdpCount]}
                      onValueChange={(value) => setRdpCount(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cost-per-rdp">Cost Per RDP ($/month)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cost-per-rdp"
                        type="number"
                        min="1"
                        step="0.5"
                        className="pl-10"
                        value={costPerRdp}
                        onChange={(e) => setCostPerRdp(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Advanced Settings</span>
                      <Switch 
                        checked={showAdvancedSettings} 
                        onCheckedChange={setShowAdvancedSettings}
                      />
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="visits-per-rdp">Visits Per RDP (monthly)</Label>
                    <div className="relative mt-1.5">
                      <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="visits-per-rdp"
                        type="number"
                        min="100"
                        step="100"
                        className="pl-10"
                        value={visitsPerRdp}
                        onChange={(e) => setVisitsPerRdp(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="acceptance-rate">Acceptance Rate</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={acceptanceRate}
                          onChange={(e) => setAcceptanceRate(parseInt(e.target.value) || 1)}
                          className="w-16 text-right"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <Slider
                      id="acceptance-rate"
                      min={10}
                      max={100}
                      step={1}
                      value={[acceptanceRate]}
                      onValueChange={(value) => setAcceptanceRate(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cpm-rate">CPM Rate ($)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cpm-rate"
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="pl-10"
                        value={cpmRate}
                        onChange={(e) => setCpmRate(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="config-name">Save Configuration</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={saveCurrentConfiguration}
                        disabled={!configName.trim()}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                    <div className="relative mt-1.5">
                      <Input
                        id="config-name"
                        placeholder="Enter configuration name"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {showAdvancedSettings && (
                <div className="border rounded-md p-4 bg-muted/10 space-y-4">
                  <h3 className="text-sm font-medium mb-2">Advanced Settings</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="cpu-utilization">CPU Utilization</Label>
                        <span className="text-sm text-muted-foreground">{cpuUtilization}%</span>
                      </div>
                      <Slider
                        id="cpu-utilization"
                        min={10}
                        max={100}
                        step={5}
                        value={[cpuUtilization]}
                        onValueChange={(value) => setCpuUtilization(value[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="session-duration">Session Duration</Label>
                        <span className="text-sm text-muted-foreground">{sessionDuration} sec</span>
                      </div>
                      <Slider
                        id="session-duration"
                        min={5}
                        max={60}
                        step={5}
                        value={[sessionDuration]}
                        onValueChange={(value) => setSessionDuration(value[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="traffic-quality">Traffic Quality</Label>
                      <Select value={trafficQuality} onValueChange={setTrafficQuality}>
                        <SelectTrigger id="traffic-quality">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="use-proxies" className="cursor-pointer">Use Proxies</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="use-proxies" 
                          checked={useProxies} 
                          onCheckedChange={setUseProxies}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Using proxies will increase cost but may improve acceptance rates
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {optimizedRdpCount !== rdpCount && (
                <Alert className="bg-success/10 border-success/20">
                  <Info className="h-4 w-4 text-success" />
                  <AlertTitle>Optimization Available</AlertTitle>
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      {optimizationMode === 'profit' 
                        ? 'We recommend adjusting your RDP count to maximize profit.' 
                        : 'Adjust your RDP count to optimize ROI.'}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={applyOptimizedRdpCount}
                      className="bg-success hover:bg-success/90 text-white"
                    >
                      Use {optimizedRdpCount} RDPs
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monthly Cost</p>
                    <p className="text-xl font-bold text-destructive">${totalCost.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expected Revenue</p>
                    <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Profit</p>
                    <p className={`text-xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      ${profit.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">ROI</p>
                    <p className={`text-xl font-bold ${roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {roi.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                {!isRentable && (
                  <Alert className="mt-4 bg-destructive/10 border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertTitle>Not Profitable</AlertTitle>
                    <AlertDescription>
                      This configuration isn't profitable. Try increasing visits per RDP, improving 
                      acceptance rate, reducing cost per RDP, or using the optimization button.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardFooter>
          </Card>
          
          {savedConfigurations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base font-medium">Saved Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedConfigurations.map((config) => (
                    <div 
                      key={config.id} 
                      className="flex items-center justify-between border rounded-md p-2"
                    >
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {config.rdpCount} RDPs, {config.provider.toUpperCase()}, 
                          {new Date(config.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => loadConfiguration(config)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Load"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteConfiguration(config.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-medium">RDP Performance Insights</CardTitle>
              <CardDescription>
                Best practices and optimization tips
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md border bg-muted/30">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Server className="h-4 w-4" /> RDP Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  For most autosurf platforms, a 1GB RAM / 1 vCPU instance is sufficient. Upgrade for multiple sessions.
                </p>
              </div>
              
              <div className="p-3 rounded-md border bg-muted/30">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4" /> Traffic Quality
                </h3>
                <p className="text-sm text-muted-foreground">
                  Higher time-on-site settings (30+ seconds) generally improve acceptance rates by 15-25%.
                </p>
              </div>
              
              <div className="p-3 rounded-md border bg-muted/30">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4" /> Cost Optimization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Consider reserved instances for long-term usage to reduce costs by 20-40%.
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Cost vs. Profit Breakdown</h3>
                <div className="h-[200px] border rounded-md p-4 flex items-center justify-center">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isRentable
                        ? `Profit: ${formatCurrency(profit)} (${(profit / (totalCost + profit) * 100).toFixed(0)}%)`
                        : 'This configuration is not profitable'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Typical Monthly Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AWS t2.small</span>
                    <span className="font-medium">8,000-12,000 visits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>DigitalOcean 2GB</span>
                    <span className="font-medium">9,000-14,000 visits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Google Cloud e2-small</span>
                    <span className="font-medium">7,000-11,000 visits</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full">View Detailed RDP Guide</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">RDP Estimator Calculation</CardTitle>
              <CardDescription>
                How we calculated your results
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Total Monthly Cost: {rdpCount} RDPs × ${costPerRdp}/month{useProxies ? ' + proxy costs' : ''} = ${totalCost.toFixed(2)}</p>
              <p>Total Monthly Visits: {rdpCount} × {visitsPerRdp.toLocaleString()} = {(rdpCount * visitsPerRdp).toLocaleString()}</p>
              <p>Estimated Impressions: {(rdpCount * visitsPerRdp).toLocaleString()} × {acceptanceRate}% = {(rdpCount * visitsPerRdp * (acceptanceRate / 100)).toLocaleString()}</p>
              <p>Estimated Revenue: {(rdpCount * visitsPerRdp * (acceptanceRate / 100)).toLocaleString()} impressions / 1000 × ${cpmRate} = ${totalRevenue.toFixed(2)}</p>
              <p>Monthly Profit: ${totalRevenue.toFixed(2)} - ${totalCost.toFixed(2)} = ${profit.toFixed(2)}</p>
              <p>Return on Investment: ${profit.toFixed(2)} ÷ ${totalCost.toFixed(2)} × 100% = {roi.toFixed(2)}%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RdpScaler;
