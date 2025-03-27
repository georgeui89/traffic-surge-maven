
import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, HelpCircle, Wand2, BarChart4 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';

interface BudgetOptimizerWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BudgetOptimizerWizard({ isOpen, onClose }: BudgetOptimizerWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dailyBudget: 20,
    optimizationTarget: 'roi',
    budgetAllocation: 'automatic',
    maxPlatformShare: 50,
    includeRdpCosts: true,
    optimizationStrategy: 'balanced',
    activePlatforms: ['9hits', 'hitleap', 'otohits']
  });
  
  const { toast } = useToast();
  
  const totalSteps = 3;
  
  const handleChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNext = () => {
    if (step === 1) {
      if (formData.dailyBudget <= 0) {
        toast({
          title: "Invalid Budget",
          description: "Please enter a valid daily budget amount.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = () => {
    toast({
      title: "Budget Optimizer Configured",
      description: "Your budget optimization settings have been saved.",
      duration: 3000,
    });
    
    onClose();
    setStep(1);
  };
  
  const togglePlatform = (platform: string) => {
    if (formData.activePlatforms.includes(platform)) {
      handleChange('activePlatforms', formData.activePlatforms.filter(p => p !== platform));
    } else {
      handleChange('activePlatforms', [...formData.activePlatforms, platform]);
    }
  };
  
  const platforms = [
    { id: '9hits', name: '9Hits', avgROI: 175 },
    { id: 'hitleap', name: 'HitLeap', avgROI: 145 },
    { id: 'otohits', name: 'Otohits', avgROI: 162 },
    { id: 'bighits4u', name: 'BigHits4U', avgROI: 137 },
    { id: 'webhitnet', name: 'Webhit.net', avgROI: 128 }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Budget Optimizer Setup - Step {step} of {totalSteps}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Set your daily budget and optimization targets"}
            {step === 2 && "Configure platform allocation and constraints"}
            {step === 3 && "Review optimization strategy and preview results"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <div className={`h-1 w-10 ${index < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  index + 1 === step 
                    ? 'bg-primary text-primary-foreground'
                    : index + 1 < step
                      ? 'bg-primary/10 text-primary border border-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1 < step ? <Check className="h-4 w-4" /> : index + 1}
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="daily-budget">Daily Budget ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Total amount to spend daily across all platforms.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="daily-budget"
                  type="number"
                  value={formData.dailyBudget}
                  onChange={(e) => handleChange('dailyBudget', parseFloat(e.target.value))}
                  min="1"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  This is the maximum amount that will be allocated across platforms
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Optimization Target</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">What metric should the optimizer prioritize?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <RadioGroup
                  value={formData.optimizationTarget}
                  onValueChange={(value) => handleChange('optimizationTarget', value)}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                  <div>
                    <RadioGroupItem
                      value="roi"
                      id="target-roi"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="target-roi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <BarChart4 className="mb-3 h-6 w-6" />
                      <span className="text-center">ROI</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="visits"
                      id="target-visits"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="target-visits"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <BarChart4 className="mb-3 h-6 w-6" />
                      <span className="text-center">Visits</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="revenue"
                      id="target-revenue"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="target-revenue"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <BarChart4 className="mb-3 h-6 w-6" />
                      <span className="text-center">Revenue</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="include-rdp-costs">Include RDP Costs in Calculations</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Factor in your RDP costs when calculating ROI and profitability.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select 
                  value={formData.includeRdpCosts ? "yes" : "no"} 
                  onValueChange={(value) => handleChange('includeRdpCosts', value === "yes")}
                >
                  <SelectTrigger id="include-rdp-costs">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, include RDP costs</SelectItem>
                    <SelectItem value="no">No, calculate traffic costs only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="budget-allocation">Budget Allocation Method</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">How should the budget be distributed across platforms?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  id="budget-allocation"
                  value={formData.budgetAllocation}
                  onValueChange={(value) => handleChange('budgetAllocation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select allocation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">AI-Optimized (Recommended)</SelectItem>
                    <SelectItem value="proportional">Based on Historical Performance</SelectItem>
                    <SelectItem value="equal">Equal Distribution</SelectItem>
                    <SelectItem value="manual">Manual Allocation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="max-platform-share">Maximum Platform Share (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Maximum percentage of budget that can be allocated to a single platform.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="max-platform-share"
                  type="number"
                  value={formData.maxPlatformShare}
                  onChange={(e) => handleChange('maxPlatformShare', parseFloat(e.target.value))}
                  min="1"
                  max="100"
                  step="1"
                />
                <p className="text-sm text-muted-foreground">
                  Prevents over-reliance on a single traffic source
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Active Platforms</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select platforms to include in budget optimization
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {platforms.map(platform => (
                    <div 
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-3 rounded-md border ${
                        formData.activePlatforms.includes(platform.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      } cursor-pointer hover:bg-accent transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            {platform.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">Avg ROI: {platform.avgROI}%</p>
                          </div>
                        </div>
                        {formData.activePlatforms.includes(platform.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="optimization-strategy">Optimization Strategy</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Defines how aggressive the optimizer should be in reallocating your budget.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  id="optimization-strategy"
                  value={formData.optimizationStrategy}
                  onValueChange={(value) => handleChange('optimizationStrategy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select optimization strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (Slow Changes)</SelectItem>
                    <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (Fast Adaptation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium text-lg">Optimization Preview</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Budget</p>
                        <p className="text-xl font-medium">${formData.dailyBudget.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Optimizing For</p>
                        <p className="text-xl font-medium capitalize">{formData.optimizationTarget}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Platforms</p>
                        <p className="text-xl font-medium">{formData.activePlatforms.length}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated ROI</p>
                        <p className="text-xl font-medium text-success">+152%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Initial Budget Distribution</p>
                      
                      <div className="space-y-2">
                        {formData.activePlatforms.map((platformId, index) => {
                          const platform = platforms.find(p => p.id === platformId);
                          if (!platform) return null;
                          
                          // Calculate a simple distribution for display
                          let percentage = 0;
                          if (formData.budgetAllocation === 'equal') {
                            percentage = 100 / formData.activePlatforms.length;
                          } else {
                            // Simple weighted allocation based on ROI for demo purposes
                            const totalROI = formData.activePlatforms.reduce((sum, pid) => 
                              sum + (platforms.find(p => p.id === pid)?.avgROI || 0), 0);
                            percentage = (platform.avgROI / totalROI) * 100;
                          }
                          
                          const amount = (formData.dailyBudget * percentage / 100).toFixed(2);
                          
                          return (
                            <div key={platform.id} className="flex items-center gap-2">
                              <div className="w-24 shrink-0 text-sm">{platform.name}</div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="w-16 shrink-0 text-sm text-right">${amount}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Wand2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your goals, the optimizer will slightly favor 9Hits and Otohits due to their higher historical ROI, while maintaining diversification across all platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            
            {step < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                <Check className="h-4 w-4 mr-2" />
                Apply Settings
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
