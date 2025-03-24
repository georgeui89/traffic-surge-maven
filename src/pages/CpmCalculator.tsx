
import { useState } from 'react';
import { Calculator, CreditCard, Coins, DollarSign, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CpmCalculator = () => {
  const [impressions, setImpressions] = useState(10000);
  const [revenue, setRevenue] = useState(50);
  const [credits, setCredits] = useState(1000);
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [secondsPerVisit, setSecondsPerVisit] = useState(30);
  const [calculationType, setCalculationType] = useState('impressions-to-revenue');
  const [platform, setPlatform] = useState('9hits');
  
  const calculateCPM = () => {
    return (revenue / impressions) * 1000;
  };
  
  const calculateRevenue = () => {
    const validImpressions = (credits / secondsPerVisit) * (acceptanceRate / 100);
    return (validImpressions / 1000) * calculateCPM();
  };
  
  const calculateRequiredCredits = () => {
    const validImpressionsNeeded = impressions * (100 / acceptanceRate);
    return validImpressionsNeeded * secondsPerVisit;
  };
  
  // Calculate CPM value
  const cpm = calculateCPM().toFixed(2);
  const estimatedRevenue = calculateRevenue().toFixed(2);
  const requiredCredits = calculateRequiredCredits().toFixed(0);
  
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
                        <SelectItem value="bigHitsU">BigHits4U</SelectItem>
                        <SelectItem value="webhit">Webhit.net</SelectItem>
                      </SelectContent>
                    </Select>
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
                      
                      <div>
                        <Label htmlFor="cpm-value">CPM Rate ($)</Label>
                        <div className="relative mt-1.5">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cpm-value"
                            type="number"
                            className="pl-10"
                            value={cpm}
                            readOnly
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
                            className="pl-10"
                            value={revenue}
                            onChange={(e) => setRevenue(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </>
                  )}
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
                  
                  {calculationType === 'revenue-to-credits' && (
                    <div>
                      <Label htmlFor="cpm-value">CPM Rate ($)</Label>
                      <div className="relative mt-1.5">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cpm-value"
                          type="number"
                          className="pl-10"
                          value={cpm}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
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
              <CardTitle>CPM Rates by Platform</CardTitle>
              <CardDescription>
                Current average CPM rates for popular autosurf platforms
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 border-b">
                  <span>9Hits</span>
                  <span className="font-medium">$5.20</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <span>HitLeap</span>
                  <span className="font-medium">$4.90</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <span>Otohits</span>
                  <span className="font-medium">$4.50</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <span>BigHits4U</span>
                  <span className="font-medium">$5.30</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span>Webhit.net</span>
                  <span className="font-medium">$4.75</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-muted rounded-md border">
                <p className="text-sm text-muted-foreground">
                  CPM rates are averages based on recent performance data. Actual rates may vary depending on traffic quality, niche, and other factors.
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full">Update CPM Rates</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CpmCalculator;
