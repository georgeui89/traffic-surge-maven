
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetAllocator from "@/components/budget/BudgetAllocator";
import ScenarioPlanner from "@/components/budget/ScenarioPlanner";
import WhatIfAnalysis from "@/components/budget/WhatIfAnalysis";
import RevenueBudgetOptimizer from "@/components/budget/RevenueBudgetOptimizer";

export default function BudgetOptimizer() {
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
          <BudgetAllocator />
        </TabsContent>
        
        <TabsContent value="optimizer" className="space-y-4">
          <RevenueBudgetOptimizer />
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioPlanner />
        </TabsContent>
        
        <TabsContent value="whatif" className="space-y-4">
          <WhatIfAnalysis />
        </TabsContent>
      </Tabs>
    </>
  );
}
