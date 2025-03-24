
import { useState } from 'react';
import { Bot, Zap, Clock, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AutomationRule = ({ 
  title, 
  description, 
  icon: Icon,
  enabled = false,
  onToggle 
}: { 
  title: string; 
  description: string; 
  icon: any;
  enabled?: boolean;
  onToggle: (enabled: boolean) => void;
}) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md border-border/80 hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${enabled ? 'bg-primary/10' : 'bg-muted'} transition-colors duration-300`}>
              <Icon className={`h-5 w-5 ${enabled ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-300`} />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Switch 
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!enabled}
          className="transition-all duration-200 hover:bg-primary/10"
        >
          Configure
        </Button>
      </CardFooter>
    </Card>
  );
};

const Automation = () => {
  const { toast } = useToast();
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [rules, setRules] = useState({
    budgetOptimization: false,
    timeScheduling: false,
    performanceScale: false,
    errorHandling: false,
  });
  
  const [budgetSlider, setBudgetSlider] = useState([50]); 
  const [aiRecommendation, setAiRecommendation] = useState(true);
  
  const handleRuleToggle = (rule: keyof typeof rules, enabled: boolean) => {
    setRules({ ...rules, [rule]: enabled });
    toast({
      title: `Rule ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${rule} has been ${enabled ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    });
  };
  
  const handleAutopilotToggle = (enabled: boolean) => {
    setAutopilotEnabled(enabled);
    toast({
      title: `Autopilot ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `AI-powered automation has been ${enabled ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    });
  };

  const dismissRecommendation = () => {
    setAiRecommendation(false);
  };
  
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Automation</h1>
        <p className="page-description">Configure intelligent automation rules and strategies</p>
      </div>
      
      <Tabs defaultValue="rules" className="mb-8">
        <TabsList className="transition-all duration-200">
          <TabsTrigger value="rules" className="transition-all duration-200">Automation Rules</TabsTrigger>
          <TabsTrigger value="autopilot" className="transition-all duration-200">AI Autopilot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="mt-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutomationRule
              title="Budget Optimization"
              description="Automatically adjust budget allocation based on platform performance."
              icon={BarChart2}
              enabled={rules.budgetOptimization}
              onToggle={(enabled) => handleRuleToggle('budgetOptimization', enabled)}
            />
            
            <AutomationRule
              title="Time Scheduling"
              description="Schedule traffic campaigns to run during high-performing times."
              icon={Clock}
              enabled={rules.timeScheduling}
              onToggle={(enabled) => handleRuleToggle('timeScheduling', enabled)}
            />
            
            <AutomationRule
              title="Performance-Based Scaling"
              description="Scale RDPs up or down based on traffic quality and earnings."
              icon={Zap}
              enabled={rules.performanceScale}
              onToggle={(enabled) => handleRuleToggle('performanceScale', enabled)}
            />
            
            <AutomationRule
              title="Error Handling & Recovery"
              description="Automatically detect and resolve issues with platforms or RDPs."
              icon={AlertTriangle}
              enabled={rules.errorHandling}
              onToggle={(enabled) => handleRuleToggle('errorHandling', enabled)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="autopilot" className="mt-6 animate-fade-in">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">AI Autopilot Mode</CardTitle>
                  <CardDescription className="mt-2">
                    Enable AI-powered automation to optimize traffic, budgets, and RDPs without manual intervention.
                  </CardDescription>
                </div>
                <Switch 
                  checked={autopilotEnabled}
                  onCheckedChange={handleAutopilotToggle}
                  className="transition-all duration-200"
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="automation-level">Automation Level</Label>
                  <span className="text-sm font-medium">{budgetSlider[0]}%</span>
                </div>
                <Slider
                  id="automation-level"
                  disabled={!autopilotEnabled}
                  value={budgetSlider}
                  onValueChange={setBudgetSlider}
                  max={100}
                  step={5}
                  className="transition-opacity duration-300"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>
              
              {aiRecommendation && (
                <Alert className="bg-primary/5 border-primary/20 transition-all duration-300 hover:bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <AlertTitle>AI Recommendation</AlertTitle>
                      <AlertDescription>
                        Based on your current traffic patterns, I recommend redistributing budget from Hitleap to 9Hits to improve ROI by approximately 15%.
                      </AlertDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={dismissRecommendation} className="mt-1">
                      Dismiss
                    </Button>
                  </div>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                className="transition-all duration-200 hover:bg-primary/10"
              >
                View AI Insights
              </Button>
              <Button 
                disabled={!autopilotEnabled}
                className="transition-all duration-200"
              >
                Apply Recommendations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
