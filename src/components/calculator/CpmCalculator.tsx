
import { useState, useEffect } from 'react';
import { Calculator, Percent, DollarSign, HelpCircle, ExternalLink, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface CpmCalculatorProps {
  className?: string;
}

export default function CpmCalculator({ className }: CpmCalculatorProps) {
  // Platform CPM rates - adjusted to more realistic values
  const initialPlatformRates = {
    '9hits': 0.52,
    'hitleap': 0.49,
    'otohits': 0.45,
    'bighits4u': 0.53,
    'webhitnet': 0.48
  };

  const [visits, setVisits] = useState(1000);
  const [acceptanceRate, setAcceptanceRate] = useState(85);
  const [cpm, setCpm] = useState(0.5);
  const [platformRates, setPlatformRates] = useState(initialPlatformRates);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeOnSite, setTimeOnSite] = useState(30);
  
  // Calculate the results
  const acceptedVisits = Math.round(visits * (acceptanceRate / 100));
  const impressions = acceptedVisits;
  const revenue = (impressions * cpm) / 1000;
  
  // Calculate platform-specific results
  const calculatePlatformMetrics = (platform: string) => {
    const platformCpm = platformRates[platform as keyof typeof platformRates] || cpm;
    const platformRevenue = (impressions * platformCpm) / 1000;
    return {
      cpm: platformCpm,
      revenue: platformRevenue
    };
  };
  
  // Handle platform selection
  useEffect(() => {
    if (selectedPlatform !== 'all') {
      const platformCpm = platformRates[selectedPlatform as keyof typeof platformRates];
      if (platformCpm) {
        setCpm(platformCpm);
      }
    }
  }, [selectedPlatform]);
  
  // Handle platform CPM change
  const handlePlatformCpmChange = (platform: string, value: number) => {
    setPlatformRates(prev => ({
      ...prev,
      [platform]: value
    }));
    
    if (selectedPlatform === platform) {
      setCpm(value);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> 
              CPM Strategy Calculator
            </CardTitle>
            <CardDescription>
              Calculate potential revenue based on traffic and acceptance rate
            </CardDescription>
          </div>
          <Tabs defaultValue="all" value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="9hits">9Hits</TabsTrigger>
              <TabsTrigger value="hitleap">HitLeap</TabsTrigger>
              <TabsTrigger value="otohits">Otohits</TabsTrigger>
              <TabsTrigger value="bighits4u">BigHits4U</TabsTrigger>
              <TabsTrigger value="webhitnet">Webhit.net</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="visits">Daily Visits</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of visits your site receives daily</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="visits"
                  type="number"
                  min={1}
                  value={visits}
                  onChange={(e) => setVisits(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="acceptance-rate">Acceptance Rate (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of traffic accepted by ad networks</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{acceptanceRate}%</span>
                </div>
                <Slider
                  id="acceptance-rate"
                  min={0}
                  max={100}
                  step={1}
                  value={[acceptanceRate]}
                  onValueChange={(values) => setAcceptanceRate(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="time-on-site">Average Time on Site (seconds)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long visitors stay on your site on average</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{timeOnSite}s</span>
                </div>
                <Slider
                  id="time-on-site"
                  min={5}
                  max={120}
                  step={5}
                  value={[timeOnSite]}
                  onValueChange={(values) => setTimeOnSite(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="cpm">CPM Rate ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cost per 1000 impressions (typical range: $0.1 - $1.0)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cpm"
                  type="number"
                  min={0.1}
                  max={1.0}
                  step={0.01}
                  value={cpm}
                  onChange={(e) => setCpm(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Calculated Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Visits</p>
                    <p className="text-2xl font-bold">{visits.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Accepted Visits</p>
                    <p className="text-2xl font-bold">{acceptedVisits.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                    <p className="text-2xl font-bold">{impressions.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                    <p className="text-2xl font-bold text-green-500">${revenue.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                    <span className="text-sm font-medium">{acceptanceRate}%</span>
                  </div>
                  <div className="w-full bg-muted-foreground/20 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${acceptanceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Platform CPM Rates</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7"
                    onClick={() => setPlatformRates(initialPlatformRates)}
                  >
                    <Activity className="h-3.5 w-3.5 mr-1" />
                    Reset to Default
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(platformRates).map(([platform, rate]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="w-24 text-sm">{platform}</div>
                      <div className="flex-grow">
                        <Input
                          type="number"
                          min={0.1}
                          max={1.0}
                          step={0.01}
                          value={rate}
                          onChange={(e) => handlePlatformCpmChange(platform, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-16 text-right text-sm font-medium">
                        ${((impressions * rate) / 1000).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium">Optimization Tips</h3>
            
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
                <ExternalLink className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Connect to API</p>
                  <p className="text-xs text-muted-foreground">
                    Link to Adsterra and platform APIs to automatically fetch actual CPM rates and performance data.
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
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          Save Calculation
        </Button>
      </CardFooter>
    </Card>
  );
}
