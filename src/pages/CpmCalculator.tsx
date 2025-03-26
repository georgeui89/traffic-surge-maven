
import { useState, useEffect } from 'react';
import { Calculator, CreditCard, Coins, DollarSign, ArrowRight, Zap, Info, BarChart2, Save, Settings } from 'lucide-react';
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

interface PlatformRate {
  name: string;
  rate: number;
  lastUpdated: string;
}

const CpmCalculator = () => {
  const { toast } = useToast();
  const [impressions, setImpressions] = useState(10000);
  const [revenue, setRevenue] = useState(50);
  const [credits, setCredits] = useState(1000);
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [secondsPerVisit, setSecondsPerVisit] = useState(30);
  const [calculationType, setCalculationType] = useState('impressions-to-revenue');
  const [platform, setPlatform] = useState('9hits');
  const [customCpmRate, setCustomCpmRate] = useState("5.20");
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Default platform rates
  const [platformRates, setPlatformRates] = useState<PlatformRate[]>([
    { name: '9Hits', rate: 5.20, lastUpdated: '2024-03-25' },
    { name: 'HitLeap', rate: 4.90, lastUpdated: '2024-03-24' },
    { name: 'Otohits', rate: 4.50, lastUpdated: '2024-03-24' },
    { name: 'BigHits4U', rate: 5.30, lastUpdated: '2024-03-23' },
    { name: 'Webhit.net', rate: 4.75, lastUpdated: '2024-03-22' },
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
              <CardTitle>CPM Strategy Calculator</CardTitle>
              <CardDescription>
                Optimize your traffic strategy by estimating revenue and required credits
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs 
                defaultValue="impressions-to-revenue" 
                value={calculationType}
                onValueChange={setCalculationType}
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
                  
                  {calculationType === 'impressions-to-revenue' ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  
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
                      {calculationType === 'impressions-to-revenue' 
                        ? "These settings help estimate how many of your credits will convert to valid impressions, impacting revenue."
                        : "These settings determine how many credits you'll need to achieve your impression and revenue targets."}
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
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calculationType === 'impressions-to-revenue' ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Required Credits</p>
                        <p className="text-2xl font-bold">{requiredCredits}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Target Revenue</p>
                        <p className="text-2xl font-bold text-success">${revenue}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
                    <span>{platform.name}</span>
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
