
import { useState, useEffect } from 'react';
import { 
  Calculator, 
  Target, 
  DollarSign, 
  Info, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Download,
  Coins,
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchPlatforms, PlatformData } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

interface Platform extends PlatformData {
  isSelected: boolean;
  customCpm: number;
  acceptanceRate: number;
  costPerCredit: number;
  allocatedRevenue: number;
  requiredCredits: number;
  estimatedImpressions: number;
  estimatedVisits: number;
}

interface RevenueBudgetOptimizerProps {
  className?: string;
}

export default function RevenueBudgetOptimizer({ className }: RevenueBudgetOptimizerProps) {
  const [targetRevenue, setTargetRevenue] = useState<number>(100);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [globalMultiplier, setGlobalMultiplier] = useState<number>(1);
  
  // Fetch platforms from Supabase
  const { data: platformsData, isLoading, error } = useQuery({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms
  });
  
  useEffect(() => {
    if (platformsData) {
      // Transform the platform data to include the required additional fields
      const transformedPlatforms = platformsData.map(platform => {
        // Use default values if the platform doesn't have the required fields
        const defaultCpm = 0.5;
        const defaultAcceptanceRate = 0.15;
        const defaultCostPerCredit = 0.0001;
        
        return {
          ...platform,
          isSelected: true, // By default, all platforms are selected
          customCpm: platform.cpm || defaultCpm,
          acceptanceRate: platform.acceptanceRate || defaultAcceptanceRate,
          costPerCredit: platform.costPerCredit || defaultCostPerCredit,
          allocatedRevenue: 0,
          requiredCredits: 0,
          estimatedImpressions: 0,
          estimatedVisits: 0
        };
      });
      
      setPlatforms(transformedPlatforms);
    }
  }, [platformsData]);
  
  const togglePlatformSelection = (platformId: string) => {
    setPlatforms(prevPlatforms => 
      prevPlatforms.map(platform => 
        platform.id === platformId 
          ? { ...platform, isSelected: !platform.isSelected } 
          : platform
      )
    );
    
    // Reset calculations when selection changes
    setHasCalculated(false);
  };
  
  const updatePlatformValue = (platformId: string, field: keyof Platform, value: number) => {
    setPlatforms(prevPlatforms => 
      prevPlatforms.map(platform => 
        platform.id === platformId 
          ? { ...platform, [field]: value } 
          : platform
      )
    );
    
    // Reset calculations when values change
    setHasCalculated(false);
  };
  
  const calculateOptimizedBudget = () => {
    setIsOptimizing(true);
    
    // Get selected platforms
    const selectedPlatforms = platforms.filter(platform => platform.isSelected);
    
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      setIsOptimizing(false);
      return;
    }
    
    try {
      // Calculate efficiency score for each platform
      // The efficiency score is based on how much revenue a platform generates per credit
      const platformsWithEfficiency = selectedPlatforms.map(platform => {
        // Revenue per credit = (CPM / 1000) × acceptance rate / cost per credit
        const revenuePerCredit = (platform.customCpm / 1000) * platform.acceptanceRate / platform.costPerCredit;
        return {
          ...platform,
          efficiencyScore: revenuePerCredit * globalMultiplier
        };
      });
      
      // Sort platforms by efficiency score (most efficient first)
      const sortedPlatforms = [...platformsWithEfficiency].sort((a, b) => 
        b.efficiencyScore - a.efficiencyScore
      );
      
      // Distribute revenue based on efficiency scores
      const totalEfficiency = sortedPlatforms.reduce((sum, platform) => sum + platform.efficiencyScore, 0);
      
      // Update platform allocations
      const updatedPlatforms = platforms.map(platform => {
        const selectedPlatform = sortedPlatforms.find(p => p.id === platform.id);
        
        if (!selectedPlatform) {
          // This platform isn't selected, so reset its values
          return {
            ...platform,
            allocatedRevenue: 0,
            requiredCredits: 0,
            estimatedImpressions: 0,
            estimatedVisits: 0
          };
        }
        
        // Calculate allocated revenue based on efficiency proportion
        const allocatedRevenue = (selectedPlatform.efficiencyScore / totalEfficiency) * targetRevenue;
        
        // Calculate impressions needed to achieve allocated revenue
        const impressionsNeeded = (allocatedRevenue * 1000) / selectedPlatform.customCpm;
        
        // Calculate visits needed to achieve required impressions
        const visitsNeeded = impressionsNeeded / selectedPlatform.acceptanceRate;
        
        // Calculate credits needed to achieve required visits
        const creditsNeeded = visitsNeeded * selectedPlatform.costPerCredit;
        
        return {
          ...platform,
          allocatedRevenue,
          requiredCredits: creditsNeeded,
          estimatedImpressions: impressionsNeeded,
          estimatedVisits: visitsNeeded
        };
      });
      
      setPlatforms(updatedPlatforms);
      setHasCalculated(true);
      toast.success("Budget optimization completed");
    } catch (err) {
      console.error("Error calculating optimized budget:", err);
      toast.error("Error calculating optimized budget");
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Calculate totals for the summary section
  const selectedPlatforms = platforms.filter(platform => platform.isSelected);
  const totalAllocatedRevenue = selectedPlatforms.reduce((sum, platform) => sum + platform.allocatedRevenue, 0);
  const totalRequiredCredits = selectedPlatforms.reduce((sum, platform) => sum + platform.requiredCredits, 0);
  const totalEstimatedImpressions = selectedPlatforms.reduce((sum, platform) => sum + platform.estimatedImpressions, 0);
  const totalEstimatedVisits = selectedPlatforms.reduce((sum, platform) => sum + platform.estimatedVisits, 0);
  
  // Function to generate a report (placeholder for now)
  const generateReport = () => {
    toast.info("Report generation feature will be implemented soon");
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> 
              Revenue Budget Optimizer
            </CardTitle>
            <CardDescription>
              Optimize your budget allocation across multiple platforms to achieve your revenue goal
            </CardDescription>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-sm">
                <p>This tool optimizes your budget allocation across multiple platforms to achieve your target revenue with minimum credit usage.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          {/* Target Revenue Input */}
          <div className="space-y-2">
            <Label htmlFor="target-revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Total Target Revenue ($)
            </Label>
            <div className="flex items-center gap-2">
              <Input 
                id="target-revenue" 
                type="number" 
                min="1"
                value={targetRevenue}
                onChange={(e) => setTargetRevenue(Number(e.target.value))}
                className="w-full"
              />
              <Button 
                onClick={calculateOptimizedBudget} 
                disabled={isLoading || isOptimizing || selectedPlatforms.length === 0}
                className="whitespace-nowrap"
              >
                {isOptimizing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Calculator className="h-4 w-4 mr-2" />}
                Optimize Budget
              </Button>
            </div>
          </div>
          
          {/* Advanced Settings (Simple Global Version) */}
          {showAdvancedSettings && (
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Advanced Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="global-multiplier" className="flex items-center gap-2">
                  Global Efficiency Multiplier
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust this value to account for factors like traffic quality, geo-targeting, etc. across all platforms.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input 
                  id="global-multiplier" 
                  type="number" 
                  min="0.1" 
                  max="2" 
                  step="0.1"
                  value={globalMultiplier}
                  onChange={(e) => setGlobalMultiplier(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Platform Selection and Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium">Select and Configure Platforms</h3>
            
            {isLoading ? (
              <div className="py-4 text-center">Loading platforms...</div>
            ) : error ? (
              <div className="py-4 text-center text-destructive">Error loading platforms</div>
            ) : platforms.length === 0 ? (
              <div className="py-4 text-center">No platforms available</div>
            ) : (
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={`platform-${platform.id}`}
                          checked={platform.isSelected}
                          onCheckedChange={() => togglePlatformSelection(platform.id || '')}
                        />
                        <Label htmlFor={`platform-${platform.id}`} className="font-medium">{platform.name}</Label>
                      </div>
                      
                      {platform.isSelected && (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <div className="space-y-1">
                            <Label htmlFor={`cpm-${platform.id}`} className="text-xs">CPM Rate ($)</Label>
                            <Input
                              id={`cpm-${platform.id}`}
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={platform.customCpm}
                              onChange={(e) => updatePlatformValue(platform.id || '', 'customCpm', Number(e.target.value))}
                              className="h-8 w-20"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`acceptance-${platform.id}`} className="text-xs">Acceptance Rate</Label>
                            <Input
                              id={`acceptance-${platform.id}`}
                              type="number"
                              min="0.01"
                              max="1"
                              step="0.01"
                              value={platform.acceptanceRate}
                              onChange={(e) => updatePlatformValue(platform.id || '', 'acceptanceRate', Number(e.target.value))}
                              className="h-8 w-20"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`cost-${platform.id}`} className="text-xs">Cost per Credit</Label>
                            <Input
                              id={`cost-${platform.id}`}
                              type="number"
                              min="0.00001"
                              step="0.00001"
                              value={platform.costPerCredit}
                              onChange={(e) => updatePlatformValue(platform.id || '', 'costPerCredit', Number(e.target.value))}
                              className="h-8 w-20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Results Section */}
          {hasCalculated && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Optimized Budget Allocation
                </h3>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Target Revenue</p>
                          <p className="text-2xl font-bold">${targetRevenue.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Required Credits</p>
                          <p className="text-2xl font-bold">{totalRequiredCredits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Impressions</p>
                          <p className="text-2xl font-bold">{totalEstimatedImpressions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Visits</p>
                          <p className="text-2xl font-bold">{totalEstimatedVisits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Detailed Results Table */}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead className="text-right">Allocated Revenue</TableHead>
                        <TableHead className="text-right">Required Credits</TableHead>
                        <TableHead className="text-right">Estimated Impressions</TableHead>
                        <TableHead className="text-right">Estimated Visits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {platforms
                        .filter(platform => platform.isSelected)
                        .map((platform) => (
                          <TableRow key={platform.id}>
                            <TableCell className="font-medium">{platform.name}</TableCell>
                            <TableCell className="text-right">${platform.allocatedRevenue.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{platform.requiredCredits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right">{platform.estimatedImpressions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right">{platform.estimatedVisits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between items-center border-t pt-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Results are estimates based on the provided platform metrics.
        </p>
        <Button onClick={generateReport} disabled={!hasCalculated}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
}
