import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, BarChart2, Zap, TrendingUp, Download, 
  Calculator, RefreshCw, Check, Loader2, AlertTriangle, 
  Info, Plus, PieChart, Save, Upload, FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { 
  initialPlatforms, 
  calculateExpectedResults, 
  optimizeBudgetAllocation,
  generateRecommendation,
  exportToCsv,
  getRandomColor, 
  Platform, 
  ExpectedResults, 
  Recommendation
} from '@/utils/budgetUtils';
import { PlatformCard } from '@/components/budget/PlatformCard';
import { BudgetChart } from '@/components/budget/BudgetChart';
import { WhatIfAnalysis } from '@/components/budget/WhatIfAnalysis';

const BudgetOptimizer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dailyBudget, setDailyBudget] = useState<number>(50);
  const [optimizationTarget, setOptimizationTarget] = useState<'roi' | 'traffic' | 'impressions'>('roi');
  const [isAutoAdjustEnabled, setIsAutoAdjustEnabled] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('budget');
  const [platformAllocations, setPlatformAllocations] = useState<Platform[]>(
    initialPlatforms.map(p => ({ 
      ...p, 
      amount: (50 * p.percentage) / 100 
    }))
  );
  const [totalAllocatedPercentage, setTotalAllocatedPercentage] = useState<number>(100);
  const [expectedResults, setExpectedResults] = useState<ExpectedResults>({
    dailyVisits: 0,
    dailyImpressions: 0,
    dailyRevenue: 0,
    roi: 0
  });
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [isLoadingOptimize, setIsLoadingOptimize] = useState<boolean>(false);
  const [isLoadingApply, setIsLoadingApply] = useState<boolean>(false);
  const [saveConfigDialogOpen, setSaveConfigDialogOpen] = useState<boolean>(false);
  const [configName, setConfigName] = useState<string>('');
  const [savedConfigurations, setSavedConfigurations] = useState<Array<{
    id: string;
    name: string;
    platforms: Platform[];
    dailyBudget: number;
    target: 'roi' | 'traffic' | 'impressions';
    date: string;
  }>>([]);
  const [newPlatformDialogOpen, setNewPlatformDialogOpen] = useState<boolean>(false);
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    costPerVisit: 0.00001,
    acceptanceRate: 0.5,
    cpm: 1.5
  });
  
  useEffect(() => {
    const total = platformAllocations.reduce((sum, platform) => sum + platform.percentage, 0);
    setTotalAllocatedPercentage(total);
    
    if (isAutoAdjustEnabled && Math.abs(total - 100) > 0.1) {
      adjustPlatformPercentages();
    }
  }, [platformAllocations]);
  
  useEffect(() => {
    const results = calculateExpectedResults(platformAllocations, dailyBudget);
    setExpectedResults(results);
  }, [dailyBudget, platformAllocations]);
  
  useEffect(() => {
    const savedConfigs = localStorage.getItem('budgetConfigurations');
    if (savedConfigs) {
      try {
        setSavedConfigurations(JSON.parse(savedConfigs));
      } catch (error) {
        console.error("Error loading saved configurations:", error);
      }
    }
  }, []);
  
  const adjustPlatformPercentages = () => {
    const total = platformAllocations.reduce((sum, platform) => sum + platform.percentage, 0);
    if (Math.abs(total - 100) <= 0.1) return;
    
    const adjustmentFactor = 100 / total;
    const adjustedPlatforms = platformAllocations.map(platform => ({
      ...platform,
      percentage: platform.percentage * adjustmentFactor,
      amount: (dailyBudget * platform.percentage * adjustmentFactor) / 100
    }));
    
    setPlatformAllocations(adjustedPlatforms);
    
    toast({
      title: "Allocations Adjusted",
      description: "Platform allocations have been adjusted to total 100%.",
      duration: 3000,
    });
  };
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDailyBudget(value);
      
      const updatedAllocations = platformAllocations.map(platform => ({
        ...platform,
        amount: (value * platform.percentage) / 100
      }));
      
      setPlatformAllocations(updatedAllocations);
    }
  };
  
  const handlePlatformUpdate = (platformId: string, updates: any) => {
    const updatedPlatforms = platformAllocations.map(platform => {
      if (platform.id === platformId) {
        if (updates.percentage !== undefined) {
          return {
            ...platform,
            ...updates,
            amount: (dailyBudget * updates.percentage) / 100
          };
        }
        
        return { ...platform, ...updates };
      }
      return platform;
    });
    
    setPlatformAllocations(updatedPlatforms);
  };
  
  const handlePlatformRemove = (platformId: string) => {
    if (platformAllocations.length <= 2) {
      toast({
        title: "Cannot Remove Platform",
        description: "You need at least two platforms for comparison.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const updatedPlatforms = platformAllocations.filter(p => p.id !== platformId);
    setPlatformAllocations(updatedPlatforms);
    
    toast({
      title: "Platform Removed",
      description: "Platform has been removed from your budget allocation.",
      duration: 3000,
    });
  };
  
  const handleOptimize = () => {
    setIsLoadingOptimize(true);
    
    setTimeout(() => {
      try {
        const optimizedPlatforms = optimizeBudgetAllocation(
          platformAllocations, 
          optimizationTarget,
          dailyBudget
        );
        
        const recommendation = generateRecommendation(platformAllocations, optimizedPlatforms);
        
        setPlatformAllocations(optimizedPlatforms);
        
        setCurrentRecommendation(recommendation);
        
        toast({
          title: "Budget Optimized",
          description: `Budget has been optimized for maximum ${
            optimizationTarget === 'roi' ? 'ROI' : 
            optimizationTarget === 'traffic' ? 'traffic' : 
            'impressions'
          }.`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Optimization error:", error);
        
        toast({
          title: "Optimization Error",
          description: "An error occurred while optimizing your budget.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoadingOptimize(false);
      }
    }, 1000);
  };
  
  const handleRecommendationApply = () => {
    if (!currentRecommendation) return;
    
    setIsLoadingApply(true);
    
    setTimeout(() => {
      try {
        const recommendedAllocations = platformAllocations.map(platform => {
          const newPercentage = currentRecommendation.allocations[platform.id] || platform.percentage;
          return {
            ...platform,
            percentage: newPercentage,
            amount: (dailyBudget * newPercentage) / 100
          };
        });
        
        setPlatformAllocations(recommendedAllocations);
        
        setCurrentRecommendation(null);
        
        toast({
          title: "Recommendations Applied",
          description: "Budget allocations have been updated based on AI recommendations.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error applying recommendations:", error);
        
        toast({
          title: "Error",
          description: "Failed to apply recommendations. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoadingApply(false);
      }
    }, 800);
  };
  
  const handleExportPlan = () => {
    const exportData = platformAllocations.map(platform => ({
      Platform: platform.name,
      'Allocation (%)': platform.percentage.toFixed(1),
      'Allocation ($)': platform.amount.toFixed(2),
      'Cost per Visit ($)': platform.costPerVisit.toFixed(8),
      'Acceptance Rate (%)': (platform.acceptanceRate * 100).toFixed(1),
      'CPM Rate ($)': platform.cpm.toFixed(2)
    }));
    
    exportToCsv(exportData, `budget-plan-${new Date().toISOString().slice(0, 10)}.csv`);
    
    toast({
      title: "Budget Plan Exported",
      description: "Your budget plan has been exported as CSV.",
      duration: 3000,
    });
  };
  
  const navigateToRoiCalculator = () => {
    navigate('/cpm-calculator');
    
    toast({
      title: "Navigating",
      description: "Redirecting to CPM Calculator page.",
      duration: 2000,
    });
  };
  
  const handleSaveConfiguration = () => {
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
      platforms: [...platformAllocations],
      dailyBudget,
      target: optimizationTarget,
      date: new Date().toISOString()
    };
    
    const updatedConfigs = [...savedConfigurations, newConfig];
    setSavedConfigurations(updatedConfigs);
    localStorage.setItem('budgetConfigurations', JSON.stringify(updatedConfigs));
    
    setSaveConfigDialogOpen(false);
    setConfigName('');
    
    toast({
      title: "Configuration Saved",
      description: `"${configName}" has been saved to your local configurations.`,
      duration: 3000,
    });
  };
  
  const handleLoadConfiguration = (config: any) => {
    setDailyBudget(config.dailyBudget);
    setOptimizationTarget(config.target);
    setPlatformAllocations(config.platforms.map((p: Platform) => ({
      ...p,
      amount: (config.dailyBudget * p.percentage) / 100
    })));
    
    toast({
      title: "Configuration Loaded",
      description: `"${config.name}" has been loaded successfully.`,
      duration: 3000,
    });
  };
  
  const handleAddPlatform = () => {
    if (!newPlatform.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the new platform.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const newId = `platform-${Date.now()}`;
    const color = getRandomColor();
    const equalPercentage = 100 / (platformAllocations.length + 1);
    
    const adjustedPlatforms = platformAllocations.map(p => ({
      ...p,
      percentage: equalPercentage,
      amount: (dailyBudget * equalPercentage) / 100
    }));
    
    const updatedPlatforms = [
      ...adjustedPlatforms,
      {
        id: newId,
        name: newPlatform.name,
        percentage: equalPercentage,
        amount: (dailyBudget * equalPercentage) / 100,
        color,
        costPerVisit: newPlatform.costPerVisit,
        acceptanceRate: newPlatform.acceptanceRate,
        cpm: newPlatform.cpm
      }
    ];
    
    setPlatformAllocations(updatedPlatforms);
    setNewPlatformDialogOpen(false);
    setNewPlatform({
      name: '',
      costPerVisit: 0.00001,
      acceptanceRate: 0.5,
      cpm: 1.5
    });
    
    toast({
      title: "Platform Added",
      description: `"${newPlatform.name}" has been added to your budget allocation.`,
      duration: 3000,
    });
  };
  
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        
        if (
          !importedConfig.platforms ||
          !Array.isArray(importedConfig.platforms) ||
          typeof importedConfig.dailyBudget !== 'number'
        ) {
          throw new Error("Invalid configuration format");
        }
        
        setDailyBudget(importedConfig.dailyBudget || 50);
        setOptimizationTarget(importedConfig.target || 'roi');
        setPlatformAllocations(importedConfig.platforms.map((p: any) => ({
          ...p,
          amount: (importedConfig.dailyBudget * p.percentage) / 100
        })));
        
        toast({
          title: "Configuration Imported",
          description: "Your budget configuration has been imported successfully.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Import error:", error);
        
        toast({
          title: "Import Error",
          description: "Failed to import configuration. Invalid file format.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    
    reader.readAsText(file);
    
    event.target.value = '';
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mt-1">
                  <TabsTrigger
                    value="budget"
                    className={activeTab === 'budget' ? 'bg-primary text-white' : ''}
                  >
                    Budget Allocations
                  </TabsTrigger>
                  <TabsTrigger
                    value="scenarios"
                    className={activeTab === 'scenarios' ? 'bg-primary text-white' : ''}
                  >
                    What-If Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className={activeTab === 'saved' ? 'bg-primary text-white' : ''}
                  >
                    Saved Configurations
                  </TabsTrigger>
                </TabsList>
              
                <CardContent className="space-y-6">
                  <TabsContent value="budget">
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
                          <Select 
                            value={optimizationTarget} 
                            onValueChange={(value) => setOptimizationTarget(value as 'roi' | 'traffic' | 'impressions')}
                          >
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
                        <Label htmlFor="auto-adjust" className="cursor-pointer">
                          Auto-adjust allocations to maintain 100% total
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="advanced-options"
                          checked={showAdvancedOptions}
                          onCheckedChange={setShowAdvancedOptions}
                        />
                        <Label htmlFor="advanced-options" className="cursor-pointer">
                          Show advanced platform options
                        </Label>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Platform Allocations</h3>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-medium",
                            Math.abs(totalAllocatedPercentage - 100) > 0.5 
                              ? "text-destructive" 
                              : "text-muted-foreground"
                          )}>
                            Total: {totalAllocatedPercentage.toFixed(0)}%
                          </span>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setNewPlatformDialogOpen(true)}
                            className="h-8"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Platform
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {platformAllocations.map((platform) => (
                          <PlatformCard
                            key={platform.id}
                            {...platform}
                            onUpdate={handlePlatformUpdate}
                            onRemove={handlePlatformRemove}
                            showAdvancedFields={showAdvancedOptions}
                          />
                        ))}
                      </div>
                      
                      {Math.abs(totalAllocatedPercentage - 100) > 0.5 && (
                        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Invalid Allocation</AlertTitle>
                          <AlertDescription>
                            Total allocation must equal 100%. Current total: {totalAllocatedPercentage.toFixed(0)}%
                            {!isAutoAdjustEnabled && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-destructive underline"
                                onClick={adjustPlatformPercentages}
                              >
                                Adjust Now
                              </Button>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      <Button 
                        onClick={handleOptimize} 
                        disabled={isLoadingOptimize || Math.abs(totalAllocatedPercentage - 100) > 0.5}
                        className="flex-1"
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
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setSaveConfigDialogOpen(true)}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Configuration
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scenarios">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Experiment with different platform parameters to see how they affect your results
                        without changing your actual budget allocation.
                      </p>
                      
                      <WhatIfAnalysis 
                        platforms={platformAllocations}
                        dailyBudget={dailyBudget}
                        onApplyChanges={(updatedPlatforms) => {
                          setPlatformAllocations(updatedPlatforms);
                          toast({
                            title: "Changes Applied",
                            description: "What-if scenario has been applied to your budget allocation.",
                            duration: 3000,
                          });
                        }}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Saved Configurations</h3>
                        <div>
                          <input
                            type="file"
                            id="import-config"
                            className="hidden"
                            accept="application/json"
                            onChange={handleImportFile}
                          />
                          <label htmlFor="import-config">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 cursor-pointer"
                              asChild
                            >
                              <span>
                                <FileUp className="h-3.5 w-3.5 mr-1" />
                                Import
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      {savedConfigurations.length === 0 ? (
                        <div className="text-center p-6 border rounded-md bg-muted/20">
                          <p className="text-muted-foreground">No saved configurations yet</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Save your current configuration or import one to get started
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {savedConfigurations.map((config) => (
                            <div 
                              key={config.id} 
                              className="flex items-center justify-between border rounded-md p-3"
                            >
                              <div>
                                <p className="font-medium">{config.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${config.dailyBudget} budget, {config.platforms.length} platforms,
                                  {new Date(config.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleLoadConfiguration(config)}
                                >
                                  Load
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    const updatedConfigs = savedConfigurations.filter(c => c.id !== config.id);
                                    setSavedConfigurations(updatedConfigs);
                                    localStorage.setItem('budgetConfigurations', JSON.stringify(updatedConfigs));
                                    
                                    toast({
                                      title: "Configuration Deleted",
                                      description: `"${config.name}" has been removed.`,
                                      duration: 3000,
                                    });
                                  }}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-muted/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Expected Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-traffic mr-2" />
                    <span className="text-sm">Daily Visits</span>
                  </div>
                  <span className="font-medium">{formatNumber(expectedResults.dailyVisits)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 text-platforms mr-2" />
                    <span className="text-sm">Daily Impressions</span>
                  </div>
                  <span className="font-medium">{formatNumber(expectedResults.dailyImpressions)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded-md p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-earnings mr-2" />
                    <span className="text-sm">Daily Revenue</span>
                  </div>
                  <span className="font-medium">{formatCurrency(expectedResults.dailyRevenue)}</span>
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetChart data={platformAllocations} />
              
              <div className="mt-4 space-y-2">
                {platformAllocations.map((platform) => (
                  <div key={platform.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-${platform.color} mr-2`}></div>
                      <span>{platform.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{platform.percentage.toFixed(0)}%</span>
                      <span className="font-medium">{formatCurrency(platform.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {currentRecommendation && (
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Budget Recommendation</CardTitle>
                    <CardDescription>Based on your optimization target</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {currentRecommendation.changes.map((change, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{change.description}</span>
                      <span className={`text-xs bg-${change.impactType}/10 text-${change.impactType} px-2 py-0.5 rounded`}>
                        {change.impact}
                      </span>
                    </div>
                  ))}
                  
                  {currentRecommendation.changes.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Your current allocation is already optimized.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/10 pt-3">
                <Button 
                  onClick={handleRecommendationApply} 
                  className="w-full" 
                  disabled={isLoadingApply || currentRecommendation.changes.length === 0}
                >
                  {isLoadingApply ? (
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
          )}
          
          <Card>
            <CardContent className="pt-4">
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle>Optimization Tips</AlertTitle>
                <AlertDescription className="text-sm">
                  <ul className="list-disc pl-4 space-y-1 mt-2">
                    <li>Platforms with higher acceptance rates convert more traffic into revenue</li>
                    <li>Higher CPM rates mean more revenue per 1000 impressions</li>
                    <li>Lower cost per visit means more traffic for your budget</li>
                    <li>Find the optimal balance between cost, traffic, and conversion rates</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={saveConfigDialogOpen} onOpenChange={setSaveConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
            <DialogDescription>
              Enter a name for this configuration to save it for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="config-name">Configuration Name</Label>
            <Input
              id="config-name"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="My Budget Plan"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={newPlatformDialogOpen} onOpenChange={setNewPlatformDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Platform</DialogTitle>
            <DialogDescription>
              Enter the details for the new traffic platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="platform-name">Platform Name</Label
