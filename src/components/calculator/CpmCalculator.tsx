
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Calculator, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  platformData, 
  calculateCPMStrategy,
  PlatformData
} from '@/utils/cpmCalculatorUtils';
import { PlatformSelector } from './PlatformSelector';
import { MetricsDashboard } from './MetricsDashboard';
import { PlatformResultsTable } from './PlatformResultsTable';
import { OptimizationTips } from './OptimizationTips';
import { DistributionMethodSelector } from './DistributionMethodSelector';
import { RevenueCalculator } from './RevenueCalculator';
import { SimpleCalculator } from './SimpleCalculator';
import { CpmRatesPanel } from './CpmRatesPanel';

interface CpmCalculatorProps {
  className?: string;
}

// Dashboard metrics interface
interface DashboardMetrics {
  totalVisits: number;
  validImpressions: number;
  revenue: number;
  acceptanceRate: number;
  totalCredits: number;
  timeEstimate: string;
}

// Distribution method type
type DistributionMethod = 'equal' | 'weighted' | 'optimal' | 'manual';
type CalculatorMode = 'simple' | 'advanced';

export default function CpmCalculator({ className }: CpmCalculatorProps) {
  const { toast } = useToast();
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('simple');
  const [activeTab, setActiveTab] = useState<string>('calculate-credits');
  const [revenueGoal, setRevenueGoal] = useState<number>(50);
  const [distributionMethod, setDistributionMethod] = useState<DistributionMethod>('equal');
  const [useUnevenDistribution, setUseUnevenDistribution] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  // Dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0,
    totalCredits: 0,
    timeEstimate: '0h 0m 0s'
  });

  // Previous metrics for percentage change calculation
  const [prevMetrics, setPrevMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    validImpressions: 0,
    revenue: 0,
    acceptanceRate: 0,
    totalCredits: 0,
    timeEstimate: '0h 0m 0s'
  });

  // Initial platform data
  const [platforms, setPlatforms] = useState<PlatformData[]>(
    Object.entries(platformData).map(([key, data]) => ({ 
      id: key.toLowerCase().replace('.', ''), 
      name: key, 
      enabled: true, 
      cpm: data.cpm, 
      conversionFactor: data.conversionFactor,
      visitDuration: data.visitLength,
      acceptanceRate: data.acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0,
      efficiency: data.efficiency,
      color: data.color,
      timeEstimate: '0h 0m 0s'
    }))
  );

  // Custom distribution percentages for manual distribution
  const [customDistribution, setCustomDistribution] = useState<Record<string, number>>(
    Object.entries(platformData).reduce((acc, [key, _]) => {
      acc[key] = 20; // Default to 20% per platform (adjust based on number of platforms)
      return acc;
    }, {} as Record<string, number>)
  );

  // Calculate percentage change between current and previous metrics
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Toggle platform enabled status
  const togglePlatform = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  // Update platform custom distribution percentage
  const updatePlatformDistribution = (platformName: string, value: number) => {
    setCustomDistribution(prev => ({
      ...prev,
      [platformName]: value
    }));
  };

  // Update calculations when inputs change
  useEffect(() => {
    // Store previous metrics before updating
    setPrevMetrics({ ...dashboardMetrics });
    
    const enabledPlatforms = platforms.filter(p => p.enabled);
    if (enabledPlatforms.length === 0) {
      setDashboardMetrics({
        totalVisits: 0,
        validImpressions: 0,
        revenue: 0,
        acceptanceRate: 0,
        totalCredits: 0,
        timeEstimate: '0h 0m 0s'
      });
      return;
    }

    // Convert platform objects to names for the calculation function
    const platformNames = enabledPlatforms.map(p => p.name);
    
    // Prepare custom distribution if used
    const customDistributionObject = useUnevenDistribution ? 
      enabledPlatforms.reduce((acc, platform) => {
        acc[platform.name] = customDistribution[platform.name] || 0;
        return acc;
      }, {} as Record<string, number>) :
      {};
    
    // Calculate strategy based on distribution method
    const strategy = calculateCPMStrategy(
      platformNames, 
      revenueGoal, 
      useUnevenDistribution ? 'manual' : distributionMethod,
      customDistributionObject
    );
    
    // Update platforms with calculated values
    const updatedPlatforms = platforms.map(platform => {
      const result = strategy.results.find(r => r.platform === platform.name);
      
      if (result && platform.enabled) {
        return {
          ...platform,
          creditsNeeded: result.creditsNeeded,
          visitsGenerated: result.visits,
          validImpressions: result.validImpressions,
          revenue: result.revenue,
          timeEstimate: result.timeEstimate
        };
      }
      return platform;
    });

    setPlatforms(updatedPlatforms);
    
    // Update dashboard metrics
    setDashboardMetrics({
      totalVisits: strategy.totals.visits,
      validImpressions: strategy.totals.validImpressions,
      revenue: strategy.totals.revenue,
      acceptanceRate: parseFloat(strategy.totals.acceptanceRate.toFixed(2)),
      totalCredits: strategy.totals.credits,
      timeEstimate: strategy.totals.timeEstimate
    });
  }, [
    platforms.map(p => p.enabled).join(','), 
    revenueGoal, 
    distributionMethod, 
    useUnevenDistribution, 
    JSON.stringify(customDistribution)
  ]);

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('CPM Strategy Report', 20, 20);
    
    // Add dashboard metrics
    doc.setFontSize(14);
    doc.text('Dashboard Metrics', 20, 35);
    doc.setFontSize(12);
    doc.text(`Total Revenue Goal: $${revenueGoal.toFixed(2)}`, 25, 45);
    doc.text(`Total Visits: ${Math.round(dashboardMetrics.totalVisits).toLocaleString()}`, 25, 55);
    doc.text(`Valid Impressions: ${Math.round(dashboardMetrics.validImpressions).toLocaleString()}`, 25, 65);
    doc.text(`Total Revenue: $${dashboardMetrics.revenue.toFixed(2)}`, 25, 75);
    doc.text(`Average Acceptance Rate: ${Math.round(dashboardMetrics.acceptanceRate)}%`, 25, 85);
    doc.text(`Total Credits Required: ${Math.round(dashboardMetrics.totalCredits).toLocaleString()}`, 25, 95);
    doc.text(`Estimated Time: ${dashboardMetrics.timeEstimate}`, 25, 105);
    
    // Save the PDF
    doc.save('CPM_Strategy_Report.pdf');
    
    toast({
      title: "Report Generated",
      description: "Your CPM strategy report has been downloaded.",
      duration: 3000,
    });
  };

  // Reset all settings
  const resetSettings = () => {
    setRevenueGoal(50);
    setDistributionMethod('equal');
    setUseUnevenDistribution(false);
    
    // Reset platforms to default values
    setPlatforms(Object.entries(platformData).map(([key, data]) => ({ 
      id: key.toLowerCase().replace('.', ''), 
      name: key, 
      enabled: true, 
      cpm: data.cpm, 
      conversionFactor: data.conversionFactor,
      visitDuration: data.visitLength,
      acceptanceRate: data.acceptanceRate,
      creditsNeeded: 0,
      visitsGenerated: 0,
      validImpressions: 0,
      revenue: 0,
      efficiency: data.efficiency,
      color: data.color,
      timeEstimate: '0h 0m 0s'
    })));
    
    // Reset custom distribution
    setCustomDistribution(
      Object.entries(platformData).reduce((acc, [key, _]) => {
        acc[key] = 20;
        return acc;
      }, {} as Record<string, number>)
    );
    
    toast({
      title: "Settings Reset",
      description: "All calculator settings have been reset to defaults.",
      duration: 2000,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> 
              CPM Strategy Calculator
            </CardTitle>
            <CardDescription>
              Optimize your traffic strategy by estimating revenue and required credits
            </CardDescription>
          </div>
          <Tabs defaultValue={calculatorMode} onValueChange={(value) => setCalculatorMode(value as CalculatorMode)} className="w-auto">
            <TabsList className="grid w-[250px] grid-cols-2">
              <TabsTrigger value="simple">Simple Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          <TabsContent value="simple" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SimpleCalculator platforms={platforms} togglePlatform={togglePlatform} />
              </div>
              <div>
                <CpmRatesPanel platforms={platforms} />
              </div>
            </div>
            <Separator className="my-6" />
            <OptimizationTips />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 mt-0">
            {/* Dashboard Metrics */}
            <MetricsDashboard 
              metrics={dashboardMetrics} 
              prevMetrics={prevMetrics} 
              calculatePercentageChange={calculatePercentageChange} 
            />

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calculate-credits">Plan for Revenue Goal</TabsTrigger>
                <TabsTrigger value="calculate-revenue">Calculate Revenue</TabsTrigger>
              </TabsList>
            </Tabs>

            <TabsContent value="calculate-credits" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Revenue Goal ($)</label>
                    <div className="relative">
                      <Input 
                        id="revenue-goal" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={revenueGoal}
                        onChange={(e) => setRevenueGoal(parseFloat(e.target.value) || 0)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <DistributionMethodSelector
                    distributionMethod={distributionMethod}
                    useUnevenDistribution={useUnevenDistribution}
                    setDistributionMethod={setDistributionMethod}
                    setUseUnevenDistribution={setUseUnevenDistribution}
                    platforms={platforms.filter(p => p.enabled)}
                    customDistribution={customDistribution}
                    updatePlatformDistribution={updatePlatformDistribution}
                  />
                </div>
                
                <PlatformSelector
                  platforms={platforms}
                  togglePlatform={togglePlatform}
                  selectedPlatform={selectedPlatform}
                  setSelectedPlatform={setSelectedPlatform}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">Platform Results</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetSettings}>
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
                
                <PlatformResultsTable platforms={platforms.filter(p => p.enabled)} dashboardMetrics={dashboardMetrics} />
              </div>
            </TabsContent>
            
            <TabsContent value="calculate-revenue" className="space-y-6 pt-4">
              <RevenueCalculator />
            </TabsContent>
            
            <Separator />
            
            <OptimizationTips />
          </TabsContent>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Results are estimates based on the provided inputs.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={resetSettings}>
            <Calculator className="h-4 w-4 mr-2" />
            Reset Calculation
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
