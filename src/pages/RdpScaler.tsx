
import { useState, useEffect } from 'react';
import { Server, DollarSign, Activity, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RdpScaler = () => {
  const [rdpCount, setRdpCount] = useState(3);
  const [costPerRdp, setCostPerRdp] = useState(5);
  const [visitsPerRdp, setVisitsPerRdp] = useState(5000);
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [cpmRate, setCpmRate] = useState(4.5);
  const [optimizationMode, setOptimizationMode] = useState('profit');
  const [provider, setProvider] = useState('aws');
  
  // Calculated values
  const [totalCost, setTotalCost] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [isRentable, setIsRentable] = useState(false);
  const [optimizedRdpCount, setOptimizedRdpCount] = useState(3);
  
  useEffect(() => {
    calculateMetrics();
  }, [rdpCount, costPerRdp, visitsPerRdp, acceptanceRate, cpmRate]);
  
  const calculateMetrics = () => {
    // Calculate total cost
    const cost = rdpCount * costPerRdp;
    setTotalCost(cost);
    
    // Calculate valid impressions
    const validImpressions = rdpCount * visitsPerRdp * (acceptanceRate / 100);
    
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
    calculateOptimalRdpCount();
  };
  
  const calculateOptimalRdpCount = () => {
    // Simple optimization logic
    const revenuePerRdp = (visitsPerRdp * (acceptanceRate / 100) / 1000) * cpmRate;
    
    if (optimizationMode === 'profit') {
      // Find the maximum profit point (assuming linear relationship)
      if (revenuePerRdp > costPerRdp) {
        // Limit to a reasonable number for UI display
        setOptimizedRdpCount(10);
      } else {
        setOptimizedRdpCount(0);
      }
    } else if (optimizationMode === 'roi') {
      // For ROI, the optimal is usually fewer RDPs if the margin is thin
      if (revenuePerRdp > costPerRdp) {
        const ratio = revenuePerRdp / costPerRdp;
        // Adjust based on ROI preference
        setOptimizedRdpCount(Math.max(1, Math.round(ratio * 2)));
      } else {
        setOptimizedRdpCount(0);
      }
    }
  };
  
  const applyOptimizedRdpCount = () => {
    setRdpCount(optimizedRdpCount);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">RDP Scaler</h1>
        <p className="page-description">Optimize your RDP resources for maximum profitability</p>
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
                    <div className="flex justify-between">
                      <Label htmlFor="rdp-count">Number of RDPs</Label>
                      <span className="text-sm text-muted-foreground">{rdpCount}</span>
                    </div>
                    <Slider
                      id="rdp-count"
                      min={1}
                      max={20}
                      step={1}
                      value={[rdpCount]}
                      onValueChange={(value) => setRdpCount(value[0])}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cost-per-rdp">Cost Per RDP ($/month)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cost-per-rdp"
                        type="number"
                        className="pl-10"
                        value={costPerRdp}
                        onChange={(e) => setCostPerRdp(Number(e.target.value))}
                      />
                    </div>
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
                        className="pl-10"
                        value={visitsPerRdp}
                        onChange={(e) => setVisitsPerRdp(Number(e.target.value))}
                      />
                    </div>
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
                  
                  <div>
                    <Label htmlFor="cpm-rate">CPM Rate ($)</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cpm-rate"
                        type="number"
                        className="pl-10"
                        value={cpmRate}
                        onChange={(e) => setCpmRate(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {optimizedRdpCount !== rdpCount && (
                <Alert className="bg-success/10 border-success/20">
                  <Info className="h-4 w-4 text-success" />
                  <AlertTitle>Optimization Available</AlertTitle>
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      {optimizationMode === 'profit' 
                        ? 'We recommend using more RDPs to maximize profit.' 
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
                <div className="grid grid-cols-2 gap-4">
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
                      acceptance rate, or reducing cost per RDP.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>RDP Performance Insights</CardTitle>
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
        </div>
      </div>
    </div>
  );
};

export default RdpScaler;
