
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, ThumbsUp, Zap, AlertTriangle, ShieldCheck, Clock, Save, MoveHorizontal, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

export const ScriptRecommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Zap className="h-3 w-3 mr-1" /> High Impact
              </Badge>
              <Badge>98% Confidence</Badge>
            </div>
            <CardTitle className="text-lg mt-2">Increase Redirect Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Increasing the redirect delay from 30ms to 35ms could improve your acceptance rate by approximately 5-7%.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Current: 30ms</span>
                  <span>Recommended: 35ms</span>
                </div>
                <div className="relative pt-6">
                  <Slider defaultValue={[30]} max={50} step={1} />
                  <div className="absolute top-0 left-0 text-xs text-muted-foreground">
                    Too Fast
                  </div>
                  <div className="absolute top-0 right-0 text-xs text-muted-foreground">
                    Too Slow
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Predicted Acceptance Rate</span>
                  <span>+6.3%</span>
                </div>
                <Progress value={63} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Based on data from the last 7 days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Ignore</Button>
            <Button className="gap-2">
              Apply Change
              <Check className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="secondary">Medium Impact</Badge>
              <Badge>85% Confidence</Badge>
            </div>
            <CardTitle className="text-lg mt-2">Implement Mobile Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Adding mobile detection could optimize for different devices, potentially increasing CTR by 2-3% on mobile traffic.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-muted p-2 rounded text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Requires updating to advanced script template</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Predicted CTR Improvement</span>
                  <span>+2.8%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MoveHorizontal className="h-4 w-4" />
                <span>Based on competitor analysis</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Ignore</Button>
            <Button variant="secondary" className="gap-2">
              Switch to Advanced
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline">Security</Badge>
              <Badge variant="destructive">Important</Badge>
            </div>
            <CardTitle className="text-lg mt-2">Add Script Obfuscation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Adding basic script obfuscation can help protect your redirect logic from being easily copied or detected.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-success/10 p-2 rounded text-sm">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Helps avoid platform detection systems</span>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Prevent script copying</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Harder to detect</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Avoid blacklisting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Platform compliance</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Later</Button>
            <Button variant="default" className="gap-2">
              Apply Security Patch
              <ShieldCheck className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Advanced A/B Testing Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our AI has identified an opportunity to run a systematic A/B test to find your optimal delay settings. Based on current data, we recommend testing these variants:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Variant A: 25ms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Predicted CTR:</span>
                      <span className="font-medium">16.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predicted Acceptance:</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Variant B: 35ms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Predicted CTR:</span>
                      <span className="font-medium">19.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predicted Acceptance:</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Variant C: 45ms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Predicted CTR:</span>
                      <span className="font-medium">17.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predicted Acceptance:</span>
                      <span className="font-medium">96%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="gap-2">
            Create A/B Test
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
