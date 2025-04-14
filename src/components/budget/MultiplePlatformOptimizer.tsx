
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Zap, Activity, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Platform, calculateExpectedResults } from '@/utils/budgetUtils';

interface PlatformOptimizationResult {
  name: string;
  recommendedRevenue: number;
  requiredCredits: number;
  cpm: number;
  acceptanceRate: number;
  costPerVisit: number;
  secondsPerVisit: number;
  percentage: number;
}

interface MultiplePlatformOptimizerProps {
  initialPlatforms: Platform[];
}

export function MultiplePlatformOptimizer({ initialPlatforms }: MultiplePlatformOptimizerProps) {
  const { toast } = useToast();
  const [totalTargetRevenue, setTotalTargetRevenue] = useState(100);
  const [platforms, setPlatforms] = useState(initialPlatforms.map(p => ({ 
    ...p,
    selected: true,
    secondsPerVisit: 30
  })));
  const [secondsPerVisit, setSecondsPerVisit] = useState(30);
  const [acceptanceRate, setAcceptanceRate] = useState(40);
  const [optimizerResults, setOptimizerResults] = useState<{
    totalCredits: number;
    platforms: PlatformOptimizationResult[];
  } | null>(null);
  const [optimizationTarget, setOptimizationTarget] = useState<'credits' | 'roi'>('credits');
  
  const togglePlatformSelection = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, selected: !p.selected } : p
    ));
  };
  
  const updatePlatformProperty = (platformId: string, property: string, value: number) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, [property]: value } : p
    ));
  };

  const calculateOptimizedDistribution = () => {
    // Check if at least one platform is selected
    const selectedPlatforms = platforms.filter(p => p.selected);
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform for optimization.",
        duration: 3000,
      });
      return;
    }
    
    // Sort platforms by efficiency based on optimization target
    const sortedPlatforms = [...selectedPlatforms].sort((a, b) => {
      if (optimizationTarget === 'credits') {
        // For credit optimization, we want the most impressions per credit
        const efficiencyA = (a.acceptanceRate / 100) / (a.costPerVisit * a.secondsPerVisit);
        const efficiencyB = (b.acceptanceRate / 100) / (b.costPerVisit * b.secondsPerVisit);
        return efficiencyB - efficiencyA; // Descending order, best first
      } else {
        // For ROI optimization, we want the best revenue/cost ratio
        const revenuePerCreditA = ((a.acceptanceRate / 100) * a.cpm / 1000) / 
                                  (a.costPerVisit * a.secondsPerVisit);
        const revenuePerCreditB = ((b.acceptanceRate / 100) * b.cpm / 1000) / 
                                  (b.costPerVisit * b.secondsPerVisit);
        return revenuePerCreditB - revenuePerCreditA;
      }
    });
    
    // Calculate efficiency metrics for distributing revenue
    let totalEfficiency = 0;
    const platformEfficiencies = sortedPlatforms.map(p => {
      // Calculate how efficient each platform is at generating revenue
      const efficiency = ((p.acceptanceRate / 100) * p.cpm / 1000) / 
                        (p.costPerVisit * (p.secondsPerVisit || secondsPerVisit));
      totalEfficiency += efficiency;
      return {
        ...p,
        efficiency
      };
    });
    
    // Distribute revenue proportionally based on efficiency
    let totalAllocatedRevenue = 0;
    let totalCredits = 0;
    
    const distributedPlatforms = platformEfficiencies.map(p => {
      // Calculate revenue allocation based on relative efficiency
      const revenueShare = p.efficiency / totalEfficiency * totalTargetRevenue;
      const roundedRevenue = Math.min(
        Math.round(revenueShare * 100) / 100,
        totalTargetRevenue - totalAllocatedRevenue
      );
      
      // Calculate required impressions for this revenue
      const requiredImpressions = (roundedRevenue / p.cpm) * 1000;
      
      // Calculate visits needed based on acceptance rate
      const visitsNeeded = requiredImpressions / (p.acceptanceRate / 100);
      
      // Calculate credits needed
      const creditsRequired = visitsNeeded * (p.secondsPerVisit || secondsPerVisit);
      
      totalAllocatedRevenue += roundedRevenue;
      totalCredits += creditsRequired;
      
      return {
        name: p.name,
        recommendedRevenue: roundedRevenue,
        requiredCredits: creditsRequired,
        cpm: p.cpm,
        acceptanceRate: p.acceptanceRate,
        costPerVisit: p.costPerVisit,
        secondsPerVisit: p.secondsPerVisit || secondsPerVisit,
        percentage: (roundedRevenue / totalTargetRevenue) * 100
      };
    });
    
    setOptimizerResults({
      totalCredits,
      platforms: distributedPlatforms
    });
    
    toast({
      title: "Optimization Complete",
      description: `Revenue allocation optimized across ${selectedPlatforms.length} platforms.`,
      duration: 3000,
    });
  };
  
  // Run optimizer when relevant inputs change
  useEffect(() => {
    if (platforms.filter(p => p.selected).length > 0) {
      calculateOptimizedDistribution();
    }
  }, [optimizationTarget]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Select Platforms for Optimization</Label>
            <div className="grid gap-2 border rounded-md p-3 max-h-[300px] overflow-y-auto">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`platform-${platform.id}`}
                    checked={platform.selected}
                    onCheckedChange={() => togglePlatformSelection(platform.id)}
                  />
                  <Label 
                    htmlFor={`platform-${platform.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {platform.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    ${platform.cpm.toFixed(2)} CPM
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="target-revenue">Total Target Revenue ($)</Label>
            <div className="relative mt-1.5">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="target-revenue"
                type="number"
                step="1"
                min="1"
                className="pl-10"
                value={totalTargetRevenue}
                onChange={(e) => setTotalTargetRevenue(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="optimization-target">Optimization Target</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={optimizationTarget === 'credits' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setOptimizationTarget('credits')}
                className="flex-grow"
              >
                Minimize Credits
              </Button>
              <Button 
                variant={optimizationTarget === 'roi' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setOptimizationTarget('roi')}
                className="flex-grow"
              >
                Maximize ROI
              </Button>
            </div>
          </div>
          
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              The multi-platform optimizer distributes your target revenue across selected platforms to efficiently use your credits based on the selected optimization target.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seconds-per-visit">Default Seconds Per Visit</Label>
              <span className="text-sm text-muted-foreground">{secondsPerVisit}s</span>
            </div>
            <Slider
              id="seconds-per-visit"
              min={5}
              max={60}
              step={1}
              value={[secondsPerVisit]}
              onValueChange={(value) => setSecondsPerVisit(value[0])}
              className="mt-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="acceptance-rate">Default Acceptance Rate</Label>
              <span className="text-sm text-muted-foreground">{acceptanceRate}%</span>
            </div>
            <Slider
              id="acceptance-rate"
              min={10}
              max={100}
              step={1}
              value={[acceptanceRate]}
              onValueChange={(value) => setAcceptanceRate(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              These defaults are used when platform-specific values are not available
            </p>
          </div>
          
          <div className="p-3 rounded-md border border-border bg-muted/30">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Platform Parameters
            </h4>
            <div className="space-y-4 max-h-[200px] overflow-y-auto">
              {platforms.filter(p => p.selected).map((platform) => (
                <div key={platform.id} className="space-y-1">
                  <Label className="text-xs">{platform.name} - Seconds per visit</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={5}
                      max={60}
                      step={1}
                      value={[platform.secondsPerVisit || secondsPerVisit]}
                      onValueChange={(value) => updatePlatformProperty(platform.id, 'secondsPerVisit', value[0])}
                      className="flex-grow"
                    />
                    <span className="text-xs w-8 text-right">{platform.secondsPerVisit || secondsPerVisit}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={calculateOptimizedDistribution}
          >
            <Zap className="h-4 w-4 mr-2" />
            Optimize Revenue Distribution
          </Button>
        </div>
      </div>
      
      {optimizerResults && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Optimization Results</h3>
            <Badge variant="outline" className="bg-green-50">
              {optimizationTarget === 'credits' ? 'Credit-Optimized' : 'ROI-Optimized'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Target Revenue</p>
              <p className="text-xl font-bold">${totalTargetRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Total Required Credits</p>
              <p className="text-xl font-bold">{Math.round(optimizerResults.totalCredits).toLocaleString()}</p>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">CPM</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimizerResults.platforms.map((platform) => (
                <TableRow key={platform.name}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell className="text-right">${platform.cpm.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${platform.recommendedRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{Math.round(platform.requiredCredits).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{platform.percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
