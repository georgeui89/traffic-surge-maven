
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calculator, RefreshCw } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/formatters";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Platform {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  costPerVisit: number;
  acceptanceRate: number;
  cpm: number;
}

interface WhatIfAnalysisProps {
  platforms: Platform[];
  dailyBudget: number;
  onApplyChanges: (platforms: Platform[]) => void;
}

export function WhatIfAnalysis({ platforms, dailyBudget, onApplyChanges }: WhatIfAnalysisProps) {
  const [whatIfPlatforms, setWhatIfPlatforms] = useState<Platform[]>(platforms);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(platforms[0] || null);
  const [results, setResults] = useState({
    dailyVisits: 0,
    dailyImpressions: 0,
    dailyRevenue: 0,
    roi: 0,
  });

  useEffect(() => {
    setWhatIfPlatforms(platforms);
    if (platforms.length > 0 && !selectedPlatform) {
      setSelectedPlatform(platforms[0]);
    }
  }, [platforms]);

  useEffect(() => {
    calculateResults();
  }, [whatIfPlatforms, dailyBudget]);

  const calculateResults = () => {
    let totalVisits = 0;
    let totalImpressions = 0;
    let totalRevenue = 0;
    
    whatIfPlatforms.forEach(platform => {
      const visits = platform.amount / platform.costPerVisit;
      const impressions = visits * platform.acceptanceRate;
      const revenue = (impressions / 1000) * platform.cpm;
      
      totalVisits += visits;
      totalImpressions += impressions;
      totalRevenue += revenue;
    });
    
    const roi = dailyBudget > 0 ? ((totalRevenue - dailyBudget) / dailyBudget) * 100 : 0;
    
    setResults({
      dailyVisits: totalVisits,
      dailyImpressions: totalImpressions,
      dailyRevenue: totalRevenue,
      roi: roi,
    });
  };

  const handleParameterChange = (parameter: 'costPerVisit' | 'acceptanceRate' | 'cpm', value: number) => {
    if (!selectedPlatform) return;
    
    setWhatIfPlatforms(prev => 
      prev.map(p => 
        p.id === selectedPlatform.id 
          ? { ...p, [parameter]: value }
          : p
      )
    );
  };

  const handleApplyChanges = () => {
    onApplyChanges(whatIfPlatforms);
  };

  const handleReset = () => {
    setWhatIfPlatforms(platforms);
  };

  const formatSliderValue = (value: number, type: string) => {
    if (type === 'costPerVisit') return `$${value.toFixed(6)}`;
    if (type === 'acceptanceRate') return `${(value * 100).toFixed(1)}%`;
    if (type === 'cpm') return `$${value.toFixed(2)}`;
    return value.toString();
  };

  const getNextPlatform = () => {
    if (!selectedPlatform) return;
    const currentIndex = whatIfPlatforms.findIndex(p => p.id === selectedPlatform.id);
    const nextIndex = (currentIndex + 1) % whatIfPlatforms.length;
    setSelectedPlatform(whatIfPlatforms[nextIndex]);
  };

  const getPreviousPlatform = () => {
    if (!selectedPlatform) return;
    const currentIndex = whatIfPlatforms.findIndex(p => p.id === selectedPlatform.id);
    const prevIndex = (currentIndex - 1 + whatIfPlatforms.length) % whatIfPlatforms.length;
    setSelectedPlatform(whatIfPlatforms[prevIndex]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          What-If Analysis
        </CardTitle>
        <CardDescription>
          Adjust platform parameters to see how they affect your results
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedPlatform ? (
          <>
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={getPreviousPlatform}
                className="h-8 px-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-sm font-medium">{selectedPlatform.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(selectedPlatform.amount)} ({selectedPlatform.percentage}%)
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={getNextPlatform}
                className="h-8 px-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="costPerVisit" className="text-xs">Cost Per Visit</Label>
                  <span className="text-xs font-mono">{formatSliderValue(selectedPlatform.costPerVisit, 'costPerVisit')}</span>
                </div>
                <Slider 
                  id="costPerVisit"
                  min={0.000001}
                  max={0.001}
                  step={0.000001}
                  value={[whatIfPlatforms.find(p => p.id === selectedPlatform.id)?.costPerVisit || 0.0001]}
                  onValueChange={(value) => handleParameterChange('costPerVisit', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="acceptanceRate" className="text-xs">Acceptance Rate</Label>
                  <span className="text-xs font-mono">{formatSliderValue(selectedPlatform.acceptanceRate, 'acceptanceRate')}</span>
                </div>
                <Slider 
                  id="acceptanceRate"
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={[whatIfPlatforms.find(p => p.id === selectedPlatform.id)?.acceptanceRate || 0.5]}
                  onValueChange={(value) => handleParameterChange('acceptanceRate', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="cpm" className="text-xs">CPM Rate</Label>
                  <span className="text-xs font-mono">{formatSliderValue(selectedPlatform.cpm, 'cpm')}</span>
                </div>
                <Slider 
                  id="cpm"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[whatIfPlatforms.find(p => p.id === selectedPlatform.id)?.cpm || 1]}
                  onValueChange={(value) => handleParameterChange('cpm', value[0])}
                />
              </div>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md border mt-4 space-y-2">
              <h4 className="text-xs font-medium">Expected Results with Changes</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Visits:</span>{" "}
                  <span className="font-medium">{formatNumber(results.dailyVisits)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Impressions:</span>{" "}
                  <span className="font-medium">{formatNumber(results.dailyImpressions)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Revenue:</span>{" "}
                  <span className="font-medium">{formatCurrency(results.dailyRevenue)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">ROI:</span>{" "}
                  <span className={`font-medium ${results.roi >= 0 ? "text-success" : "text-destructive"}`}>
                    {formatPercent(results.roi)}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Alert>
            <AlertDescription>No platforms available for analysis</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleApplyChanges}
          className="text-xs"
        >
          Apply Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
