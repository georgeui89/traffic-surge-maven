
import { useState, useEffect } from 'react';
import { DollarSign, BarChart2, Zap, TrendingUp, Download, Calculator, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { platforms } from '@/utils/mockData';

const BudgetDistributionCard = ({ data }: { data: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Current Budget Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((platform, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${platform.color} mr-2`}></div>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(platform.budget)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={platform.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground w-8">{platform.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationCard = ({ onApply }: { onApply: () => void }) => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium">AI Budget Recommendation</CardTitle>
            <CardDescription>Based on performance analysis</CardDescription>
          </div>
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Zap className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Reallocate from HitLeap to 9Hits</span>
            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">+15% ROI</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Increase budget for Otohits</span>
            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">+8% Traffic</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Reduce EasyHits4U spend</span>
            <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">Low Quality</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 pt-3">
        <Button onClick={onApply} className="w-full">
          <Check className="h-4 w-4 mr-2" />
          Apply Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};

const BudgetOptimizer = () => {
  const [totalBudget, setTotalBudget] = useState(50);
  const [optimizationTarget, setOptimizationTarget] = useState('roi');
  const [autoAdjust, setAutoAdjust] = useState(false);
  const [platformAllocations, setPlatformAllocations] = useState<{[key: string]: number}>({});
  const [expectedResults, setExpectedResults] = useState({
    visits: 0,
    impressions: 0,
    revenue: 0,
    roi: 0
  });
  const { toast } = useToast();
  
  // Initialize platform allocations
  useEffect(() => {
    const initialAllocations: {[key: string]: number} = {};
    platforms.slice(0, 5).forEach((platform, index) => {
      initialAllocations[platform.id] = [35, 25, 20, 10, 10][index];
    });
    setPlatformAllocations(initialAllocations);
  }, []);
  
  // Mock data for budget distribution based on current allocations
  const budgetData = Object.keys(platformAllocations).map((platformId, index) => {
    const platform = platforms.find(p => p.id === platformId) || platforms[index];
    const percentage = platformAllocations[platformId] || 0;
    return {
      name: platform.name,
      budget: totalBudget * percentage / 100,
      percentage,
      color: ['traffic', 'platforms', 'earnings', 'primary', 'muted-foreground'][index % 5]
    };
  });
  
  // Update expected results when budget or allocations change
  useEffect(() => {
    // Calculate based on current budget and allocations
    const expectedDailyVisits = totalBudget * 200; // 200 visits per $1
    const expectedDailyImpressions = expectedDailyVisits * 0.4; // 40% acceptance rate
    const expectedDailyRevenue = expectedDailyImpressions * 0.005; // $0.005 per impression
    const expectedROI = ((expectedDailyRevenue - totalBudget) / totalBudget) * 100;
    
    setExpectedResults({
      visits: expectedDailyVisits,
      impressions: expectedDailyImpressions,
      revenue: expectedDailyRevenue,
      roi: expectedROI
    });
  }, [totalBudget, platformAllocations]);
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalBudget(value);
    }
  };
  
  const handleAllocationChange = (platformId: string, value: number[]) => {
    const newAllocations = { ...platformAllocations, [platformId]: value[0] };
    setPlatformAllocations(newAllocations);
  };
  
  const handleOptimize = () => {
    // Simulate budget optimization
    const optimizedAllocations = { ...platformAllocations };
    
    if (optimizationTarget === 'roi') {
      // Adjust for ROI - increase allocations for high ROI platforms
      optimizedAllocations[platforms[0].id] = 40; // 9Hits
      optimizedAllocations[platforms[1].id] = 20; // HitLeap
      optimizedAllocations[platforms[2].id] = 25; // Otohits
      optimizedAllocations[platforms[3].id] = 5;  // EasyHits4U
      optimizedAllocations[platforms[4].id] = 10; // Others
    } else if (optimizationTarget === 'traffic') {
      // Adjust for traffic - increase allocations for high traffic platforms
      optimizedAllocations[platforms[0].id] = 35; // 9Hits
      optimizedAllocations[platforms[1].id] = 30; // HitLeap 
      optimizedAllocations[platforms[2].id] = 15; // Otohits
      optimizedAllocations[platforms[3].id] = 10; // EasyHits4U
      optimizedAllocations[platforms[4].id] = 10; // Others
    }
    
    setPlatformAllocations(optimizedAllocations);
    
    toast({
      title: "Budget Optimized",
      description: `Budget has been optimized for maximum ${optimizationTarget === 'roi' ? 'ROI' : 'traffic'}.`,
      duration: 3000,
    });
  };
  
  const handleRecommendationApply = () => {
    // Apply the AI recommendations
    const recommendedAllocations = { ...platformAllocations };
    recommendedAllocations[platforms[0].id] = 45; // 9Hits (increase)
    recommendedAllocations[platforms[1].id] = 15; // HitLeap (decrease)
    recommendedAllocations[platforms[2].id] = 25; // Otohits (increase)
    recommendedAllocations[platforms[3].id] = 5;  // EasyHits4U (decrease)
    recommendedAllocations[platforms[4].id] = 10; // Others (unchanged)
    
    setPlatformAllocations(recommendedAllocations);
    
    toast({
      title: "Recommendations Applied",
      description: "Budget allocations have been updated based on AI recommendations.",
      duration: 3000,
    });
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Optimizer</h1>
          <p className="page-description">Optimize budget allocation across platforms for maximum ROI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            ROI Calculator
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Budget Allocation Optimizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="w-full sm:w-1/2">
                    <Label htmlFor="total-budget" className="mb-2 block">Daily Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="total-budget"
                        type="number" 
                        value={totalBudget} 
                        onChange={handleBudgetChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-1/2">
                    <Label htmlFor="optimization-target" className="mb-2 block">Optimization Target</Label>
                    <Select value={optimizationTarget} onValueChange={setOptimizationTarget}>
                      <SelectTrigger id="optimization-target">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roi">Maximum ROI</SelectItem>
                        <SelectItem value="traffic">Maximum Traffic</SelectItem>
                        <SelectItem value="impressions">Maximum Impressions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-adjust"
                    checked={autoAdjust}
                    onCheckedChange={setAutoAdjust}
                  />
                  <Label htmlFor="auto-adjust">
                    Auto-adjust budget based on real-time performance
                  </Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <h3 className="text-sm font-medium">Platform Allocations</h3>
                
                {platforms.slice(0, 5).map((platform, index) => (
                  <div key={platform.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`platform-${platform.id}`} className="text-sm">{platform.name}</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(totalBudget * (platformAllocations[platform.id] || 0) / 100)}
                      </span>
                    </div>
                    <Slider
                      id={`platform-${platform.id}`}
                      value={[platformAllocations[platform.id] || 0]}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleAllocationChange(platform.id, value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleOptimize} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Optimize Budget Allocation
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-muted/10">
            <CardHeader>
              <CardTitle className="text-base font-medium">Expected Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-traffic mr-2" />
                    <span className="text-sm">Daily Visits</span>
                  </div>
                  <span className="font-medium">{formatNumber(expectedResults.visits)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 text-platforms mr-2" />
                    <span className="text-sm">Daily Impressions</span>
                  </div>
                  <span className="font-medium">{formatNumber(expectedResults.impressions)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-earnings mr-2" />
                    <span className="text-sm">Daily Revenue</span>
                  </div>
                  <span className="font-medium">{formatCurrency(expectedResults.revenue)}</span>
                </div>
              </div>
              
              <div className={cn(
                "bg-background rounded-md p-3 border",
                expectedResults.roi > 0 ? "border-success/30" : "border-destructive/30"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className={cn(
                      "h-4 w-4 mr-2",
                      expectedResults.roi > 0 ? "text-success" : "text-destructive"
                    )} />
                    <span className="text-sm">Expected ROI</span>
                  </div>
                  <span className={cn(
                    "font-medium",
                    expectedResults.roi > 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatPercent(expectedResults.roi, 1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <BudgetDistributionCard data={budgetData} />
          
          <RecommendationCard onApply={handleRecommendationApply} />
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizer;
