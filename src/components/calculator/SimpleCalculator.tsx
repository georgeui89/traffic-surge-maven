
import React, { useState, useEffect } from 'react';
import { Calculator, Percent, DollarSign, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlatformData, calculateCreditsForRevenue, calculateRevenueFromCredits } from '@/utils/cpmCalculatorUtils';
import { PlatformSelector } from './PlatformSelector';

interface SimpleCalculatorProps {
  platforms: PlatformData[];
  togglePlatform: (platformId: string) => void;
}

export const SimpleCalculator: React.FC<SimpleCalculatorProps> = ({ platforms, togglePlatform }) => {
  const [calculationMode, setCalculationMode] = useState<'revenue' | 'credits'>('credits');
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [customRate, setCustomRate] = useState<boolean>(false);
  const [cpmRate, setCpmRate] = useState<number>(0.5);
  const [secondsPerVisit, setSecondsPerVisit] = useState<number>(30);
  const [acceptanceRate, setAcceptanceRate] = useState<number>(40);
  const [targetImpressions, setTargetImpressions] = useState<number>(10000);
  const [availableCredits, setAvailableCredits] = useState<number>(1000);
  const [revenueGoal, setRevenueGoal] = useState<number>(50);

  // Results
  const [requiredCredits, setRequiredCredits] = useState<number>(0);
  const [targetRevenue, setTargetRevenue] = useState<number>(0);
  const [validImpressions, setValidImpressions] = useState<number>(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(0);
  
  // Set initial platform when component loads
  useEffect(() => {
    if (platforms.length > 0 && !selectedPlatform) {
      setSelectedPlatform(platforms[0].name);
      const platform = platforms[0];
      setCpmRate(platform.cpm);
      setSecondsPerVisit(platform.visitDuration);
      setAcceptanceRate(platform.acceptanceRate);
    }
  }, [platforms, selectedPlatform]);

  // Update settings when platform changes
  useEffect(() => {
    if (!selectedPlatform) return;
    
    const platform = platforms.find(p => p.name === selectedPlatform);
    if (platform && !customRate) {
      setCpmRate(platform.cpm);
      setSecondsPerVisit(platform.visitDuration);
      setAcceptanceRate(platform.acceptanceRate);
    }
  }, [selectedPlatform, platforms, customRate]);

  // Calculate results
  useEffect(() => {
    if (!selectedPlatform) return;
    
    if (calculationMode === 'credits') {
      // Calculate credits needed for revenue goal
      const result = calculateCreditsForRevenue(selectedPlatform, revenueGoal);
      setRequiredCredits(result.creditsNeeded);
      setTargetRevenue(result.revenueGoal);
    } else {
      // Calculate revenue from available credits
      const result = calculateRevenueFromCredits(selectedPlatform, availableCredits);
      setValidImpressions(result.validImpressions);
      setEstimatedRevenue(result.estimatedRevenue);
    }
  }, [
    calculationMode,
    selectedPlatform,
    cpmRate,
    secondsPerVisit,
    acceptanceRate,
    targetImpressions,
    availableCredits,
    revenueGoal
  ]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <Tabs 
        value={calculationMode} 
        onValueChange={(value) => setCalculationMode(value as 'revenue' | 'credits')} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Calculate Revenue</TabsTrigger>
          <TabsTrigger value="credits">Calculate Credits</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Platform Selection */}
          <PlatformSelector
            platforms={platforms}
            togglePlatform={togglePlatform}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            singlePlatformMode={true}
          />
          
          {/* CPM Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="cpm-rate">CPM Rate ($)</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-rate" className="text-sm">Custom Rate</Label>
                <Switch
                  id="custom-rate"
                  checked={customRate}
                  onCheckedChange={setCustomRate}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpm-rate"
                type="number"
                min="0.01"
                step="0.01"
                value={cpmRate}
                onChange={(e) => setCpmRate(Number(e.target.value))}
                disabled={!customRate}
                className={`pl-9 ${!customRate ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>
          
          {/* Target Input */}
          {calculationMode === 'revenue' ? (
            <div className="space-y-2">
              <Label htmlFor="available-credits">Available Credits</Label>
              <Input
                id="available-credits"
                type="number"
                min="1"
                step="1"
                value={availableCredits}
                onChange={(e) => setAvailableCredits(Number(e.target.value))}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="revenue-goal">Revenue Goal ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="revenue-goal"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={revenueGoal}
                  onChange={(e) => setRevenueGoal(Number(e.target.value))}
                  className="pl-9"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Seconds Per Visit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="seconds-per-visit">Seconds Per Visit</Label>
              <span className="text-sm">{secondsPerVisit}s</span>
            </div>
            <Slider
              id="seconds-per-visit"
              min={5}
              max={60}
              step={1}
              value={[secondsPerVisit]}
              onValueChange={([value]) => setSecondsPerVisit(value)}
              className="cursor-pointer"
            />
          </div>
          
          {/* Acceptance Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="acceptance-rate">Acceptance Rate</Label>
              <span className="text-sm">{acceptanceRate}%</span>
            </div>
            <Slider
              id="acceptance-rate"
              min={10}
              max={90}
              step={1}
              value={[acceptanceRate]}
              onValueChange={([value]) => setAcceptanceRate(value)}
              className="cursor-pointer"
            />
          </div>
          
          <Alert className="bg-muted/20 border-0">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {calculationMode === 'credits' ? 
                "These settings determine how many credits you'll need to achieve your impression and revenue targets." :
                "These settings help estimate how many of your credits will convert to valid impressions, impacting revenue."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card className="bg-muted/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {calculationMode === 'credits' ? 'Required Credits' : 'Expected Valid Impressions'}
              </h3>
              <p className="text-3xl font-bold">
                {calculationMode === 'credits' 
                  ? Math.ceil(requiredCredits).toLocaleString() 
                  : Math.ceil(validImpressions).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {calculationMode === 'credits' ? 'Target Revenue' : 'Estimated Revenue'}
              </h3>
              <p className="text-3xl font-bold text-green-500">
                ${calculationMode === 'credits' 
                  ? targetRevenue.toFixed(2) 
                  : estimatedRevenue.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
