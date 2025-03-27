import * as React from "react"
import { useState } from "react"
import { DollarSign, Search, BarChart, Percent, ArrowDown, ArrowUp, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalculatorState {
  impressions: number
  revenue: number
  cpm: number
  ctr: number
  acceptanceRate: number
  cost: number
}

const defaultCalculatorState: CalculatorState = {
  impressions: 1000,
  revenue: 10,
  cpm: 10,
  ctr: 1,
  acceptanceRate: 75,
  cost: 1,
}

export function CpmCalculator() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(defaultCalculatorState)
  const [activeTab, setActiveTab] = useState<"cpm" | "revenue" | "cost">("cpm")
  const [showHelp, setShowHelp] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const calculateCpm = () => {
    return (calculatorState.revenue / calculatorState.impressions) * 1000
  }
  
  const calculateRevenue = () => {
    return (calculatorState.cpm / 1000) * calculatorState.impressions
  }
  
  const calculateImpressions = () => {
    return calculatorState.revenue / (calculatorState.cpm / 1000)
  }
  
  const calculateCostPerImpression = () => {
    return calculatorState.cost / calculatorState.impressions
  }
  
  const calculateEffectiveCpm = () => {
    return (calculatorState.revenue * (calculatorState.acceptanceRate / 100) / calculatorState.impressions) * 1000
  }
  
  const handleInputChange = (field: keyof CalculatorState, value: number) => {
    setCalculatorState({
      ...calculatorState,
      [field]: value,
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>CPM Calculator</CardTitle>
          <Popover open={showHelp} onOpenChange={setShowHelp}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <h4 className="font-medium leading-none">CPM Calculator</h4>
              <p className="text-sm text-muted-foreground">
                Calculate CPM, revenue, and cost per impression based on your traffic data.
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                <li>CPM: Cost per mille (1000 impressions)</li>
                <li>Revenue: Total earnings</li>
                <li>Cost: Total cost</li>
                <li>CTR: Click-through rate</li>
                <li>Acceptance Rate: Percentage of impressions accepted</li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription>Calculate CPM, revenue, and cost per impression</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="cpm" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cpm" onClick={() => setActiveTab("cpm")}>CPM</TabsTrigger>
            <TabsTrigger value="revenue" onClick={() => setActiveTab("revenue")}>Revenue</TabsTrigger>
            <TabsTrigger value="cost" onClick={() => setActiveTab("cost")}>Cost</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cpm" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={calculatorState.revenue}
                  onChange={(e) => handleInputChange("revenue", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impressions">Impressions</Label>
                <Input
                  id="impressions"
                  type="number"
                  value={calculatorState.impressions}
                  onChange={(e) => handleInputChange("impressions", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Calculated CPM</Label>
                <div className="grid gap-2">
                  <Input
                    id="cpm"
                    type="number"
                    value={calculateCpm().toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpm-revenue">CPM</Label>
                <Input
                  id="cpm-revenue"
                  type="number"
                  value={calculatorState.cpm}
                  onChange={(e) => handleInputChange("cpm", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impressions-revenue">Impressions</Label>
                <Input
                  id="impressions-revenue"
                  type="number"
                  value={calculatorState.impressions}
                  onChange={(e) => handleInputChange("impressions", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Calculated Revenue</Label>
                <div className="grid gap-2">
                  <Input
                    id="revenue-calculated"
                    type="number"
                    value={calculateRevenue().toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={calculatorState.cost}
                  onChange={(e) => handleInputChange("cost", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impressions-cost">Impressions</Label>
                <Input
                  id="impressions-cost"
                  type="number"
                  value={calculatorState.impressions}
                  onChange={(e) => handleInputChange("impressions", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cost per Impression</Label>
                <div className="grid gap-2">
                  <Input
                    id="cost-per-impression"
                    type="number"
                    value={calculateCostPerImpression().toFixed(5)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-advanced">Show Advanced Settings</Label>
          <Switch id="show-advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
        </div>
        
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctr">Click-Through Rate (%)</Label>
                <Input
                  id="ctr"
                  type="number"
                  value={calculatorState.ctr}
                  onChange={(e) => handleInputChange("ctr", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acceptance-rate">Acceptance Rate (%)</Label>
                <Input
                  id="acceptance-rate"
                  type="number"
                  value={calculatorState.acceptanceRate}
                  onChange={(e) => handleInputChange("acceptanceRate", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Effective CPM</Label>
                <div className="grid gap-2">
                  <Input
                    id="effective-cpm"
                    type="number"
                    value={calculateEffectiveCpm().toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline">Reset</Button>
      </CardFooter>
    </Card>
  )
}
