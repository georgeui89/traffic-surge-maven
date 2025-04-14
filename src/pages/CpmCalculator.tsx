
import { useState, useEffect } from 'react';
import { Calculator, CreditCard, Coins, DollarSign, ArrowRight, Zap, Info, BarChart2, Save, Settings, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PlatformRate {
  name: string;
  rate: number;
  lastUpdated: string;
  selected?: boolean;
  costPerVisit?: number;
  acceptanceRate?: number;
}

const CpmCalculator = () => {
  const { toast } = useToast();
  const [calculatorMode, setCalculatorMode] = useState('single');
  
  // Single platform mode states
  const [impressions, setImpressions] = useState(10000);
  const [revenue, setRevenue] = useState(50);
  const [credits, setCredits] = useState(1000);
  const [platform, setPlatform] = useState('9hits');
  const [customCpmRate, setCustomCpmRate] = useState("5.20");
  const [useCustomRate, setUseCustomRate] = useState(false);
  
  // Multi platform mode states
  const [totalTargetRevenue, setTotalTargetRevenue] = useState(100);
  const [optimizerResults, setOptimizerResults] = useState<{
    totalCredits: number;
    platforms: {
      name: string;
      recommendedRevenue: number;
      requiredCredits: number;
      cpm: number;
    }[];
  } | null>(null);
  
  // Shared states
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [secondsPerVisit, setSecondsPerVisit] = useState(30);
  const [saving, setSaving] = useState(false);
  
  // Default platform rates
  const [platformRates, setPlatformRates] = useState<PlatformRate[]>([
    { name: '9Hits', rate: 5.20, lastUpdated: '2024-03-25', selected: true, costPerVisit: 0.0002, acceptanceRate: 85 },
    { name: 'HitLeap', rate: 4.90, lastUpdated: '2024-03-24', selected: false, costPerVisit: 0.00015, acceptanceRate: 70 },
    { name: 'Otohits', rate: 4.50, lastUpdated: '2024-03-24', selected: false, costPerVisit: 0.00025, acceptanceRate: 90 },
    { name: 'BigHits4U', rate: 5.30, lastUpdated: '2024-03-23', selected: false, costPerVisit: 0.0003, acceptanceRate: 80 },
    { name: 'Webhit.net', rate: 4.75, lastUpdated: '2024-03-22', selected: false, costPerVisit: 0.00018, acceptanceRate: 75 },
  ]);
  
  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState({
    trafficQuality: 'medium',
    refreshRate: '30',
    connectionType: 'all',
    geoTargeting: false,
    customRate: false,
  });
  
  // Get current platform rate
  const getCurrentRate = () => {
    if (useCustomRate) {
      return parseFloat(customCpmRate);
    } else {
      const platformInfo = platformRates.find(p => p.name.toLowerCase() === platform);
      return platformInfo ? platformInfo.rate : 5.0;
    }
  };
  
  const calculateCPM = () => {
    return (revenue / impressions) * 1000;
  };
  
  const calculateRevenue = () => {
    const validImpressions = (credits / secondsPerVisit) * (acceptanceRate / 100);
    return (validImpressions / 1000) * getCurrentRate();
  };
  
  const calculateRequiredCredits = () => {
    const validImpressionsNeeded = impressions * (100 / acceptanceRate);
    return validImpressionsNeeded * secondsPerVisit;
  };
  
  const calculateOptimizedDistribution = () => {
    // Get selected platforms
    const selectedPlatforms = platformRates.filter(p => p.selected);
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform for optimization.",
        duration: 3000,
      });
      return;
    }
    
    // Sort platforms by efficiency (best CPM/costPerVisit ratio)
    const sortedPlatforms = [...selectedPlatforms].sort((a, b) => {
      const efficiencyA = a.rate / (a.costPerVisit || 0.0002);
      const efficiencyB = b.rate / (b.costPerVisit || 0.0002);
      return efficiencyB - efficiencyA; // Sort descending (best first)
    });
    
    // Calculate credits needed per $1 of revenue for each platform
    const platformEfficiency = sortedPlatforms.map(p => {
      const platformCpm = p.rate;
      const costPerVisit = p.costPerVisit || 0.0002;
      const platformAcceptanceRate = p.acceptanceRate || acceptanceRate;
      
      // Credits needed per $1 revenue
      const impressionsNeeded = 1000 / platformCpm; // Impressions needed for $1
      const visitsNeeded = impressionsNeeded / (platformAcceptanceRate / 100);
      const creditsNeeded = visitsNeeded * secondsPerVisit;
      
      return {
        name: p.name,
        creditsPerDollar: creditsNeeded,
        cpm: platformCpm,
      };
    });
    
    // Distribute revenue to minimize total credits
    let remainingRevenue = totalTargetRevenue;
    let totalCredits = 0;
    const distribution = platformEfficiency.map(p => {
      // For simplicity in this MVP, allocate revenue proportionally based on efficiency
      // A more complex algorithm would optimize this further
      const revenueShare = remainingRevenue * (1 / platformEfficiency.length);
      const creditsRequired = revenueShare * p.creditsPerDollar;
      
      remainingRevenue -= revenueShare;
      totalCredits += creditsRequired;
      
      return {
        name: p.name,
        recommendedRevenue: revenueShare,
        requiredCredits: creditsRequired,
        cpm: p.cpm,
      };
    });
    
    setOptimizerResults({
      totalCredits,
      platforms: distribution,
    });
  };
  
  const saveCpmRates = () => {
    setSaving(true);
    // Simulate API call to save rates
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "CPM Rates Updated",
        description: "Your custom CPM rates have been saved successfully.",
        duration: 3000,
      });
    }, 1500);
  };
  
  const updatePlatformRate = (platform: string, newRate: number) => {
    setPlatformRates(prev => prev.map(p => 
      p.name.toLowerCase() === platform.toLowerCase() 
        ? { ...p, rate: newRate, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    toast({
      title: "Rate Updated",
      description: `${platform} CPM rate updated to $${newRate.toFixed(2)}.`,
      duration: 3000,
    });
  };
  
  const togglePlatformSelection = (platformName: string) => {
    setPlatformRates(prev => prev.map(p => 
      p.name === platformName
        ? { ...p, selected: !p.selected }
        : p
    ));
  };
  
  // Calculate CPM value
  const cpm = useCustomRate ? parseFloat(customCpmRate) : calculateCPM();
  const estimatedRevenue = calculateRevenue().toFixed(2);
  const requiredCredits = calculateRequiredCredits().toFixed(0);
  
  // Update custom rate when platform changes
  useEffect(() => {
    if (!useCustomRate) {
      const platformInfo = platformRates.find(p => p.name.toLowerCase() === platform);
      if (platformInfo) {
        setCustomCpmRate(platformInfo.rate.toFixed(2));
      }
    }
  }, [platform, platformRates, useCustomRate]);
  
  // Run optimizer when relevant inputs change in multi-platform mode
  useEffect(() => {
    if (calculatorMode === 'multi') {
      calculateOptimizedDistribution();
    }
  }, [calculatorMode, totalTargetRevenue, acceptanceRate, secondsPerVisit, platformRates.filter(p => p.selected).length]);
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">CPM Calculator</h1>
        <p className="page-description">Calculate earnings, credits needed, and optimize your traffic strategy</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" /> 
                    CPM Strategy Calculator
                  </CardTitle>
                  <CardDescription>
                    Optimize your traffic strategy by estimating revenue and required credits
                  </CardDescription>
                </div>
                
                <Tabs 
                  value={calculatorMode} 
                  onValueChange={setCalculatorMode} 
                  className="w-auto"
                >
                  <TabsList>
                    <TabsTrigger value="single">
                      Single Platform
                    </TabsTrigger>
                    <TabsTrigger value="multi">
                      Multi-Platform Optimizer
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {calculatorMode === 'single' ? (
                <>
                  <Tabs 
                    defaultValue="impressions-to-revenue" 
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="impressions-to-revenue">Calculate Revenue</TabsTrigger>
                      <TabsTrigger value="revenue-to-credits">Calculate Credits</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="platform">Select Platform</Label>
                        <Select value={platform} onValueChange={setPlatform}>
                          <SelectTrigger id="platform">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9hits">9Hits</SelectItem>
                            <SelectItem value="hitleap">HitLeap</SelectItem>
                            <SelectItem value="otohits">Otohits</SelectItem>
                            <SelectItem value="bighits4u">BigHits4U</SelectItem>
                            <SelectItem value="webhit">Webhit.net</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="cpm-rate-input" className="text-sm">CPM Rate ($)</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="use-custom-rate"
                            checked={useCustomRate}
                            onCheckedChange={setUseCustomRate}
                          />
                          <Label htmlFor="use-custom-rate" className="text-xs">Custom Rate</Label>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cpm-rate-input"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="10.00"
                          className="pl-10"
                          value={customCpmRate}
                          onChange={(e) => setCustomCpmRate(e.target.value)}
                          disabled={!useCustomRate}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="credits">Available Credits</Label>
                        <div className="relative mt-1.5">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="credits"
                            type="number"
                            className="pl-10"
                            value={credits}
                            onChange={(e) => setCredits(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="impressions">Target Impressions</Label>
                        <div className="relative mt-1.5">
                          <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="impressions"
                            type="number"
                            className="pl-10"
                            value={impressions}
                            onChange={(e) => setImpressions(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="revenue">Expected Revenue ($)</Label>
                        <div className="relative mt-1.5">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="revenue"
                            type="number"
                            step="0.01"
                            className="pl-10"
                            value={revenue}
                            onChange={(e) => setRevenue(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Settings className="h-4 w-4" />
                            Advanced Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Advanced CPM Settings</DialogTitle>
                            <DialogDescription>
                              Fine-tune your CPM calculation with advanced parameters
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="traffic-quality">Traffic Quality</Label>
                              <Select 
                                value={advancedSettings.trafficQuality} 
                                onValueChange={(value) => setAdvancedSettings({...advancedSettings, trafficQuality: value})}
                              >
                                <SelectTrigger id="traffic-quality">
                                  <SelectValue placeholder="Select traffic quality" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low (0.6x multiplier)</SelectItem>
                                  <SelectItem value="medium">Medium (1.0x multiplier)</SelectItem>
                                  <SelectItem value="high">High (1.4x multiplier)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="refresh-rate">Page Refresh Rate</Label>
                              <Select 
                                value={advancedSettings.refreshRate} 
                                onValueChange={(value) => setAdvancedSettings({...advancedSettings, refreshRate: value})}
                              >
                                <SelectTrigger id="refresh-rate">
                                  <SelectValue placeholder="Select refresh rate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="20">Fast (20 seconds)</SelectItem>
                                  <SelectItem value="30">Medium (30 seconds)</SelectItem>
                                  <SelectItem value="60">Slow (60 seconds)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="connection-type">Connection Type</Label>
                              <Select 
                                value={advancedSettings.connectionType} 
                                onValueChange={(value) => setAdvancedSettings({...advancedSettings, connectionType: value})}
                              >
                                <SelectTrigger id="connection-type">
                                  <SelectValue placeholder="Select connection type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mobile">Mobile Only</SelectItem>
                                  <SelectItem value="desktop">Desktop Only</SelectItem>
                                  <SelectItem value="all">All Connections</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="geo-targeting">Enable Geo-Targeting</Label>
                              <Switch 
                                id="geo-targeting"
                                checked={advancedSettings.geoTargeting}
                                onCheckedChange={(checked) => setAdvancedSettings({...advancedSettings, geoTargeting: checked})}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button type="submit">Apply Settings</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="seconds-per-visit">Seconds Per Visit</Label>
                          <span className="text-sm text-muted-foreground">{secondsPerVisit}s</span>
                        </div>
                        <Slider
                          id="seconds-per-visit"
                          min={5}
                          max={60}
                          step={1}
                          value={[secondsPerVisit]}
                          onValueChange={(value) => setSecondsPerVisit(value[0])}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="acceptance-rate">Acceptance Rate</Label>
                          <span className="text-sm text-muted-foreground">{acceptanceRate}%</span>
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
                      </div>
                      
                      <Alert className="bg-primary/5 border-primary/20">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          These settings help estimate how many of your credits will convert to valid impressions, impacting revenue.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-3 rounded-md border border-border bg-muted/30">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Calculation Summary
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex justify-between">
                            <span>Platform:</span>
                            <span className="font-medium">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>CPM Rate:</span>
                            <span className="font-medium">${getCurrentRate().toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Visit Duration:</span>
                            <span className="font-medium">{secondsPerVisit}s</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Acceptance:</span>
                            <span className="font-medium">{acceptanceRate}%</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Expected Valid Impressions</p>
                        <p className="text-2xl font-bold">
                          {((credits / secondsPerVisit) * (acceptanceRate / 100)).toFixed(0)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Estimated Revenue</p>
                        <p className="text-2xl font-bold text-success">${estimatedRevenue}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Multi-Platform Optimizer Mode
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Select Platforms for Optimization</Label>
                        <div className="grid gap-2 border rounded-md p-3">
                          {platformRates.map((platform) => (
                            <div key={platform.name} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`platform-${platform.name.toLowerCase()}`}
                                checked={platform.selected}
                                onCheckedChange={() => togglePlatformSelection(platform.name)}
                              />
                              <Label 
                                htmlFor={`platform-${platform.name.toLowerCase()}`}
                                className="flex-1 cursor-pointer"
                              >
                                {platform.name}
                              </Label>
                              <span className="text-xs text-muted-foreground">
                                ${platform.rate.toFixed(2)} CPM
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="target-revenue">Total Target Revenue ($)</Label>
                        <div className="relative mt-1.5">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="target-revenue"
                            type="number"
                            step="1"
                            min="1"
                            className="pl-10"
                            value={totalTargetRevenue}
                            onChange={(e) => setTotalTargetRevenue(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Settings className="h-4 w-4" />
                            Global Advanced Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Global Advanced Settings</DialogTitle>
                            <DialogDescription>
                              Apply these settings to all selected platforms
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="traffic-quality">Traffic Quality</Label>
                              <Select 
                                value={advancedSettings.trafficQuality} 
                                onValueChange={(value) => setAdvancedSettings({...advancedSettings, trafficQuality: value})}
                              >
                                <SelectTrigger id="traffic-quality">
                                  <SelectValue placeholder="Select traffic quality" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low (0.6x multiplier)</SelectItem>
                                  <SelectItem value="medium">Medium (1.0x multiplier)</SelectItem>
                                  <SelectItem value="high">High (1.4x multiplier)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="connection-type">Connection Type</Label>
                              <Select 
                                value={advancedSettings.connectionType} 
                                onValueChange={(value) => setAdvancedSettings({...advancedSettings, connectionType: value})}
                              >
                                <SelectTrigger id="connection-type">
                                  <SelectValue placeholder="Select connection type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mobile">Mobile Only</SelectItem>
                                  <SelectItem value="desktop">Desktop Only</SelectItem>
                                  <SelectItem value="all">All Connections</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="geo-targeting">Enable Geo-Targeting</Label>
                              <Switch 
                                id="geo-targeting"
                                checked={advancedSettings.geoTargeting}
                                onCheckedChange={(checked) => setAdvancedSettings({...advancedSettings, geoTargeting: checked})}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button onClick={() => calculateOptimizedDistribution()}>
                              Apply to All Platforms
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="seconds-per-visit">Seconds Per Visit (Global)</Label>
                          <span className="text-sm text-muted-foreground">{secondsPerVisit}s</span>
                        </div>
                        <Slider
                          id="seconds-per-visit"
                          min={5}
                          max={60}
                          step={1}
                          value={[secondsPerVisit]}
                          onValueChange={(value) => setSecondsPerVisit(value[0])}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="acceptance-rate">Default Acceptance Rate</Label>
                          <span className="text-sm text-muted-foreground">{acceptanceRate}%</span>
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
                        <p className="text-xs text-muted-foreground mt-1">
                          This is used when platform-specific acceptance rates are not available
                        </p>
                      </div>
                      
                      <Alert className="bg-primary/5 border-primary/20">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          The multi-platform optimizer will distribute your target revenue across selected platforms to minimize the total credits required.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-3 rounded-md border border-border bg-muted/30">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Optimization Summary
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex justify-between">
                            <span>Platforms Selected:</span>
                            <span className="font-medium">{platformRates.filter(p => p.selected).length}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Target Revenue:</span>
                            <span className="font-medium">${totalTargetRevenue}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Global Visit Duration:</span>
                            <span className="font-medium">{secondsPerVisit}s</span>
                          </li>
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={calculateOptimizedDistribution}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Optimize Distribution
                      </Button>
                    </div>
                  </div>
                  
                  {optimizerResults && (
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">Optimization Results</h3>
                        <Badge variant="outline" className="bg-green-50">
                          Credit-Optimized
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">Target Revenue</p>
                          <p className="text-xl font-bold">${totalTargetRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">Total Required Credits</p>
                          <p className="text-xl font-bold">{Math.round(optimizerResults.totalCredits).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead className="text-right">CPM</TableHead>
                            <TableHead className="text-right">Recommended Revenue</TableHead>
                            <TableHead className="text-right">Required Credits</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {optimizerResults.platforms.map((platform) => (
                            <TableRow key={platform.name}>
                              <TableCell className="font-medium">{platform.name}</TableCell>
                              <TableCell className="text-right">${platform.cpm.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${platform.recommendedRevenue.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{Math.round(platform.requiredCredits).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <p className="text-sm text-muted-foreground w-full text-center">
                {calculatorMode === 'single' 
                  ? "Results are estimates based on the provided inputs." 
                  : "This optimizer provides a credit-efficient strategy to achieve your revenue target."}
              </p>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>CPM Rates by Platform</CardTitle>
                  <CardDescription>
                    Current average CPM rates for popular autosurf platforms
                  </CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">CPM Rate History</h3>
                      <p className="text-xs text-muted-foreground">
                        Rates fluctuate based on market conditions. Current rates shown below represent 7-day averages.
                      </p>
                      <div className="h-[150px] bg-muted/50 rounded-md border flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Rate trend visualization</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {platformRates.map((platform) => (
                  <div key={platform.name} className="flex justify-between items-center p-2 border-b">
                    <span className="flex items-center gap-1">
                      {platform.selected && calculatorMode === 'multi' && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                      {platform.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="10.00"
                        value={platform.rate}
                        onChange={(e) => updatePlatformRate(platform.name, parseFloat(e.target.value))}
                        className="w-16 h-7 text-sm"
                        id={`rate-input-${platform.name.toLowerCase()}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-muted rounded-md border">
                <p className="text-sm text-muted-foreground">
                  CPM rates are based on recent performance data. Actual rates may vary depending on traffic quality, niche, and other factors.
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={saveCpmRates}
                id="update-cpm-rates"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Custom Rates
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CpmCalculator;
