
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatNumber, formatPercent } from "@/utils/formatters"
import { Zap, Loader2, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface Platform {
  id: string
  name: string
  percentage: number
  color: string
  budget: number
}

interface ExpectedResults {
  dailyVisits: number
  dailyImpressions: number
  dailyRevenue: number
  roi: number
}

interface BudgetAllocatorProps {
  totalBudget: number
  onTotalBudgetChange?: (value: number) => void
  initialPlatforms: Platform[]
  optimizationTarget?: 'roi' | 'traffic' | 'impressions'
  onOptimizationTargetChange?: (target: 'roi' | 'traffic' | 'impressions') => void
}

export function BudgetAllocator({
  totalBudget: initialTotalBudget = 50,
  onTotalBudgetChange,
  initialPlatforms,
  optimizationTarget: initialOptimizationTarget = 'roi',
  onOptimizationTargetChange
}: BudgetAllocatorProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(() => 
    initialPlatforms.map(p => ({
      ...p,
      budget: (initialTotalBudget * p.percentage) / 100
    }))
  )
  const [results, setResults] = useState<ExpectedResults>({
    dailyVisits: 0,
    dailyImpressions: 0,
    dailyRevenue: 0,
    roi: 0
  })
  const [optimizationTarget, setOptimizationTarget] = useState<'roi' | 'traffic' | 'impressions'>(initialOptimizationTarget)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [totalPercentage, setTotalPercentage] = useState(100)
  const [totalBudget, setTotalBudget] = useState(initialTotalBudget)
  const [autoAdjust, setAutoAdjust] = useState(false)
  const [optimizationSuccess, setOptimizationSuccess] = useState(false)
  const { toast } = useToast()

  // Update total percentage whenever platforms change
  useEffect(() => {
    const total = platforms.reduce((sum, platform) => sum + platform.percentage, 0)
    setTotalPercentage(total)
  }, [platforms])

  // Calculate expected results whenever platforms or total budget changes
  useEffect(() => {
    calculateExpectedResults()
  }, [totalBudget, platforms, lastUpdated])

  // Recalculate budget amounts when total budget changes
  useEffect(() => {
    if (onTotalBudgetChange) {
      onTotalBudgetChange(totalBudget)
    }
    
    // Update platform budgets based on new total budget
    setPlatforms(prev => prev.map(platform => ({
      ...platform,
      budget: (totalBudget * platform.percentage) / 100
    })))
  }, [totalBudget, onTotalBudgetChange])

  // Notify parent component when optimization target changes
  useEffect(() => {
    if (onOptimizationTargetChange) {
      onOptimizationTargetChange(optimizationTarget)
    }
  }, [optimizationTarget, onOptimizationTargetChange])

  const calculateExpectedResults = () => {
    // Enhanced calculation formula based on optimization target
    let multiplier = 1;
    
    if (optimizationTarget === 'roi') {
      multiplier = 1.1; // 10% better for ROI optimization
    } else if (optimizationTarget === 'traffic') {
      multiplier = 1.2; // 20% better for traffic optimization
    } else if (optimizationTarget === 'impressions') {
      multiplier = 1.15; // 15% better for impressions optimization
    }
    
    // Calculate visits based on platform weights
    const baseVisits = totalBudget * 200 * multiplier; // Base: 200 visits per $1
    const weightedVisits = platforms.reduce((sum, platform) => {
      // Different platforms have different efficiency
      let platformMultiplier = 1;
      if (platform.id === '9hits') platformMultiplier = 1.2;
      if (platform.id === 'hitleap') platformMultiplier = 0.9;
      if (platform.id === 'otohits') platformMultiplier = 1.1;
      
      return sum + ((platform.budget / totalBudget) * baseVisits * platformMultiplier);
    }, 0);
    
    // Calculate other metrics
    const impressionsRate = optimizationTarget === 'impressions' ? 0.45 : 0.4;
    const dailyImpressions = weightedVisits * impressionsRate;
    
    const revenueRate = optimizationTarget === 'roi' ? 0.006 : 0.005;
    const dailyRevenue = dailyImpressions * revenueRate;
    
    const roi = ((dailyRevenue - totalBudget) / totalBudget) * 100;
    
    setResults({
      dailyVisits: weightedVisits,
      dailyImpressions: dailyImpressions,
      dailyRevenue: dailyRevenue,
      roi: roi
    });
    
    // Show optimization success indicator temporarily if results improved
    if (optimizationSuccess) {
      setTimeout(() => setOptimizationSuccess(false), 3000);
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalBudget(value);
    }
  };

  const handleTargetChange = (value: 'roi' | 'traffic' | 'impressions') => {
    setOptimizationTarget(value);
    // Recalculate expected results after a short delay
    setTimeout(() => {
      calculateExpectedResults();
      setLastUpdated(Date.now());
    }, 100);
  };

  const handleDirectPercentageInput = (platformId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    
    // Validate input
    if (isNaN(newValue) || newValue < 0 || newValue > 100) {
      return;
    }
    
    handleSliderChange(platformId, [newValue]);
  };

  const handleSliderChange = (platformId: string, value: number[]) => {
    const newValue = value[0]
    
    // Calculate the difference between old and new percentage
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return
    
    const difference = newValue - platform.percentage
    
    // If there's no change, return early
    if (difference === 0) return
    
    // Adjust other platforms proportionally to maintain 100% total
    const otherPlatforms = platforms.filter(p => p.id !== platformId)
    const totalOtherPercentage = otherPlatforms.reduce((sum, p) => sum + p.percentage, 0)
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          percentage: newValue,
          budget: (totalBudget * newValue) / 100
        }
      } else {
        // Adjust other platforms proportionally
        const adjustmentFactor = totalOtherPercentage > 0 
          ? (100 - newValue) / totalOtherPercentage 
          : 0
        
        const newPercentage = p.percentage * adjustmentFactor
        
        return {
          ...p,
          percentage: newPercentage,
          budget: (totalBudget * newPercentage) / 100
        }
      }
    })
    
    // Ensure we have 100% allocation
    const totalPercentage = updatedPlatforms.reduce((sum, p) => sum + p.percentage, 0)
    if (Math.abs(totalPercentage - 100) > 0.01) {
      // If we're off by more than 0.01%, adjust the last platform to make it exactly 100%
      const lastPlatform = updatedPlatforms.find(p => p.id !== platformId)
      if (lastPlatform) {
        const adjustment = 100 - (totalPercentage - lastPlatform.percentage)
        const index = updatedPlatforms.findIndex(p => p.id === lastPlatform.id)
        updatedPlatforms[index] = {
          ...lastPlatform,
          percentage: adjustment,
          budget: (totalBudget * adjustment) / 100
        }
      }
    }
    
    setPlatforms(updatedPlatforms)
    // Trigger a rerender of results
    setLastUpdated(Date.now())
    
    // Show a toast notification for significant changes
    if (Math.abs(difference) >= 10) {
      toast({
        title: "Budget Allocation Updated",
        description: `${platform.name} allocation ${difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(difference).toFixed(0)}%`,
        duration: 3000,
      })
    }
  }

  const optimizeBudget = async () => {
    setLoading(true)
    try {
      // Simulate API call
      console.log(`Optimizing budget for ${optimizationTarget}`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create "optimized" allocation - this would come from an API in a real app
      let optimizedPlatforms: Platform[]
      
      switch (optimizationTarget) {
        case 'roi':
          // Simulated ROI optimization - favors platforms with better ROI
          optimizedPlatforms = [
            { ...platforms[0], percentage: 45, budget: totalBudget * 0.45 },
            { ...platforms[1], percentage: 20, budget: totalBudget * 0.20 },
            { ...platforms[2], percentage: 25, budget: totalBudget * 0.25 },
            { ...platforms[3], percentage: 10, budget: totalBudget * 0.10 },
          ]
          break
        case 'traffic':
          // Simulated traffic optimization - favors platforms with more traffic
          optimizedPlatforms = [
            { ...platforms[0], percentage: 30, budget: totalBudget * 0.30 },
            { ...platforms[1], percentage: 40, budget: totalBudget * 0.40 },
            { ...platforms[2], percentage: 15, budget: totalBudget * 0.15 },
            { ...platforms[3], percentage: 15, budget: totalBudget * 0.15 },
          ]
          break
        case 'impressions':
          // Simulated impression optimization - favors platforms with better acceptance rates
          optimizedPlatforms = [
            { ...platforms[0], percentage: 25, budget: totalBudget * 0.25 },
            { ...platforms[1], percentage: 30, budget: totalBudget * 0.30 },
            { ...platforms[2], percentage: 35, budget: totalBudget * 0.35 },
            { ...platforms[3], percentage: 10, budget: totalBudget * 0.10 },
          ]
          break
        default:
          optimizedPlatforms = [...platforms]
      }
      
      setPlatforms(optimizedPlatforms)
      // Trigger a rerender of results
      setLastUpdated(Date.now())
      setOptimizationSuccess(true)
      
      toast({
        title: "Budget Optimized",
        description: `Budget has been optimized for maximum ${optimizationTarget === 'roi' ? 'ROI' : optimizationTarget}.`,
        duration: 3000,
      })
      
    } catch (error) {
      console.error("Error optimizing budget:", error)
      toast({
        title: "Error",
        description: "Failed to optimize budget. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="total-budget" className="mb-2 block">Daily Budget</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input 
                id="total-budget"
                type="number" 
                min="0"
                step="5"
                value={totalBudget} 
                onChange={handleBudgetChange}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="w-full sm:w-1/2">
            <Label htmlFor="optimization-target" className="mb-2 block">Optimization Target</Label>
            <Select 
              value={optimizationTarget} 
              onValueChange={handleTargetChange as (value: string) => void}
            >
              <SelectTrigger id="optimization-target">
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">Maximum ROI</SelectItem>
                <SelectItem value="traffic">Maximum Traffic</SelectItem>
                <SelectItem value="impressions">Maximum Impressions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-adjust"
            checked={autoAdjust}
            onCheckedChange={setAutoAdjust}
          />
          <Label htmlFor="auto-adjust" className="cursor-pointer">
            Auto-adjust budget based on performance
          </Label>
        </div>

        {optimizationSuccess && (
          <Alert className="bg-success/10 border-success/30 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Budget Successfully Optimized</AlertTitle>
            <AlertDescription>
              Your budget has been optimized for {optimizationTarget === 'roi' ? 'maximum ROI' : 
                optimizationTarget === 'traffic' ? 'maximum traffic' : 'maximum impressions'}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Platform Allocations</h3>
          <span className={cn(
            "text-sm font-medium",
            Math.abs(totalPercentage - 100) > 0.5 && "text-destructive"
          )}>
            Total: {totalPercentage.toFixed(0)}%
          </span>
        </div>
        
        {platforms.map((platform) => (
          <div key={platform.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={`platform-${platform.id}`} className="text-sm">{platform.name}</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  step="5"
                  className="w-16 h-8 text-sm"
                  value={platform.percentage.toFixed(0)}
                  onChange={(e) => handleDirectPercentageInput(platform.id, e)}
                />
                <span className="text-sm font-medium w-20 text-right">
                  {formatCurrency(platform.budget)}
                </span>
              </div>
            </div>
            <Slider
              id={`platform-${platform.id}`}
              value={[platform.percentage]}
              max={100}
              step={5}
              onValueChange={(value) => handleSliderChange(platform.id, value)}
              className="budget-allocation-slider"
              aria-label={`${platform.name} budget allocation`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        ))}
        
        {Math.abs(totalPercentage - 100) > 0.5 && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Invalid Allocation</AlertTitle>
            <AlertDescription>
              Total allocation must equal 100%. Current total: {totalPercentage.toFixed(0)}%
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="pt-4">
        <h3 className="text-sm font-medium mb-3">Current Budget Distribution</h3>
        <div className="space-y-4" id="budget-distribution-chart">
          {platforms.map((platform) => (
            <div key={platform.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${platform.color} mr-2`}></div>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(platform.budget)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={platform.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground w-8">{platform.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4">
        <h3 className="text-sm font-medium mb-3">Expected Results</h3>
        
        <div className="space-y-4" id="expected-results-container">
          <div className="bg-background rounded-md p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Visits</span>
              <span className="font-medium">{formatNumber(results.dailyVisits)}</span>
            </div>
          </div>
          
          <div className="bg-background rounded-md p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Impressions</span>
              <span className="font-medium">{formatNumber(results.dailyImpressions)}</span>
            </div>
          </div>
          
          <div className="bg-background rounded-md p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Revenue</span>
              <span className="font-medium">{formatCurrency(results.dailyRevenue)}</span>
            </div>
          </div>
          
          <div className={`bg-background rounded-md p-3 border ${
            results.roi > 0 ? "border-success/30" : "border-destructive/30"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Expected ROI</span>
              <span className={`font-medium ${
                results.roi > 0 ? "text-success" : "text-destructive"
              }`}>
                {formatPercent(results.roi, 1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="bg-muted/5 mt-4">
        <CardContent className="pt-4">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle>Optimization Tips</AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>For best ROI, allocate more budget to platforms with higher conversion rates</li>
                <li>Switch optimization targets to see different allocation strategies</li>
                <li>Total allocation must equal exactly 100%</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Button 
        onClick={optimizeBudget} 
        disabled={loading || Math.abs(totalPercentage - 100) > 0.5} 
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Optimize Budget Allocation
          </>
        )}
      </Button>
    </div>
  )
}
