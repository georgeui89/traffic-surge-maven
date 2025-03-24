
import { useState } from 'react';
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

const RecommendationCard = () => {
  const { toast } = useToast();
  
  const handleApply = () => {
    toast({
      title: "Recommendations Applied",
      description: "Budget allocations have been updated based on AI recommendations.",
      duration: 3000,
    });
  };
  
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
        <Button onClick={handleApply} className="w-full">
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
  const { toast } = useToast();
  
  // Mock data for budget distribution
  const budgetData = [
    { name: '9Hits', budget: totalBudget * 0.35, percentage: 35, color: 'traffic' },
    { name: 'HitLeap', budget: totalBudget * 0.25, percentage: 25, color: 'platforms' },
    { name: 'Otohits', budget: totalBudget * 0.20, percentage: 20, color: 'earnings' },
    { name: 'EasyHits4U', budget: totalBudget * 0.10, percentage: 10, color: 'primary' },
    { name: 'Others', budget: totalBudget * 0.10, percentage: 10, color: 'muted-foreground' },
  ];
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalBudget(value);
    }
  };
  
  const handleOptimize = () => {
    toast({
      title: "Budget Optimized",
      description: `Budget has been optimized for maximum ${optimizationTarget === 'roi' ? 'ROI' : 'traffic'}.`,
      duration: 3000,
    });
  };
  
  // Calculate expected results
  const expectedDailyVisits = totalBudget * 200; // 200 visits per $1
  const expectedDailyImpressions = expectedDailyVisits * 0.4; // 40% acceptance rate
  const expectedDailyRevenue = expectedDailyImpressions * 0.005; // $0.005 per impression
  const expectedROI = ((expectedDailyRevenue - totalBudget) / totalBudget) * 100;
  
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
                
                {platforms.slice(0, 6).map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`platform-${index}`} className="text-sm">{platform.name}</Label>
                      <span className="text-sm font-medium">{formatCurrency(totalBudget * budgetData[index % budgetData.length].percentage / 100)}</span>
                    </div>
                    <Slider
                      id={`platform-${index}`}
                      defaultValue={[budgetData[index % budgetData.length].percentage]}
                      max={100}
                      step={5}
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
                  <span className="font-medium">{formatNumber(expectedDailyVisits)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 text-platforms mr-2" />
                    <span className="text-sm">Daily Impressions</span>
                  </div>
                  <span className="font-medium">{formatNumber(expectedDailyImpressions)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-earnings mr-2" />
                    <span className="text-sm">Daily Revenue</span>
                  </div>
                  <span className="font-medium">{formatCurrency(expectedDailyRevenue)}</span>
                </div>
              </div>
              
              <div className={cn(
                "bg-background rounded-md p-3 border",
                expectedROI > 0 ? "border-success/30" : "border-destructive/30"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className={cn(
                      "h-4 w-4 mr-2",
                      expectedROI > 0 ? "text-success" : "text-destructive"
                    )} />
                    <span className="text-sm">Expected ROI</span>
                  </div>
                  <span className={cn(
                    "font-medium",
                    expectedROI > 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatPercent(expectedROI, 1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <BudgetDistributionCard data={budgetData} />
          
          <RecommendationCard />
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizer;
