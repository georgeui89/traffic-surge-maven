
import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, HelpCircle, Calculator, PlusCircle } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CampaignSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignSetupWizard({ isOpen, onClose }: CampaignSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    platform: '',
    credits: 500,
    cpm: 0.5,
    acceptanceRate: 85,
    costPerCredit: 0.001,
    proxyCost: 0,
    otherCosts: 0,
    otherCostsDescription: '',
    dailyBudget: 5,
    targetROI: 150
  });
  
  const { toast } = useToast();
  
  const totalSteps = 4;
  
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.url || !formData.platform) {
        toast({
          title: "Required Fields",
          description: "Please fill in all required fields before continuing.",
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
      title: "Campaign Created",
      description: "Your campaign has been created successfully.",
      duration: 3000,
    });
    
    onClose();
    setStep(1);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Setup New Campaign - Step {step} of {totalSteps}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter basic campaign information"}
            {step === 2 && "Configure traffic parameters"}
            {step === 3 && "Set cost tracking options"}
            {step === 4 && "Define campaign goals"}
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
                <Label htmlFor="campaign-name">Campaign Name*</Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-url">Campaign URL*</Label>
                <Input
                  id="campaign-url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is the URL that will receive traffic
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform*</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value) => handleChange('platform', value)}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select traffic platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9hits">9Hits</SelectItem>
                    <SelectItem value="hitleap">HitLeap</SelectItem>
                    <SelectItem value="otohits">Otohits</SelectItem>
                    <SelectItem value="bighits4u">BigHits4U</SelectItem>
                    <SelectItem value="webhitnet">Webhit.net</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="credits">Credits to Allocate</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Number of credits to allocate to this campaign. Credits are used to generate traffic.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => handleChange('credits', parseFloat(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="cpm">Expected CPM ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Cost Per Mille (1000 impressions). This is the rate you expect to earn.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cpm"
                  type="number"
                  value={formData.cpm}
                  onChange={(e) => handleChange('cpm', parseFloat(e.target.value))}
                  min="0.1"
                  max="1"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="acceptance-rate">Expected Acceptance Rate (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Percentage of traffic that is likely to be accepted by ad networks. Higher rates mean better revenue.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="acceptance-rate"
                  type="number"
                  value={formData.acceptanceRate}
                  onChange={(e) => handleChange('acceptanceRate', parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="cost-per-credit">Cost Per Credit ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The cost to purchase one credit on the platform.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="cost-per-credit"
                  type="number"
                  value={formData.costPerCredit}
                  onChange={(e) => handleChange('costPerCredit', parseFloat(e.target.value))}
                  min="0"
                  step="0.0001"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="proxy-cost">Proxy Cost ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Any proxy-related costs associated with this campaign.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="proxy-cost"
                  type="number"
                  value={formData.proxyCost}
                  onChange={(e) => handleChange('proxyCost', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="other-costs">Other Costs ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Any additional costs associated with this campaign.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="other-costs"
                  type="number"
                  value={formData.otherCosts}
                  onChange={(e) => handleChange('otherCosts', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="other-costs-description">Description (Optional)</Label>
                <Input
                  id="other-costs-description"
                  placeholder="E.g., domain registration, hosting, etc."
                  value={formData.otherCostsDescription}
                  onChange={(e) => handleChange('otherCostsDescription', e.target.value)}
                />
              </div>
            </div>
          )}
          
          {step === 4 && (
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
                        <p className="max-w-xs">Maximum amount to spend daily on this campaign.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="daily-budget"
                  type="number"
                  value={formData.dailyBudget}
                  onChange={(e) => handleChange('dailyBudget', parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="target-roi">Target ROI (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Target Return on Investment. A higher percentage means higher profitability goals.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="target-roi"
                  type="number"
                  value={formData.targetROI}
                  onChange={(e) => handleChange('targetROI', parseFloat(e.target.value))}
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-medium">Projected Performance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Daily Visits</p>
                    <p className="text-xl font-medium">
                      {Math.round(formData.credits * (formData.acceptanceRate / 100))}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Daily Revenue</p>
                    <p className="text-xl font-medium text-earnings">
                      ${((formData.credits * (formData.acceptanceRate / 100) * formData.cpm) / 1000).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Daily Cost</p>
                    <p className="text-xl font-medium text-expense">
                      ${(formData.credits * formData.costPerCredit).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Est. ROI</p>
                    <p className="text-xl font-medium">
                      {Math.round(((((formData.credits * (formData.acceptanceRate / 100) * formData.cpm) / 1000) / 
                        (formData.credits * formData.costPerCredit + formData.proxyCost + formData.otherCosts)) * 100) - 100)}%
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
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
