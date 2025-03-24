
import { useState } from 'react';
import { Robot, Zap, Clock, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

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
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-muted">
              <Icon className="h-5 w-5 text-primary" />
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
        <Button variant="outline" size="sm" disabled={!enabled}>
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
  
  const [budgetSlider, setBudgetSlider] = useState([50]); // Percentage of automation
  
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
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Automation</h1>
        <p className="page-description">Configure intelligent automation rules and strategies</p>
      </div>
      
      <Tabs defaultValue="rules" className="mb-8">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="autopilot">AI Autopilot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="mt-6">
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
        
        <TabsContent value="autopilot" className="mt-6">
          <Card>
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
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-md">
                <div className="flex items-start gap-3">
                  <Robot className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">AI Recommendation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your current traffic patterns, I recommend redistributing budget from Hitleap to 9Hits to improve ROI by approximately 15%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline">View AI Insights</Button>
              <Button disabled={!autopilotEnabled}>Apply Recommendations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
