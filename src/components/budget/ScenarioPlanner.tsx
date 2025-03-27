
import { useState } from 'react';
import { PlayCircle, HelpCircle, Save, BarChart4, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';

interface BudgetReallocation {
  fromPlatform: string;
  toPlatform: string;
  percentage: number;
}

interface FormData {
  cpmAdjustment: number;
  acceptanceRateAdjustment: number;
  rdpCount: number;
  rdpAction: string;
  budgetReallocation: BudgetReallocation;
}

interface BaseMetrics {
  dailyVisits: number;
  revenue: number;
  roi: number;
  expenses: number;
}

interface ProjectedMetrics {
  dailyVisits: number;
  revenue: number;
  roi: number;
  expenses: number;
}

export function ScenarioPlanner() {
  const [scenarioName, setScenarioName] = useState('New Scenario');
  const [formData, setFormData] = useState<FormData>({
    cpmAdjustment: 0,
    acceptanceRateAdjustment: 0,
    rdpCount: 0,
    rdpAction: 'add',
    budgetReallocation: {
      fromPlatform: '9hits',
      toPlatform: 'hitleap',
      percentage: 10
    }
  });
  
  // Base metrics for comparison
  const baseMetrics: BaseMetrics = {
    dailyVisits: 10000,
    revenue: 45.50,
    roi: 132,
    expenses: 19.60
  };
  
  // Calculated projected metrics
  const projectedMetrics: ProjectedMetrics = {
    dailyVisits: baseMetrics.dailyVisits * (1 + formData.acceptanceRateAdjustment / 100),
    revenue: baseMetrics.revenue * (1 + formData.cpmAdjustment / 100) * (1 + formData.acceptanceRateAdjustment / 100),
    expenses: baseMetrics.expenses + (formData.rdpAction === 'add' ? formData.rdpCount * 1.2 : formData.rdpAction === 'remove' ? -formData.rdpCount * 1.2 : 0),
    roi: 0 // Will be calculated below
  };
  
  projectedMetrics.roi = ((projectedMetrics.revenue / projectedMetrics.expenses) - 1) * 100;
  
  const { toast } = useToast();
  
  const handleChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleSaveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: `"${scenarioName}" has been saved successfully.`,
      duration: 3000,
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <PlayCircle className="h-4 w-4 mr-2" />
          Scenario Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Traffic Strategy Scenario Planner</DialogTitle>
          <DialogDescription>
            Simulate changes to your traffic strategy and see projected outcomes
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Scenario Name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="max-w-[250px]"
              />
              <Button variant="outline" size="icon" onClick={handleSaveScenario}>
                <Save className="h-4 w-4" />
                <span className="sr-only">Save Scenario</span>
              </Button>
            </div>
            
            <Tabs defaultValue="metrics">
              <TabsList>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cpm-adjustment">Adjust CPM</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Simulate a change in CPM rates across all platforms.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium">{formData.cpmAdjustment > 0 ? '+' : ''}{formData.cpmAdjustment}%</span>
                  </div>
                  
                  <Slider
                    id="cpm-adjustment"
                    value={[formData.cpmAdjustment]}
                    onValueChange={(values) => handleChange('cpmAdjustment', values[0])}
                    min={-50}
                    max={50}
                    step={1}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="acceptance-rate-adjustment">Adjust Acceptance Rate</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Simulate a change in traffic acceptance rates.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium">{formData.acceptanceRateAdjustment > 0 ? '+' : ''}{formData.acceptanceRateAdjustment}%</span>
                  </div>
                  
                  <Slider
                    id="acceptance-rate-adjustment"
                    value={[formData.acceptanceRateAdjustment]}
                    onValueChange={(values) => handleChange('acceptanceRateAdjustment', values[0])}
                    min={-30}
                    max={30}
                    step={1}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="budget" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label>Budget Reallocation</Label>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={formData.budgetReallocation.fromPlatform}
                      onValueChange={(value) => handleChange('budgetReallocation.fromPlatform', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9hits">9Hits</SelectItem>
                        <SelectItem value="hitleap">HitLeap</SelectItem>
                        <SelectItem value="otohits">Otohits</SelectItem>
                        <SelectItem value="bighits4u">BigHits4U</SelectItem>
                        <SelectItem value="webhitnet">Webhit.net</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    
                    <Select
                      value={formData.budgetReallocation.toPlatform}
                      onValueChange={(value) => handleChange('budgetReallocation.toPlatform', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9hits">9Hits</SelectItem>
                        <SelectItem value="hitleap">HitLeap</SelectItem>
                        <SelectItem value="otohits">Otohits</SelectItem>
                        <SelectItem value="bighits4u">BigHits4U</SelectItem>
                        <SelectItem value="webhitnet">Webhit.net</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex-grow">
                      <Input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={formData.budgetReallocation.percentage}
                        onChange={(e) => handleChange('budgetReallocation.percentage', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm">%</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Shift {formData.budgetReallocation.percentage}% of budget from {formData.budgetReallocation.fromPlatform} to {formData.budgetReallocation.toPlatform}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="infrastructure" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label htmlFor="rdp-action">RDP Changes</Label>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={formData.rdpAction}
                      onValueChange={(value) => handleChange('rdpAction', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add</SelectItem>
                        <SelectItem value="remove">Remove</SelectItem>
                        <SelectItem value="none">No Change</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      type="number" 
                      value={formData.rdpCount}
                      onChange={(e) => handleChange('rdpCount', parseInt(e.target.value))}
                      min="0"
                      disabled={formData.rdpAction === 'none'}
                      className="w-24"
                    />
                    
                    <span className="text-sm">RDPs</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {formData.rdpAction === 'add' && `Adding ${formData.rdpCount} RDPs will increase your daily expenses by $${(formData.rdpCount * 1.2).toFixed(2)}`}
                    {formData.rdpAction === 'remove' && `Removing ${formData.rdpCount} RDPs will decrease your daily expenses by $${(formData.rdpCount * 1.2).toFixed(2)}`}
                    {formData.rdpAction === 'none' && 'No changes to RDP infrastructure'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart4 className="h-4 w-4" />
                  Projected Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Visits</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{Math.round(projectedMetrics.dailyVisits).toLocaleString()}</span>
                      <span className={`text-xs ${projectedMetrics.dailyVisits > baseMetrics.dailyVisits ? 'text-success' : 'text-destructive'}`}>
                        {projectedMetrics.dailyVisits > baseMetrics.dailyVisits ? '+' : ''}
                        {Math.round(((projectedMetrics.dailyVisits / baseMetrics.dailyVisits) - 1) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Revenue</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${projectedMetrics.revenue.toFixed(2)}</span>
                      <span className={`text-xs ${projectedMetrics.revenue > baseMetrics.revenue ? 'text-success' : 'text-destructive'}`}>
                        {projectedMetrics.revenue > baseMetrics.revenue ? '+' : ''}
                        {Math.round(((projectedMetrics.revenue / baseMetrics.revenue) - 1) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Expenses</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${projectedMetrics.expenses.toFixed(2)}</span>
                      <span className={`text-xs ${projectedMetrics.expenses < baseMetrics.expenses ? 'text-success' : 'text-destructive'}`}>
                        {projectedMetrics.expenses > baseMetrics.expenses ? '+' : ''}
                        {Math.round(((projectedMetrics.expenses / baseMetrics.expenses) - 1) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{Math.round(projectedMetrics.roi)}%</span>
                      <span className={`text-xs ${projectedMetrics.roi > baseMetrics.roi ? 'text-success' : 'text-destructive'}`}>
                        {projectedMetrics.roi > baseMetrics.roi ? '+' : ''}
                        {Math.round(projectedMetrics.roi - baseMetrics.roi)} pts
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Current Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Visits</span>
                    <span className="font-medium">{baseMetrics.dailyVisits.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Revenue</span>
                    <span className="font-medium">${baseMetrics.revenue.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Expenses</span>
                    <span className="font-medium">${baseMetrics.expenses.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-medium">{baseMetrics.roi}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Outcome Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    {projectedMetrics.roi > baseMetrics.roi
                      ? `This scenario is projected to improve your ROI by ${Math.round(projectedMetrics.roi - baseMetrics.roi)} percentage points.`
                      : `This scenario may reduce your ROI by ${Math.round(baseMetrics.roi - projectedMetrics.roi)} percentage points.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CardFooter className="px-0 pt-2 justify-end">
          <Button size="sm" onClick={handleSaveScenario}>
            <Save className="h-4 w-4 mr-2" />
            Save Scenario
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
