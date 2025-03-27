
import { useState } from 'react';
import { BarChart3, ArrowRight, Info, ExternalLink, BarChart4, Clock, Percent, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ScriptVariant {
  id: string;
  name: string;
  type: 'control' | 'variant';
  trafficPercentage: number;
  metrics: {
    impressions: number;
    visits: number;
    acceptanceRate: number;
    revenue: number;
    loadTime: number;
  };
}

export function ScriptABTesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const { toast } = useToast();
  
  const [variants, setVariants] = useState<ScriptVariant[]>([
    {
      id: '1',
      name: 'Original Script',
      type: 'control',
      trafficPercentage: 50,
      metrics: {
        impressions: 4782,
        visits: 5634,
        acceptanceRate: 84.9,
        revenue: 2.14,
        loadTime: 0.76
      }
    },
    {
      id: '2',
      name: 'Fast Redirect',
      type: 'variant',
      trafficPercentage: 50,
      metrics: {
        impressions: 5021,
        visits: 5728,
        acceptanceRate: 87.7,
        revenue: 2.41,
        loadTime: 0.68
      }
    }
  ]);

  const handleTypeChange = (variantId: string, type: 'control' | 'variant') => {
    if (type === 'control') {
      // If setting this as control, make sure all others are variants
      setVariants(prev => prev.map(v => ({
        ...v,
        type: v.id === variantId ? 'control' : 'variant'
      })));
    } else {
      // Make sure there's at least one control
      const hasOtherControl = variants.some(v => v.id !== variantId && v.type === 'control');
      if (!hasOtherControl) {
        toast({
          title: "Control Required",
          description: "At least one script must be designated as a control.",
          variant: "destructive",
        });
        return;
      }
      
      // Set this one as variant
      setVariants(prev => prev.map(v => 
        v.id === variantId ? { ...v, type } : v
      ));
    }
  };

  const handleSliderChange = (values: number[]) => {
    const controlPercentage = values[0];
    const variantPercentage = 100 - controlPercentage;
    
    setVariants(prev => prev.map(v => ({
      ...v,
      trafficPercentage: v.type === 'control' ? controlPercentage : variantPercentage
    })));
  };

  const handleStartTest = () => {
    setIsRunning(true);
    toast({
      title: "A/B Test Started",
      description: "Your script variants are now being tested.",
      duration: 3000,
    });
  };

  const handleStopTest = () => {
    setIsRunning(false);
    toast({
      title: "A/B Test Stopped",
      description: "Your test has been stopped. Results are available for review.",
      duration: 3000,
    });
  };

  const getPerformanceDiff = (metricName: keyof ScriptVariant['metrics']) => {
    const control = variants.find(v => v.type === 'control');
    const variant = variants.find(v => v.type === 'variant');
    
    if (!control || !variant) return { value: 0, isPositive: true };
    
    const controlValue = control.metrics[metricName];
    const variantValue = variant.metrics[metricName];
    
    // For load time, lower is better
    const isPositive = metricName === 'loadTime' 
      ? variantValue < controlValue 
      : variantValue > controlValue;
    
    const percentChange = ((variantValue - controlValue) / controlValue) * 100;
    
    return { 
      value: Math.abs(percentChange).toFixed(1), 
      isPositive 
    };
  };

  return (
    <Card>
      <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">A/B Testing</CardTitle>
            <CardDescription>Compare script variants to optimize performance</CardDescription>
          </div>
          <div>
            {isRunning ? (
              <Button onClick={handleStopTest} variant="destructive" size="sm">
                Stop Test
              </Button>
            ) : (
              <Button onClick={handleStartTest} size="sm">
                Start Test
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="border-b pb-4 space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Test Configuration
            </h3>
            
            {variants.map((variant, index) => (
              <div key={variant.id} className="border rounded-md p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{variant.name}</h4>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 p-0 px-2">
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Control is your baseline script. Variants are tested against the control.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <RadioGroup 
                      defaultValue={variant.type} 
                      className="flex gap-2"
                      onValueChange={(value) => handleTypeChange(variant.id, value as 'control' | 'variant')}
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem 
                          value="control" 
                          id={`control-${variant.id}`} 
                          className="h-3.5 w-3.5"
                        />
                        <Label htmlFor={`control-${variant.id}`} className="text-xs">Control</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem 
                          value="variant" 
                          id={`variant-${variant.id}`} 
                          className="h-3.5 w-3.5"
                        />
                        <Label htmlFor={`variant-${variant.id}`} className="text-xs">Variant</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {index === 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm">Traffic Split</Label>
                      <div className="text-sm">
                        Control: <span className="font-medium">{variants[0].trafficPercentage}%</span> | 
                        Variant: <span className="font-medium">{variants[1].trafficPercentage}%</span>
                      </div>
                    </div>
                    <Slider
                      value={[variants[0].trafficPercentage]}
                      onValueChange={handleSliderChange}
                      min={10}
                      max={90}
                      step={5}
                      className="my-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm flex items-center gap-1">
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
                Test Results
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="ml-1 text-xs">{showMetrics ? 'Hide' : 'Show'} Metrics</span>
              </Button>
            </div>
            
            {showMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-2">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs uppercase text-muted-foreground">Impressions</h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Control</p>
                            <p className="font-medium">{variants[0].metrics.impressions.toLocaleString()}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground my-auto" />
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground">Variant</p>
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{variants[1].metrics.impressions.toLocaleString()}</p>
                              <span 
                                className={`text-xs ${getPerformanceDiff('impressions').isPositive ? 'text-success' : 'text-destructive'}`}
                              >
                                {getPerformanceDiff('impressions').isPositive ? '+' : '-'}
                                {getPerformanceDiff('impressions').value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs uppercase text-muted-foreground">Visits</h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Control</p>
                            <p className="font-medium">{variants[0].metrics.visits.toLocaleString()}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground my-auto" />
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground">Variant</p>
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{variants[1].metrics.visits.toLocaleString()}</p>
                              <span 
                                className={`text-xs ${getPerformanceDiff('visits').isPositive ? 'text-success' : 'text-destructive'}`}
                              >
                                {getPerformanceDiff('visits').isPositive ? '+' : '-'}
                                {getPerformanceDiff('visits').value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs uppercase text-muted-foreground">
                            <span className="flex items-center gap-1">
                              Acceptance Rate
                              <Percent className="h-3 w-3" />
                            </span>
                          </h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Control</p>
                            <p className="font-medium">{variants[0].metrics.acceptanceRate}%</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground my-auto" />
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground">Variant</p>
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{variants[1].metrics.acceptanceRate}%</p>
                              <span 
                                className={`text-xs ${getPerformanceDiff('acceptanceRate').isPositive ? 'text-success' : 'text-destructive'}`}
                              >
                                {getPerformanceDiff('acceptanceRate').isPositive ? '+' : '-'}
                                {getPerformanceDiff('acceptanceRate').value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs uppercase text-muted-foreground">
                            <span className="flex items-center gap-1">
                              Revenue
                              <DollarSign className="h-3 w-3" />
                            </span>
                          </h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Control</p>
                            <p className="font-medium">${variants[0].metrics.revenue.toFixed(2)}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground my-auto" />
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground">Variant</p>
                            <div className="flex items-center gap-1">
                              <p className="font-medium">${variants[1].metrics.revenue.toFixed(2)}</p>
                              <span 
                                className={`text-xs ${getPerformanceDiff('revenue').isPositive ? 'text-success' : 'text-destructive'}`}
                              >
                                {getPerformanceDiff('revenue').isPositive ? '+' : '-'}
                                {getPerformanceDiff('revenue').value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs uppercase text-muted-foreground">
                            <span className="flex items-center gap-1">
                              Load Time
                              <Clock className="h-3 w-3" />
                            </span>
                          </h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Control</p>
                            <p className="font-medium">{variants[0].metrics.loadTime}s</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground my-auto" />
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-muted-foreground">Variant</p>
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{variants[1].metrics.loadTime}s</p>
                              <span 
                                className={`text-xs ${getPerformanceDiff('loadTime').isPositive ? 'text-success' : 'text-destructive'}`}
                              >
                                {getPerformanceDiff('loadTime').isPositive ? '-' : '+'}
                                {getPerformanceDiff('loadTime').value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">Test Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isRunning ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                          {isRunning ? 'Running' : 'Stopped'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-sm">12h 34m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Traffic Split</span>
                        <span className="text-sm">{variants[0].trafficPercentage}% / {variants[1].trafficPercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className="text-sm">94.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-success">Variant Outperforms Control</p>
                      <p className="text-xs text-muted-foreground">
                        The variant script shows a significant improvement in acceptance rate (+{getPerformanceDiff('acceptanceRate').value}%) 
                        and revenue (+{getPerformanceDiff('revenue').value}%) with faster load times.
                      </p>
                      <div className="pt-2">
                        <Button size="sm" className="w-full">
                          Make Variant the Control
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
