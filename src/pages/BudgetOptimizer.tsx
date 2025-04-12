
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, BarChart2, Zap, TrendingUp, Download, Calculator, RefreshCw, Check, Loader2, AlertTriangle, Info } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// Define the platform allocation type for TypeScript
interface PlatformAllocation {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

// Define the expected results type
interface ExpectedResults {
  visits: number;
  impressions: number;
  revenue: number;
  roi: number;
}

// Define the recommendation type
interface Recommendation {
  id: string;
  changes: {
    description: string;
    impact: string;
    impactType: 'success' | 'warning';
  }[];
  allocations: {
    [key: string]: number;
  }
}

const BudgetDistributionCard = ({ data }: { data: PlatformAllocation[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Current Budget Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((platform) => (
            <div key={platform.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${platform.color} mr-2`}></div>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(platform.amount)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={platform.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground w-8">{platform.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationCard = ({ recommendation, onApply, isLoading }: { 
  recommendation: Recommendation | null, 
  onApply: () => void,
  isLoading: boolean
}) => {
  if (!recommendation) return null;
  
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
          {recommendation.changes.map((change, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{change.description}</span>
              <span className={`text-xs bg-${change.impactType}/10 text-${change.impactType} px-2 py-0.5 rounded`}>
                {change.impact}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 pt-3">
        <Button onClick={onApply} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Apply Recommendations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Initial platform allocations
const initialPlatformAllocations: PlatformAllocation[] = [
  { id: '9hits', name: '9Hits', percentage: 35, amount: 17.5, color: 'primary' },
  { id: 'hitleap', name: 'HitLeap', percentage: 25, amount: 12.5, color: 'traffic' },
  { id: 'otohits', name: 'Otohits', percentage: 20, amount: 10, color: 'platforms' },
  { id: 'easyhits4u', name: 'EasyHits4U', percentage: 10, amount: 5, color: 'earnings' },
  { id: 'webhit', name: 'Webhit.net', percentage: 10, amount: 5, color: 'muted-foreground' }
];

const BudgetOptimizer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [dailyBudget, setDailyBudget] = useState<number>(50);
  const [optimizationTarget, setOptimizationTarget] = useState<string>('roi');
  const [isAutoAdjustEnabled, setIsAutoAdjustEnabled] = useState<boolean>(false);
  const [platformAllocations, setPlatformAllocations] = useState<PlatformAllocation[]>(
    initialPlatformAllocations.map(p => ({ 
      ...p, 
      amount: (50 * p.percentage) / 100 
    }))
  );
  const [totalAllocatedPercentage, setTotalAllocatedPercentage] = useState<number>(100);
  const [expectedResults, setExpectedResults] = useState<ExpectedResults>({
    visits: 10000,
    impressions: 4000,
    revenue: 25,
    roi: -50
  });
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>({
    id: 'rec1',
    changes: [
      { 
        description: 'Reallocate from HitLeap to 9Hits',
        impact: '+15% ROI',
        impactType: 'success'
      },
      { 
        description: 'Increase budget for Otohits',
        impact: '+8% Traffic',
        impactType: 'success'
      },
      { 
        description: 'Reduce EasyHits4U spend',
        impact: 'Low Quality',
        impactType: 'warning'
      }
    ],
    allocations: {
      '9hits': 45,
      'hitleap': 15,
      'otohits': 25,
      'easyhits4u': 5,
      'webhit': 10
    }
  });
  const [isLoadingOptimize, setIsLoadingOptimize] = useState<boolean>(false);
  const [isLoadingApply, setIsLoadingApply] = useState<boolean>(false);
  
  // Calculate total allocated percentage whenever platform allocations change
  useEffect(() => {
    const total = platformAllocations.reduce((sum, platform) => sum + platform.percentage, 0);
    setTotalAllocatedPercentage(total);
  }, [platformAllocations]);
  
  // Calculate expected results whenever budget or allocations change
  useEffect(() => {
    calculateExpectedResults();
  }, [dailyBudget, platformAllocations]);
  
  // Calculate expected results based on current allocations and budget
  const calculateExpectedResults = () => {
    // Mock calculation logic - in a real app, this would be more sophisticated
    const totalBudget = dailyBudget;
    const expectedVisits = totalBudget * 200; // 200 visits per $1
    const expectedImpressions = expectedVisits * 0.4; // 40% acceptance rate
    const expectedRevenue = expectedImpressions * 0.0005; // $0.0005 per impression
    const expectedRoi = ((expectedRevenue - totalBudget) / totalBudget) * 100;
    
    setExpectedResults({
      visits: expectedVisits,
      impressions: expectedImpressions,
      revenue: expectedRevenue,
      roi: expectedRoi
    });
  };
  
  // Handle daily budget input change
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDailyBudget(value);
      
      // Update platform allocation amounts based on new budget
      const updatedAllocations = platformAllocations.map(platform => ({
        ...platform,
        amount: (value * platform.percentage) / 100
      }));
      
      setPlatformAllocations(updatedAllocations);
    }
  };
  
  // Handle direct percentage input for each platform
  const handleDirectPercentageInput = (platformId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    
    // Validate input
    if (isNaN(newValue) || newValue < 0 || newValue > 100) {
      return;
    }
    
    handleAllocationChange(platformId, [newValue]);
  };
  
  // Handle slider changes for platform allocations
  const handleAllocationChange = (platformId: string, value: number[]) => {
    const newValue = value[0];
    
    // Find the platform we're updating
    const platform = platformAllocations.find(p => p.id === platformId);
    if (!platform) return;
    
    // Calculate the difference between old and new percentage
    const difference = newValue - platform.percentage;
    
    // If there's no change, return early
    if (difference === 0) return;
    
    // Adjust other platforms proportionally to maintain 100% total
    const otherPlatforms = platformAllocations.filter(p => p.id !== platformId);
    const totalOtherPercentage = otherPlatforms.reduce((sum, p) => sum + p.percentage, 0);
    
    let updatedAllocations = platformAllocations.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          percentage: newValue,
          amount: (dailyBudget * newValue) / 100
        };
      } else {
        // Adjust other platforms proportionally
        const adjustmentFactor = totalOtherPercentage > 0 
          ? (100 - newValue) / totalOtherPercentage 
          : 0;
        
        const newPercentage = p.percentage * adjustmentFactor;
        
        return {
          ...p,
          percentage: newPercentage,
          amount: (dailyBudget * newPercentage) / 100
        };
      }
    });
    
    // Ensure we have 100% allocation (fix rounding errors)
    const totalPercentage = updatedAllocations.reduce((sum, p) => sum + p.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      // If we're off by more than 0.01%, adjust the last platform to make it exactly 100%
      const lastPlatform = updatedAllocations.find(p => p.id !== platformId);
      if (lastPlatform) {
        const adjustment = 100 - (totalPercentage - lastPlatform.percentage);
        updatedAllocations = updatedAllocations.map(p => {
          if (p.id === lastPlatform.id) {
            return {
              ...p,
              percentage: adjustment,
              amount: (dailyBudget * adjustment) / 100
            };
          }
          return p;
        });
      }
    }
    
    setPlatformAllocations(updatedAllocations);
    
    // Show a toast notification for significant changes
    if (Math.abs(difference) >= 10) {
      toast({
        title: "Budget Allocation Updated",
        description: `${platform.name} allocation ${difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(difference).toFixed(0)}%`,
        duration: 3000,
      });
    }
  };
  
  // Handle budget optimization
  const handleOptimize = () => {
    setIsLoadingOptimize(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Simulate optimized allocations based on selected target
      let optimizedAllocations;
      
      if (optimizationTarget === 'roi') {
        // Optimize for ROI - these would come from a real optimization algorithm
        optimizedAllocations = platformAllocations.map(p => {
          if (p.id === '9hits') return { ...p, percentage: 40, amount: dailyBudget * 0.4 };
          if (p.id === 'hitleap') return { ...p, percentage: 20, amount: dailyBudget * 0.2 };
          if (p.id === 'otohits') return { ...p, percentage: 25, amount: dailyBudget * 0.25 };
          if (p.id === 'easyhits4u') return { ...p, percentage: 5, amount: dailyBudget * 0.05 };
          return { ...p, percentage: 10, amount: dailyBudget * 0.1 };
        });
      } else if (optimizationTarget === 'traffic') {
        // Optimize for traffic
        optimizedAllocations = platformAllocations.map(p => {
          if (p.id === '9hits') return { ...p, percentage: 35, amount: dailyBudget * 0.35 };
          if (p.id === 'hitleap') return { ...p, percentage: 30, amount: dailyBudget * 0.3 };
          if (p.id === 'otohits') return { ...p, percentage: 15, amount: dailyBudget * 0.15 };
          if (p.id === 'easyhits4u') return { ...p, percentage: 10, amount: dailyBudget * 0.1 };
          return { ...p, percentage: 10, amount: dailyBudget * 0.1 };
        });
      } else {
        // Optimize for impressions
        optimizedAllocations = platformAllocations.map(p => {
          if (p.id === '9hits') return { ...p, percentage: 30, amount: dailyBudget * 0.3 };
          if (p.id === 'hitleap') return { ...p, percentage: 15, amount: dailyBudget * 0.15 };
          if (p.id === 'otohits') return { ...p, percentage: 35, amount: dailyBudget * 0.35 };
          if (p.id === 'easyhits4u') return { ...p, percentage: 10, amount: dailyBudget * 0.1 };
          return { ...p, percentage: 10, amount: dailyBudget * 0.1 };
        });
      }
      
      setPlatformAllocations(optimizedAllocations);
      
      // Also update expected results (more dramatic impact for demonstration)
      const baseVisits = dailyBudget * 220; // Slightly better than before
      const baseImpressions = baseVisits * 0.42; // Better acceptance rate
      const baseRevenue = baseImpressions * 0.0006; // Better CPM
      const baseRoi = ((baseRevenue - dailyBudget) / dailyBudget) * 100;
      
      setExpectedResults({
        visits: baseVisits,
        impressions: baseImpressions,
        revenue: baseRevenue,
        roi: baseRoi
      });
      
      toast({
        title: "Budget Optimized",
        description: `Budget has been optimized for maximum ${
          optimizationTarget === 'roi' ? 'ROI' : 
          optimizationTarget === 'traffic' ? 'traffic' : 
          'impressions'
        }.`,
        duration: 3000,
      });
      
      setIsLoadingOptimize(false);
    }, 1500);
  };
  
  // Handle applying AI recommendations
  const handleRecommendationApply = () => {
    if (!currentRecommendation) return;
    
    setIsLoadingApply(true);
    
    // Simulate a delay for applying recommendations
    setTimeout(() => {
      // Apply the recommendations
      const recommendedAllocations = platformAllocations.map(platform => {
        const newPercentage = currentRecommendation.allocations[platform.id] || platform.percentage;
        return {
          ...platform,
          percentage: newPercentage,
          amount: (dailyBudget * newPercentage) / 100
        };
      });
      
      setPlatformAllocations(recommendedAllocations);
      
      // Update expected results (more dramatic impact for demonstration)
      const baseVisits = dailyBudget * 230; // Even better than optimization
      const baseImpressions = baseVisits * 0.45; // Better acceptance rate
      const baseRevenue = baseImpressions * 0.00065; // Better CPM
      const baseRoi = ((baseRevenue - dailyBudget) / dailyBudget) * 100;
      
      setExpectedResults({
        visits: baseVisits,
        impressions: baseImpressions,
        revenue: baseRevenue,
        roi: baseRoi
      });
      
      // Clear the recommendation after applying
      setCurrentRecommendation(null);
      
      toast({
        title: "Recommendations Applied",
        description: "Budget allocations have been updated based on AI recommendations.",
        duration: 3000,
      });
      
      setIsLoadingApply(false);
    }, 1000);
  };
  
  // Handle exporting the budget plan
  const handleExportPlan = () => {
    const exportData = {
      dailyBudget,
      optimizationTarget,
      isAutoAdjustEnabled,
      platformAllocations,
      expectedResults,
      exportDate: new Date().toISOString()
    };
    
    console.log('Exporting Budget Plan:', exportData);
    
    toast({
      title: "Budget Plan Exported",
      description: "Budget plan data has been exported to console.",
      duration: 3000,
    });
  };
  
  // Navigate to ROI calculator
  const navigateToRoiCalculator = () => {
    navigate('/cpm-calculator');
    
    toast({
      title: "Navigating",
      description: "Redirecting to CPM Calculator page.",
      duration: 2000,
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
          <Button variant="outline" size="sm" onClick={navigateToRoiCalculator}>
            <Calculator className="h-4 w-4 mr-2" />
            CPM Calculator
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPlan}>
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
                        min="0"
                        step="1"
                        value={dailyBudget} 
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
                    checked={isAutoAdjustEnabled}
                    onCheckedChange={setIsAutoAdjustEnabled}
                  />
                  <Label htmlFor="auto-adjust">
                    Auto-adjust budget based on real-time performance
                  </Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Platform Allocations</h3>
                  <span className={cn(
                    "text-sm font-medium",
                    Math.abs(totalAllocatedPercentage - 100) > 0.5 && "text-destructive"
                  )}>
                    Total: {totalAllocatedPercentage.toFixed(0)}%
                  </span>
                </div>
                
                {platformAllocations.map((platform) => (
                  <div key={platform.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`platform-${platform.id}`} className="text-sm">{platform.name}</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="5"
                          className="w-16 h-8 text-sm"
                          value={platform.percentage}
                          onChange={(e) => handleDirectPercentageInput(platform.id, e)}
                        />
                        <span className="text-sm font-medium w-20 text-right">
                          {formatCurrency(platform.amount)}
                        </span>
                      </div>
                    </div>
                    <Slider
                      id={`platform-${platform.id}`}
                      value={[platform.percentage]}
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
                
                {Math.abs(totalAllocatedPercentage - 100) > 0.5 && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Invalid Allocation</AlertTitle>
                    <AlertDescription>
                      Total allocation must equal 100%. Current total: {totalAllocatedPercentage.toFixed(0)}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <Button 
                onClick={handleOptimize} 
                className="w-full"
                disabled={isLoadingOptimize || Math.abs(totalAllocatedPercentage - 100) > 0.5}
              >
                {isLoadingOptimize ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Budget Allocation
                  </>
                )}
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
          
          <BudgetDistributionCard data={platformAllocations} />
          
          {currentRecommendation && (
            <RecommendationCard 
              recommendation={currentRecommendation} 
              onApply={handleRecommendationApply}
              isLoading={isLoadingApply}
            />
          )}
          
          <Card>
            <CardContent className="pt-4">
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle>Budget Optimization Tips</AlertTitle>
                <AlertDescription className="text-sm">
                  <ul className="list-disc pl-4 space-y-1 mt-2">
                    <li>Start with platforms that have the highest acceptance rates</li>
                    <li>Distribute more budget to platforms with better ROI</li>
                    <li>Monitor performance and adjust allocations weekly</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizer;
