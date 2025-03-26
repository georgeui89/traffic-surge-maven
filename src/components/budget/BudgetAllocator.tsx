
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatNumber, formatPercent } from "@/utils/formatters"
import { Zap, Loader2 } from "lucide-react"

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
  totalBudget,
  onTotalBudgetChange,
  initialPlatforms,
  optimizationTarget = 'roi',
  onOptimizationTargetChange
}: BudgetAllocatorProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms)
  const [results, setResults] = useState<ExpectedResults>({
    dailyVisits: 0,
    dailyImpressions: 0,
    dailyRevenue: 0,
    roi: 0
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Calculate expected results whenever platforms or total budget changes
  useEffect(() => {
    // Ensure a small delay to make it feel like real calculations
    const timer = setTimeout(() => {
      // Simple calculation formula, in a real app this would be more complex
      const dailyVisits = totalBudget * 200 // 200 visits per $1
      const dailyImpressions = dailyVisits * 0.4 // 40% acceptance rate
      const dailyRevenue = dailyImpressions * 0.005 // $0.005 per impression
      const roi = ((dailyRevenue - totalBudget) / totalBudget) * 100
  
      setResults({
        dailyVisits,
        dailyImpressions,
        dailyRevenue,
        roi
      })
    }, 300)
    
    return () => clearTimeout(timer)
  }, [totalBudget, platforms])

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
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Platform Allocations</h3>
        
        {platforms.map((platform) => (
          <div key={platform.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={`platform-${platform.id}`} className="text-sm">{platform.name}</label>
              <span className="text-sm font-medium">{formatCurrency(platform.budget)}</span>
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
      
      <Button onClick={optimizeBudget} disabled={loading} className="w-full">
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
