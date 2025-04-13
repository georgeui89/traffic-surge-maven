
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Info, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { platformData, calculateRevenueFromCredits } from '@/utils/cpmCalculatorUtils';

export const RevenueCalculator: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!selectedPlatform || credits <= 0) return;
    
    const calculationResult = calculateRevenueFromCredits(selectedPlatform, credits);
    setResult(calculationResult);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue from Credits</CardTitle>
          <CardDescription>
            Calculate potential revenue based on available credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Select Platform</Label>
              <Select 
                value={selectedPlatform} 
                onValueChange={setSelectedPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(platformData).map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Available Credits</Label>
              <Input 
                id="credits" 
                type="number" 
                min="1" 
                step="1" 
                value={credits || ''} 
                onChange={(e) => setCredits(Number(e.target.value))}
                placeholder="Enter available credits"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate} 
            disabled={!selectedPlatform || credits <= 0}
            className="w-full mt-4"
          >
            Calculate Revenue
          </Button>
          
          {result && (
            <div className="mt-6 border rounded-md p-4 bg-muted/10">
              <h3 className="text-lg font-medium mb-3">Calculation Results</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="font-medium text-lg">{result.platform}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Credits Used</p>
                  <p className="font-medium text-lg">{result.availableCredits.toLocaleString()}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Visits Generated</p>
                  <p className="font-medium text-lg">{result.visitsPossible.toLocaleString()}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Valid Impressions</p>
                  <p className="font-medium text-lg">{result.validImpressions.toLocaleString()}</p>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Time Estimate</p>
                  <p className="font-medium text-lg">{result.timeEstimate}</p>
                </div>
                
                <div className="bg-primary/10 border-primary/30 border p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                  <p className="font-medium text-lg text-primary">${result.estimatedRevenue.toFixed(2)}</p>
                </div>
              </div>
              
              <Alert className="bg-muted/20">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  These calculations are based on an acceptance rate of {platformData[result.platform]?.acceptanceRate || 0}% and a CPM of ${platformData[result.platform]?.cpm.toFixed(2) || 0}.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {!result && (
            <div className="flex items-center justify-center p-10 rounded-lg bg-gradient-to-b from-muted/10 to-muted/30">
              <div className="text-center">
                <DollarSign className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Calculate Revenue</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a platform and enter your available credits to calculate potential revenue.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
