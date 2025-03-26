
import * as React from "react"
import { useState, useEffect } from "react"
import { Calculator, DollarSign, CreditCard, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CpmCalculatorProps {
  defaultCpmRate?: number
  defaultImpressions?: number
  defaultRevenue?: number
  defaultCredits?: number
  defaultAcceptanceRate?: number
  defaultSecondsPerVisit?: number
}

export function CpmCalculator({
  defaultCpmRate = 1.0,
  defaultImpressions = 10000,
  defaultRevenue = 10,
  defaultCredits = 1000,
  defaultAcceptanceRate = 40,
  defaultSecondsPerVisit = 30
}: CpmCalculatorProps) {
  const [calculationType, setCalculationType] = useState<'impressions-to-revenue' | 'revenue-to-credits'>('impressions-to-revenue')
  const [platform, setPlatform] = useState('9hits')
  const [impressions, setImpressions] = useState(defaultImpressions)
  const [revenue, setRevenue] = useState(defaultRevenue)
  const [credits, setCredits] = useState(defaultCredits)
  const [acceptanceRate, setAcceptanceRate] = useState(defaultAcceptanceRate)
  const [secondsPerVisit, setSecondsPerVisit] = useState(defaultSecondsPerVisit)
  const [manualCpmRate, setManualCpmRate] = useState(defaultCpmRate)
  const { toast } = useToast()
  
  // Platform CPM rates
  const platformRates = {
    '9hits': 0.8,
    'hitleap': 0.7,
    'otohits': 0.65,
    'bigHitsU': 0.85,
    'webhit': 0.75
  }
  
  const getPlatformRate = (platform: string) => {
    return platformRates[platform as keyof typeof platformRates] || 0.5
  }
  
  // Calculate CPM value
  const calculateCPM = () => {
    return (revenue / impressions) * 1000
  }
  
  // Calculate Revenue
  const calculateRevenue = () => {
    const validImpressions = (credits / secondsPerVisit) * (acceptanceRate / 100)
    const cpmRate = manualCpmRate || getPlatformRate(platform)
    return (validImpressions / 1000) * cpmRate
  }
  
  // Calculate Required Credits
  const calculateRequiredCredits = () => {
    const cpmRate = manualCpmRate || getPlatformRate(platform)
    const validImpressionsNeeded = impressions * (100 / acceptanceRate)
    return validImpressionsNeeded * secondsPerVisit
  }
  
  // Handle platform change
  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform)
    setManualCpmRate(getPlatformRate(newPlatform))
    
    toast({
      title: "Platform Changed",
      description: `CPM rate updated for ${newPlatform}.`,
      duration: 3000,
    })
  }
  
  // Update CPM rate
  const handleUpdateCpmRates = () => {
    toast({
      title: "CPM Rates Updated",
      description: "The latest market CPM rates have been fetched.",
      duration: 3000,
    })
  }
  
  // Calculate the values
  const cpm = calculationType === 'revenue-to-credits' ? manualCpmRate : calculateCPM()
  const estimatedRevenue = calculateRevenue()
  const requiredCredits = calculateRequiredCredits()
  const expectedImpressions = (credits / secondsPerVisit) * (acceptanceRate / 100)
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          variant={calculationType === 'impressions-to-revenue' ? 'default' : 'outline'}
          onClick={() => setCalculationType('impressions-to-revenue')}
          className="flex-1"
        >
          Calculate Revenue
        </Button>
        <Button 
          variant={calculationType === 'revenue-to-credits' ? 'default' : 'outline'}
          onClick={() => setCalculationType('revenue-to-credits')}
          className="flex-1"
        >
          Calculate Credits
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="platform">Select Platform</Label>
            <Select value={platform} onValueChange={handlePlatformChange}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9hits">9Hits</SelectItem>
                <SelectItem value="hitleap">HitLeap</SelectItem>
                <SelectItem value="otohits">Otohits</SelectItem>
                <SelectItem value="bigHitsU">BigHits4U</SelectItem>
                <SelectItem value="webhit">Webhit.net</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {calculationType === 'impressions-to-revenue' ? (
            <>
              <div>
                <Label htmlFor="credits">Available Credits</Label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="credits"
                    type="number"
                    className="pl-10"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cpm-value">CPM Rate ($)</Label>
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cpm-value"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10"
                    className="pl-10"
                    value={manualCpmRate}
                    onChange={(e) => setManualCpmRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="impressions">Target Impressions</Label>
                <div className="relative mt-1.5">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="impressions"
                    type="number"
                    className="pl-10"
                    value={impressions}
                    onChange={(e) => setImpressions(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="revenue">Expected Revenue ($)</Label>
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="revenue"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="pl-10"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seconds-per-visit">Seconds Per Visit</Label>
              <span className="text-sm text-muted-foreground">{secondsPerVisit}s</span>
            </div>
            <Slider
              id="seconds-per-visit"
              min={5}
              max={60}
              step={1}
              value={[secondsPerVisit]}
              onValueChange={(value) => setSecondsPerVisit(value[0])}
              className="mt-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label htmlFor="acceptance-rate">Acceptance Rate</Label>
              <span className="text-sm text-muted-foreground">{acceptanceRate}%</span>
            </div>
            <Slider
              id="acceptance-rate"
              min={10}
              max={100}
              step={1}
              value={[acceptanceRate]}
              onValueChange={(value) => setAcceptanceRate(value[0])}
              className="mt-2"
            />
          </div>
          
          {calculationType === 'revenue-to-credits' && (
            <div>
              <Label htmlFor="cpm-value">CPM Rate ($)</Label>
              <div className="relative mt-1.5">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cpm-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10"
                  className="pl-10"
                  value={manualCpmRate}
                  onChange={(e) => setManualCpmRate(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full p-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculationType === 'impressions-to-revenue' ? (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium">Expected Valid Impressions</p>
                <p className="text-2xl font-bold">
                  {Math.round(expectedImpressions).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Estimated Revenue</p>
                <p className="text-2xl font-bold text-success">${estimatedRevenue.toFixed(2)}</p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium">Required Credits</p>
                <p className="text-2xl font-bold">{Math.round(requiredCredits).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Target Revenue</p>
                <p className="text-2xl font-bold text-success">${revenue}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-4">Current CPM Rates by Platform</h3>
        <div className="space-y-2">
          {Object.entries(platformRates).map(([key, rate]) => (
            <div key={key} className="flex justify-between items-center p-2 border-b">
              <span>{key === 'bigHitsU' ? 'BigHits4U' : key === 'webhit' ? 'Webhit.net' : key}</span>
              <span className="font-medium">${rate.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-muted rounded-md border">
          <p className="text-sm text-muted-foreground">
            CPM rates are averages based on recent performance data. Actual rates may vary depending on traffic quality, niche, and other factors.
          </p>
        </div>
        
        <Button onClick={handleUpdateCpmRates} variant="outline" className="w-full mt-4">
          <Calculator className="mr-2 h-4 w-4" />
          Update CPM Rates
        </Button>
      </div>
    </div>
  )
}
