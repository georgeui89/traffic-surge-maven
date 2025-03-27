import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  HelpCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BudgetOptimizerWizard = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(1000);
  const [platform1, setPlatform1] = useState("google");
  const [platform2, setPlatform2] = useState("facebook");
  const [allocation1, setAllocation1] = useState(50);
  const [allocation2, setAllocation2] = useState(50);
  const [cpaGoal, setCpaGoal] = useState(50);
  const [estimatedConversionRate, setEstimatedConversionRate] = useState(2);

  const totalAllocation = allocation1 + allocation2;

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
  };

  const calculatePotentialConversions = () => {
    const costPerConversion = cpaGoal;
    const totalConversions = budget / costPerConversion;
    return totalConversions;
  };

  const calculatePotentialRevenue = () => {
    const totalConversions = calculatePotentialConversions();
    const revenuePerConversion = 100;
    const totalRevenue = totalConversions * revenuePerConversion;
    return totalRevenue;
  };

  const calculatePotentialROI = () => {
    const totalRevenue = calculatePotentialRevenue();
    const roi = ((totalRevenue - budget) / budget) * 100;
    return roi;
  };

  const potentialConversions = calculatePotentialConversions();
  const potentialRevenue = calculatePotentialRevenue();
  const potentialROI = calculatePotentialROI();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calculator className="mr-2 h-4 w-4" />
          Budget Optimizer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%]">
        <DialogHeader>
          <DialogTitle>Budget Optimization Wizard</DialogTitle>
          <DialogDescription>
            Optimize your budget allocation across different platforms.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={`step-${step}`} className="space-y-4">
          <TabsList>
            <TabsTrigger value="step-1">Budget</TabsTrigger>
            <TabsTrigger value="step-2">Platforms</TabsTrigger>
            <TabsTrigger value="step-3">Goals</TabsTrigger>
            <TabsTrigger value="step-4">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="step-1">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Set Your Budget</CardTitle>
                <CardDescription>
                  Enter the total budget you want to allocate.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget">Total Budget</Label>
                  <Input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-2">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Select Platforms</CardTitle>
                <CardDescription>
                  Choose the platforms you want to allocate your budget to.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform1">Platform 1</Label>
                  <Select
                    value={platform1}
                    onValueChange={(value) => setPlatform1(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook Ads</SelectItem>
                      <SelectItem value="twitter">Twitter Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="platform2">Platform 2</Label>
                  <Select
                    value={platform2}
                    onValueChange={(value) => setPlatform2(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook Ads</SelectItem>
                      <SelectItem value="twitter">Twitter Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Allocation for {platform1}</Label>
                  <Slider
                    defaultValue={[allocation1]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAllocation1(value[0])}
                  />
                  <p>
                    {allocation1}% of the budget will be allocated to {platform1}.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Allocation for {platform2}</Label>
                  <Slider
                    defaultValue={[allocation2]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAllocation2(value[0])}
                  />
                  <p>
                    {allocation2}% of the budget will be allocated to {platform2}.
                  </p>
                </div>
                {totalAllocation !== 100 && (
                  <p className="text-red-500">
                    Total allocation must be 100%. Current total is{" "}
                    {totalAllocation}%.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-3">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Set Your Goals</CardTitle>
                <CardDescription>
                  Enter your target Cost Per Acquisition (CPA) and estimated
                  conversion rate.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cpaGoal">
                      Target Cost Per Acquisition (CPA)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The amount you're willing to spend to acquire a new
                            customer.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    type="number"
                    id="cpaGoal"
                    value={cpaGoal}
                    onChange={(e) => setCpaGoal(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="estimatedConversionRate">
                      Estimated Conversion Rate
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The percentage of visitors who convert into customers.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    type="number"
                    id="estimatedConversionRate"
                    value={estimatedConversionRate}
                    onChange={(e) =>
                      setEstimatedConversionRate(Number(e.target.value))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-4">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Results</CardTitle>
                <CardDescription>
                  Here are the potential results based on your inputs.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <Label>Potential Conversions</Label>
                  </div>
                  <Input
                    type="text"
                    value={potentialConversions.toFixed(2)}
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <Label>Potential Revenue</Label>
                  </div>
                  <Input
                    type="text"
                    value={potentialRevenue.toFixed(2)}
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  {potentialROI > 0 ? (
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <Label>Potential ROI</Label>
                  <Input type="text" value={potentialROI.toFixed(2)} readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} disabled={totalAllocation !== 100}>
              Next
            </Button>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetOptimizerWizard;
