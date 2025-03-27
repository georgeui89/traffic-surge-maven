import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, PauseCircle, Plus, Settings, Zap, 
  Clock, FileCog, Activity, AlertTriangle, 
  BadgePlus, Rocket, Bot, Cpu, Sparkles, 
  Star, Info, Loader2
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AutomationRule } from '@/components/automation/AutomationRule';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

const Automation = () => {
  const { toast } = useToast();
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiLearningProgress, setAiLearningProgress] = useState(0);
  const [rules, setRules] = useState({
    budgetOptimization: false,
    timeScheduling: false,
    performanceScale: false,
    errorHandling: false,
  });
  
  const [budgetSlider, setBudgetSlider] = useState([50]); 
  const [aiRecommendation, setAiRecommendation] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    confidenceThreshold: 70,
    maxBudgetChange: 30,
    learningRate: 50,
    errorTolerance: 40,
  });
  
  useEffect(() => {
    let interval: number;
    
    if (autopilotEnabled && aiLearningProgress < 100) {
      interval = window.setInterval(() => {
        setAiLearningProgress(prev => {
          const increase = Math.random() * 5;
          return prev + increase > 100 ? 100 : prev + increase;
        });
      }, 800);
    }
    
    return () => clearInterval(interval);
  }, [autopilotEnabled, aiLearningProgress]);
  
  useEffect(() => {
    if (!autopilotEnabled) {
      setAiLearningProgress(0);
    }
  }, [autopilotEnabled]);
  
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
    
    if (enabled) {
      setAiProcessing(true);
      
      setTimeout(() => {
        setAiProcessing(false);
        
        toast({
          title: "AI Autopilot Enabled",
          description: "AI-powered automation is now optimizing your campaigns, budgets, and traffic.",
          duration: 4000,
        });
      }, 2500);
    } else {
      toast({
        title: "AI Autopilot Disabled",
        description: "AI-powered automation has been disabled.",
        duration: 3000,
      });
    }
  };

  const dismissRecommendation = () => {
    setAiRecommendation(false);
  };
  
  const applyRecommendation = () => {
    setAiProcessing(true);
    
    setTimeout(() => {
      setAiProcessing(false);
      setAiRecommendation(false);
      
      toast({
        title: "Recommendation Applied",
        description: "Budget redistributed from Hitleap to 9Hits. Estimated ROI improvement: 15%",
        duration: 4000,
      });
    }, 2000);
  };
  
  const handleModeChange = (mode: 'conservative' | 'balanced' | 'aggressive') => {
    setSelectedMode(mode);
    
    if (mode === 'conservative') {
      setBudgetSlider([25]);
      setAdvancedSettings({
        confidenceThreshold: 85,
        maxBudgetChange: 15,
        learningRate: 30,
        errorTolerance: 20,
      });
    } else if (mode === 'balanced') {
      setBudgetSlider([50]);
      setAdvancedSettings({
        confidenceThreshold: 70,
        maxBudgetChange: 30,
        learningRate: 50,
        errorTolerance: 40,
      });
    } else {
      setBudgetSlider([75]);
      setAdvancedSettings({
        confidenceThreshold: 55,
        maxBudgetChange: 50,
        learningRate: 75,
        errorTolerance: 60,
      });
    }
    
    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Selected`,
      description: `AI will now use ${mode} optimization strategies.`,
      duration: 3000,
    });
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
          <TabsTrigger value="scaling" className="transition-all duration-200">Performance Scaling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="mt-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutomationRule
              title="Budget Optimization"
              description="Automatically adjust budget allocation based on platform performance."
              icon={<BarChartIcon />}
              initialEnabled={rules.budgetOptimization}
              onToggle={(enabled) => handleRuleToggle('budgetOptimization', enabled)}
            />
            
            <AutomationRule
              title="Time Scheduling"
              description="Schedule traffic campaigns to run during high-performing times."
              icon={<Clock />}
              initialEnabled={rules.timeScheduling}
              onToggle={(enabled) => handleRuleToggle('timeScheduling', enabled)}
            />
            
            <AutomationRule
              title="Performance-Based Scaling"
              description="Scale RDPs up or down based on traffic quality and earnings."
              icon={<Zap />}
              initialEnabled={rules.performanceScale}
              onToggle={(enabled) => handleRuleToggle('performanceScale', enabled)}
            />
            
            <AutomationRule
              title="Error Handling & Recovery"
              description="Automatically detect and resolve issues with platforms or RDPs."
              icon={<AlertTriangleIcon />}
              initialEnabled={rules.errorHandling}
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
                  id="autopilot-toggle"
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
                  disabled={!autopilotEnabled || aiProcessing}
                  value={budgetSlider}
                  onValueChange={setBudgetSlider}
                  max={100}
                  step={5}
                  className="transition-opacity duration-300"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Button 
                    variant={selectedMode === 'conservative' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => handleModeChange('conservative')}
                    disabled={!autopilotEnabled || aiProcessing}
                    className="gap-1 h-auto py-1"
                  >
                    Conservative
                  </Button>
                  <Button 
                    variant={selectedMode === 'balanced' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => handleModeChange('balanced')}
                    disabled={!autopilotEnabled || aiProcessing}
                    className="gap-1 h-auto py-1"
                  >
                    Balanced
                  </Button>
                  <Button 
                    variant={selectedMode === 'aggressive' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => handleModeChange('aggressive')}
                    disabled={!autopilotEnabled || aiProcessing}
                    className="gap-1 h-auto py-1"
                  >
                    Aggressive
                  </Button>
                </div>
              </div>
              
              {autopilotEnabled && aiLearningProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Learning Progress</span>
                    <span>{Math.round(aiLearningProgress)}%</span>
                  </div>
                  <Progress value={aiLearningProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">AI is analyzing your traffic patterns and campaign performance to optimize operations.</p>
                </div>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    disabled={!autopilotEnabled || aiProcessing}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    Advanced AI Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced AI Settings</DialogTitle>
                    <DialogDescription>
                      Fine-tune AI behavior and optimization parameters.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                        <span className="text-sm">{advancedSettings.confidenceThreshold}%</span>
                      </div>
                      <Slider
                        id="confidence-threshold"
                        value={[advancedSettings.confidenceThreshold]}
                        onValueChange={(value) => setAdvancedSettings({...advancedSettings, confidenceThreshold: value[0]})}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">Minimum confidence level required before AI takes action.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="max-budget-change">Maximum Budget Change</Label>
                        <span className="text-sm">{advancedSettings.maxBudgetChange}%</span>
                      </div>
                      <Slider
                        id="max-budget-change"
                        value={[advancedSettings.maxBudgetChange]}
                        onValueChange={(value) => setAdvancedSettings({...advancedSettings, maxBudgetChange: value[0]})}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">Maximum percent change AI can make to budgets at once.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="learning-rate">Learning Rate</Label>
                        <span className="text-sm">{advancedSettings.learningRate}%</span>
                      </div>
                      <Slider
                        id="learning-rate"
                        value={[advancedSettings.learningRate]}
                        onValueChange={(value) => setAdvancedSettings({...advancedSettings, learningRate: value[0]})}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">How quickly AI adapts to new patterns.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="error-tolerance">Error Tolerance</Label>
                        <span className="text-sm">{advancedSettings.errorTolerance}%</span>
                      </div>
                      <Slider
                        id="error-tolerance"
                        value={[advancedSettings.errorTolerance]}
                        onValueChange={(value) => setAdvancedSettings({...advancedSettings, errorTolerance: value[0]})}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">Tolerance for prediction errors before strategy changes.</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {aiRecommendation && (
                <Alert className="bg-primary/5 border-primary/20 transition-all duration-300 hover:bg-primary/10">
                  <BotIcon className="h-5 w-5 text-primary" />
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <AlertTitle className="flex items-center gap-2">
                        AI Recommendation
                        {aiProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                      </AlertTitle>
                      <AlertDescription>
                        Based on your current traffic patterns, I recommend redistributing budget from Hitleap to 9Hits to improve ROI by approximately 15%.
                      </AlertDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={dismissRecommendation}
                        disabled={aiProcessing}
                        className="mt-1"
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={applyRecommendation}
                        disabled={aiProcessing}
                        className="mt-1"
                        id="apply-recommendation"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                className="transition-all duration-200 hover:bg-primary/10"
                disabled={!autopilotEnabled || aiProcessing}
              >
                View AI Insights
              </Button>
              <Button 
                disabled={!autopilotEnabled || aiProcessing}
                className="transition-all duration-200"
                id="apply-all-recommendations"
              >
                {aiProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Apply All Recommendations
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scaling" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Performance-Based Scaling</CardTitle>
              <CardDescription>
                Automatically scale your resources based on performance metrics and traffic quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Traffic-Based Scaling</h3>
                    <Switch id="traffic-scaling" defaultChecked />
                  </div>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Scale Up Conditions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="traffic-threshold" className="text-xs">Traffic Quality</Label>
                          <Select defaultValue="75">
                            <SelectTrigger id="traffic-threshold">
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50">Above 50%</SelectItem>
                              <SelectItem value="75">Above 75%</SelectItem>
                              <SelectItem value="90">Above 90%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration-threshold" className="text-xs">Duration</Label>
                          <Select defaultValue="30">
                            <SelectTrigger id="duration-threshold">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Scale Down Conditions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="traffic-low-threshold" className="text-xs">Traffic Quality</Label>
                          <Select defaultValue="40">
                            <SelectTrigger id="traffic-low-threshold">
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">Below 25%</SelectItem>
                              <SelectItem value="40">Below 40%</SelectItem>
                              <SelectItem value="50">Below 50%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration-low-threshold" className="text-xs">Duration</Label>
                          <Select defaultValue="45">
                            <SelectTrigger id="duration-low-threshold">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Earnings-Based Scaling</h3>
                    <Switch id="earnings-scaling" defaultChecked />
                  </div>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Scale Up Conditions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="earnings-threshold" className="text-xs">ROI Increase</Label>
                          <Select defaultValue="15">
                            <SelectTrigger id="earnings-threshold">
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">Above 10%</SelectItem>
                              <SelectItem value="15">Above 15%</SelectItem>
                              <SelectItem value="20">Above 20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="earnings-duration" className="text-xs">Duration</Label>
                          <Select defaultValue="2">
                            <SelectTrigger id="earnings-duration">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Scale Down Conditions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="earnings-low-threshold" className="text-xs">ROI Decrease</Label>
                          <Select defaultValue="10">
                            <SelectTrigger id="earnings-low-threshold">
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">Below -5%</SelectItem>
                              <SelectItem value="10">Below -10%</SelectItem>
                              <SelectItem value="15">Below -15%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="earnings-low-duration" className="text-xs">Duration</Label>
                          <Select defaultValue="3">
                            <SelectTrigger id="earnings-low-duration">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="3">3 hours</SelectItem>
                              <SelectItem value="6">6 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Resource Allocation Strategy</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 justify-start gap-2">
                    <StarIcon className="h-4 w-4 text-warning" />
                    Prioritize High Performers
                  </Button>
                  <Button variant="outline" className="flex-1 justify-start gap-2">
                    <ZapIcon className="h-4 w-4 text-success" />
                    Balance Resources
                  </Button>
                  <Button variant="secondary" className="flex-1 justify-start gap-2">
                    <BrainIcon className="h-4 w-4 text-primary" />
                    AI Optimization
                  </Button>
                </div>
              </div>
              
              <Alert>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5" />
                  <div className="space-y-1">
                    <AlertTitle className="text-sm font-medium">Intelligent Scaling Active</AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground">
                      The system will automatically adjust resources based on performance metrics and traffic quality. AI monitoring is constantly analyzing patterns for optimal scaling decisions.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button id="save-scaling-settings">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
