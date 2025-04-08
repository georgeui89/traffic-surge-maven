
import { useState } from "react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart2, PieChart, Compass, Terminal, Calculator, Server, Layout,
  Sliders, FileBarChart, BarChart, Calendar,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpIcon } from "@/components/ui/help-label";

const Features = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const featuresList = [
    {
      id: "dashboard",
      name: "Dashboard",
      description: "The control center providing a real-time view of your entire traffic arbitrage operation.",
      icon: <Layout className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "The Dashboard gives you a quick, real-time view of your entire traffic arbitrage operation, displaying key metrics and charts.",
        howToUse: [
          "Monitor key stats like total visits, valid impressions, revenue, and acceptance rate",
          "View charts showing traffic trends and daily earnings",
          "Check status widgets for connected platforms, active RDPs, and campaigns",
          "Use filters to focus on specific data periods"
        ],
        whyImportant: "It helps you spot problems quickly—like a platform going offline or a revenue drop—so you can take immediate action.",
        workflow: "Start here each day to check how everything's running. If something looks unusual, investigate using Campaign Management or Traffic Analytics."
      }
    },
    {
      id: "campaigns",
      name: "Campaign Management",
      description: "Track and manage individual traffic sources and see how they perform.",
      icon: <BarChart className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "This section lets you track and manage individual traffic sources and see how they perform over time.",
        howToUse: [
          "Create new campaigns with platform details, conversion factors, and metrics",
          "Update credits earned regularly to keep calculations accurate",
          "Monitor important metrics like acceptance rate and actual CPM",
          "Track campaign costs and ROI for profitability analysis"
        ],
        whyImportant: "You need to know which traffic sources make money and which don't to focus your resources effectively.",
        workflow: "Add new campaigns when starting with a platform. Update 'Credits Earned' daily to maintain accuracy. Pause or adjust campaigns that aren't profitable."
      }
    },
    {
      id: "rdp-management",
      name: "RDP Management",
      description: "Track the remote desktops running your autosurf clients and their profitability.",
      icon: <Server className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Tracks the remote desktops or servers you use to run autosurf clients that generate traffic.",
        howToUse: [
          "Add RDPs with names and associated costs",
          "Assign platforms to each RDP for clear organization",
          "Monitor status, visits generated, revenue, cost, and ROI",
          "Optimize infrastructure based on performance metrics"
        ],
        whyImportant: "RDPs cost money, so ensuring they generate more revenue than they cost is essential for profitability.",
        workflow: "Add RDPs as you set them up. Check their performance regularly to determine if you should scale up or down."
      }
    },
    {
      id: "platforms",
      name: "Platform Management",
      description: "Manage the autosurf platforms you use in your campaigns.",
      icon: <Compass className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Manages the list of autosurf platforms you use in your campaigns with their specific settings and configurations.",
        howToUse: [
          "Add new platforms with details like name and conversion factor",
          "Monitor platform status and performance indicators",
          "Connect APIs where available for additional functionality",
          "Track which platforms are used in which campaigns"
        ],
        whyImportant: "Accurate platform data ensures your campaign calculations are correct and helps identify issues.",
        workflow: "Add new platforms when you start using them. Verify conversion factors. Address issues if campaigns tied to a platform underperform."
      }
    },
    {
      id: "traffic-analytics",
      name: "Traffic Analytics",
      description: "Get detailed insights into your traffic quality and performance.",
      icon: <BarChart2 className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Provides detailed insights into your traffic's quality, sources, and performance over time.",
        howToUse: [
          "Review KPIs like visits, impressions, acceptance rate, and time on site",
          "Analyze graphs showing traffic quality indicators",
          "Compare platform acceptance rates and revenue generation",
          "Filter by date or platform to focus on specific data sets"
        ],
        whyImportant: "Helps you identify which platforms send quality traffic worth investing in and which need improvement.",
        workflow: "Review weekly to spot trends. Use the data to make strategic decisions about campaign investments."
      }
    },
    {
      id: "reporting",
      name: "Reporting",
      description: "Create downloadable reports summarizing your performance.",
      icon: <FileBarChart className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Creates downloadable summaries and reports of your traffic and revenue performance.",
        howToUse: [
          "Select report templates or create custom reports",
          "Configure parameters like date range and metrics to include",
          "Choose export formats (PDF, CSV, Excel) and delivery methods",
          "Schedule recurring reports for automation"
        ],
        whyImportant: "Provides historical data for tracking progress, identifying patterns, and sharing with stakeholders.",
        workflow: "Generate reports monthly or after significant changes to review results and plan future strategies."
      }
    },
    {
      id: "cpm-calculator",
      name: "CPM Calculator",
      description: "Estimate revenue or required credits for campaigns.",
      icon: <Calculator className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "A utility to estimate potential revenue based on credits/traffic or calculate credits needed for revenue goals.",
        howToUse: [
          "Revenue Mode: Enter credits, acceptance rate, and CPM to calculate revenue",
          "Credits Mode: Enter target revenue, acceptance rate, and CPM to calculate credits needed",
          "Adjust parameters to see how changes affect outcomes",
          "Use calculations for campaign planning"
        ],
        whyImportant: "Helps plan campaigns and set realistic goals before allocating resources.",
        workflow: "Use before starting or scaling campaigns to forecast results and requirements."
      }
    },
    {
      id: "rdp-scaler",
      name: "RDP Scaler",
      description: "Calculate optimal RDP count based on costs and projected revenue.",
      icon: <Sliders className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Calculates the optimal number of RDPs needed based on costs and projected revenue.",
        howToUse: [
          "Input RDP count, cost per RDP, and performance metrics",
          "View projected monthly costs, revenue, profit, and ROI",
          "Review optimization suggestions for scaling decisions",
          "Compare different scenarios to find the optimal setup"
        ],
        whyImportant: "Prevents overspending on infrastructure that doesn't generate sufficient returns.",
        workflow: "Use when considering infrastructure changes to make data-driven scaling decisions."
      }
    },
    {
      id: "script-lab",
      name: "Script Lab",
      description: "Create and test redirect scripts for landing pages.",
      icon: <Terminal className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "Development environment for creating, testing, and optimizing JavaScript redirect scripts for landing pages.",
        howToUse: [
          "Write or paste redirect code in the editor",
          "Configure settings like target URL and redirect delay",
          "Use templates for quick implementation of common patterns",
          "Test scripts and monitor their performance",
          "Conduct A/B testing to optimize effectiveness"
        ],
        whyImportant: "Well-optimized scripts improve traffic quality and acceptance rates, boosting revenue.",
        workflow: "Develop scripts here, implement on landing pages, then iterate based on performance data."
      }
    },
    {
      id: "budget-optimizer",
      name: "Budget Optimizer",
      description: "Optimize budget allocation across platforms for maximum ROI.",
      icon: <PieChart className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "AI-powered tool that suggests optimal allocation of your budget across different traffic platforms.",
        howToUse: [
          "Set your total daily budget and optimization goal (e.g., max ROI)",
          "Review AI-recommended budget allocations across platforms",
          "See projected results for visits, revenue, and ROI",
          "Apply recommendations or make manual adjustments"
        ],
        whyImportant: "Ensures your budget is invested in the most profitable platforms based on historical performance.",
        workflow: "Use weekly to plan spending and adjust allocations as performance data changes."
      }
    },
    {
      id: "automation",
      name: "Automation",
      description: "Set up rules to automate routine tasks and optimizations.",
      icon: <Calendar className="h-5 w-5 text-neon-cyan" />,
      details: {
        what: "System for automating routine tasks and applying optimization rules without manual intervention.",
        howToUse: [
          "Configure the AI Autopilot with your preferred aggressiveness level",
          "Set up time scheduling for running campaigns at optimal times",
          "Create performance-based scaling rules for automatic adjustment",
          "Configure error handling responses for system resilience"
        ],
        whyImportant: "Saves time, maintains optimal performance, and allows quick responses to changing conditions.",
        workflow: "Set up rules based on your strategy, then monitor occasionally to ensure they're working correctly."
      }
    }
  ];

  const workflowSummary = [
    { step: 1, feature: "Dashboard", action: "Start here to see the big picture" },
    { step: 2, feature: "Campaign Management", action: "Update and monitor your traffic sources" },
    { step: 3, feature: "RDP Management", action: "Keep your RDPs profitable" },
    { step: 4, feature: "Platform Management", action: "Add and maintain traffic platforms" },
    { step: 5, feature: "Traffic Analytics", action: "Check performance details to improve" },
    { step: 6, feature: "Reporting", action: "Make reports to track progress" },
    { step: 7, feature: "CPM Calculator & RDP Scaler", action: "Plan campaigns and scaling" },
    { step: 8, feature: "Script Lab", action: "Build better landing pages" },
    { step: 9, feature: "Budget Optimizer", action: "Spend your money wisely" },
    { step: 10, feature: "Automation", action: "Let the app handle routine tasks" }
  ];

  return (
    <div className="container pb-8 pt-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features & Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Learn about all the features in Traffic Manager and how they work together
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
            onClick={() => window.location.href = "/help-center"}
          >
            <Compass className="mr-2 h-4 w-4" />
            Help Center
          </Button>
          <HelpIcon text="This page provides an overview of all features and how they fit into your workflow" />
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto mb-6">
          <TabsTrigger value="overview" className="py-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="features" className="py-3">
            Feature Details
          </TabsTrigger>
          <TabsTrigger value="workflow" className="py-3">
            Workflow Summary
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="flex-1 p-0">
          <Card className="border border-border/30">
            <CardHeader>
              <CardTitle>Traffic Manager Overview</CardTitle>
              <CardDescription>
                Traffic Manager is designed to help traffic arbitrageurs manage operations, optimize traffic sources, and maximize ROI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Traffic Manager brings together all the tools you need to succeed in traffic arbitrage. From monitoring your campaigns 
                and optimizing your budget to managing infrastructure and analyzing traffic quality, every feature is designed to 
                help you maximize profits.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuresList.map(feature => (
                  <Card key={feature.id} className="border border-border/30 hover:border-neon-cyan/50 transition-all duration-200 cursor-pointer" onClick={() => {
                    setActiveTab("features");
                  }}>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/30 p-2 rounded">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg border border-border/30 mt-6">
                <h3 className="text-lg font-medium mb-2">How It All Fits Together</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Traffic Manager's features are designed to work together in a cohesive workflow that optimizes every aspect of your traffic arbitrage operation.
                </p>
                <Button onClick={() => setActiveTab("workflow")} variant="outline" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                  View Workflow Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="flex-1 p-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {featuresList.map(feature => (
                <Card key={feature.id} id={feature.id} className="border border-border/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/30 p-2 rounded">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle>{feature.name}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-neon-cyan mb-1">What It Means</h3>
                      <p className="text-muted-foreground">{feature.details.what}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-neon-cyan mb-1">How To Use It</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                        {feature.details.howToUse.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-neon-cyan mb-1">Why It's Important</h3>
                      <p className="text-muted-foreground">{feature.details.whyImportant}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-neon-cyan mb-1">Workflow</h3>
                      <p className="text-muted-foreground">{feature.details.workflow}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                        Go to {feature.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="workflow" className="flex-1 p-0">
          <Card className="border border-border/30 h-full">
            <CardHeader>
              <CardTitle>How It All Fits Together</CardTitle>
              <CardDescription>
                A comprehensive workflow to maximize your traffic arbitrage success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <p>
                  Follow this workflow to get the most out of Traffic Manager. Each step builds on the previous one to create a comprehensive 
                  system for managing and optimizing your traffic arbitrage operation.
                </p>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-neon-cyan/70 via-neon-cyan/30 to-transparent"></div>
                  <div className="space-y-8 relative">
                    {workflowSummary.map((step) => (
                      <div key={step.step} className="relative pl-10">
                        <div className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-background text-neon-cyan border-neon-cyan/50">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{step.feature}</h3>
                          <p className="text-muted-foreground">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg p-4 mt-8">
                  <h3 className="font-medium text-neon-cyan mb-2">Key Takeaway</h3>
                  <p className="text-muted-foreground">
                    By following this workflow and using each section as intended, you'll have a complete system for managing your traffic 
                    arbitrage business, understanding why each part matters, and maximizing your return on investment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Features;
