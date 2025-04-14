
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2 } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

interface OptimizationSuggestion {
  id: string
  title: string
  description: string
  impact: string
  impactType: 'positive' | 'negative' | 'neutral'
  complexity: 'easy' | 'medium' | 'hard'
}

interface TrafficOptimizationSuggestionsProps {
  initialSuggestions: OptimizationSuggestion[]
}

export function TrafficOptimizationSuggestions({ initialSuggestions }: TrafficOptimizationSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(initialSuggestions)
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [successIds, setSuccessIds] = useState<string[]>([])
  const { toast } = useToast()
  
  const handleApplyFix = async (suggestion: OptimizationSuggestion) => {
    if (loadingIds.includes(suggestion.id)) return
    
    setLoadingIds(prev => [...prev, suggestion.id])
    
    try {
      // Simulate API call
      console.log(`Applying fix: ${suggestion.title}`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success state temporarily
      setSuccessIds(prev => [...prev, suggestion.id])
      setTimeout(() => {
        // Remove the suggestion from the list after showing success
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
        setSuccessIds(prev => prev.filter(id => id !== suggestion.id))
      }, 1000)
      
      toast({
        title: "Fix Applied",
        description: `${suggestion.title} has been successfully applied.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error applying fix:", error)
      toast({
        title: "Error",
        description: "Failed to apply fix. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== suggestion.id))
    }
  }
  
  const handleDismiss = (suggestionId: string) => {
    if (loadingIds.includes(suggestionId)) return
    
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    
    toast({
      title: "Suggestion Dismissed",
      description: "The suggestion has been dismissed from your list.",
      duration: 3000,
    })
  }
  
  const getImpactBadgeVariant = (impactType: 'positive' | 'negative' | 'neutral') => {
    switch (impactType) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'destructive'
      case 'neutral':
        return 'secondary' // Changed from 'warning' to 'secondary'
    }
  }
  
  const getComplexityBadgeVariant = (complexity: 'easy' | 'medium' | 'hard') => {
    switch (complexity) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'secondary' // Changed from 'warning' to 'secondary'
      case 'hard':
        return 'destructive'
    }
  }
  
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Quality Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-8">
            <p className="text-muted-foreground">No optimization suggestions available.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSuggestions(initialSuggestions)}
            >
              Reset Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Quality Optimization Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className="p-4 border border-border/40 rounded-md hover:border-border/60 transition-all duration-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getImpactBadgeVariant(suggestion.impactType) as "success" | "destructive" | "secondary"}>
                      Impact: {suggestion.impact}
                    </Badge>
                    <Badge variant={getComplexityBadgeVariant(suggestion.complexity) as "success" | "warning" | "destructive"}>
                      Complexity: {suggestion.complexity}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismiss(suggestion.id)}
                    disabled={loadingIds.includes(suggestion.id)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    className="optimize-btn fix-suggestion-btn"
                    onClick={() => handleApplyFix(suggestion)}
                    disabled={loadingIds.includes(suggestion.id) || successIds.includes(suggestion.id)}
                  >
                    {loadingIds.includes(suggestion.id) ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Applying...
                      </>
                    ) : successIds.includes(suggestion.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-3 w-3" />
                        Applied
                      </>
                    ) : (
                      "Apply Fix"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
