
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetAllocator } from "@/components/budget/BudgetAllocator";
import { ScenarioPlanner } from "@/components/budget/ScenarioPlanner";
import { WhatIfAnalysis } from "@/components/budget/WhatIfAnalysis";
import RevenueBudgetOptimizer from "@/components/budget/RevenueBudgetOptimizer";
import { useState } from "react";

// Sample platform data for WhatIfAnalysis component
const samplePlatforms = [
  {
    id: "9hits",
    name: "9Hits",
    percentage: 40,
    amount: 20,
    color: "blue-500",
    costPerVisit: 0.0002,
    acceptanceRate: 0.85,
    cpm: 1.2
  },
  {
    id: "hitleap",
    name: "HitLeap",
    percentage: 25,
    amount: 12.5,
    color: "green-500",
    costPerVisit: 0.00015,
    acceptanceRate: 0.7,
    cpm: 0.9
  },
  {
    id: "otohits",
    name: "Otohits",
    percentage: 20,
    amount: 10,
    color: "yellow-500",
    costPerVisit: 0.00025,
    acceptanceRate: 0.9,
    cpm: 1.5
  },
  {
    id: "webhit",
    name: "WebHits",
    percentage: 15,
    amount: 7.5,
    color: "purple-500",
    costPerVisit: 0.0003,
    acceptanceRate: 0.8,
    cpm: 1.8
  }
];

// Sample platform data for BudgetAllocator component
const initialPlatforms = [
  { id: "9hits", name: "9Hits", percentage: 40, color: "blue-500", budget: 20 },
  { id: "hitleap", name: "HitLeap", percentage: 25, color: "green-500", budget: 12.5 },
  { id: "otohits", name: "Otohits", percentage: 20, color: "yellow-500", budget: 10 },
  { id: "webhit", name: "WebHits", percentage: 15, color: "purple-500", budget: 7.5 }
];

export default function BudgetOptimizer() {
  const [dailyBudget, setDailyBudget] = useState(50);
  const [platforms, setPlatforms] = useState(samplePlatforms);

  // Handler for WhatIfAnalysis component
  const handleApplyChanges = (updatedPlatforms) => {
    setPlatforms(updatedPlatforms);
  };

  return (
    <>
      <Helmet>
        <title>Budget Optimizer | TrafficManager</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Optimizer</h1>
          <p className="text-muted-foreground">
            Optimize your budget allocations for maximum ROI
          </p>
        </div>
      </div>

      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allocator">Budget Allocator</TabsTrigger>
          <TabsTrigger value="optimizer">Revenue Optimizer</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planner</TabsTrigger>
          <TabsTrigger value="whatif">What-If Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allocator" className="space-y-4">
          <BudgetAllocator 
            totalBudget={dailyBudget}
            onTotalBudgetChange={setDailyBudget}
            initialPlatforms={initialPlatforms}
          />
        </TabsContent>
        
        <TabsContent value="optimizer" className="space-y-4">
          <RevenueBudgetOptimizer />
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioPlanner />
        </TabsContent>
        
        <TabsContent value="whatif" className="space-y-4">
          <WhatIfAnalysis 
            platforms={platforms}
            dailyBudget={dailyBudget}
            onApplyChanges={handleApplyChanges}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
