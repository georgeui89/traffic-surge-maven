
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  BookOpen,
  VideoIcon,
  Compass,
  Settings,
  History,
  Search,
  PlayCircle,
  CalendarDays,
} from "lucide-react";
import HelpCategories from "@/components/help/HelpCategories";
import GuidedTour from "@/components/help/GuidedTour";
import WorkflowGuide from "@/components/help/WorkflowGuide";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("documentation");
  const [tourOpen, setTourOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState("dashboard");

  const startTour = (tourId: string) => {
    setSelectedTour(tourId);
    setTourOpen(true);
  };

  const tutorials = [
    {
      id: "getting-started",
      title: "Getting Started with Traffic Manager",
      description: "Learn the basics of Traffic Manager in just 5 minutes",
      duration: "5:21"
    },
    {
      id: "first-campaign",
      title: "Setting Up Your First Campaign",
      description: "A step-by-step guide to creating and configuring your first campaign",
      duration: "8:45"
    },
    {
      id: "rdp-management",
      title: "Understanding RDP Management",
      description: "How to track and optimize your RDP infrastructure",
      duration: "6:38"
    },
    {
      id: "budget-optimization",
      title: "Advanced Budget Optimization",
      description: "Maximize your ROI with intelligent budget allocation",
      duration: "7:12"
    },
    {
      id: "scripts",
      title: "Working with Scripts",
      description: "Create and test redirect scripts for improved traffic quality",
      duration: "10:05"
    },
    {
      id: "analytics",
      title: "Traffic Analytics Deep Dive",
      description: "Understanding your traffic quality and performance metrics",
      duration: "9:30"
    }
  ];

  const guidedTours = [
    {
      id: "dashboard",
      title: "Dashboard Tour",
      description: "Learn how to use the dashboard to monitor your traffic performance and earnings.",
      icon: "Compass"
    },
    {
      id: "campaign",
      title: "Campaign Management",
      description: "Learn how to create, edit and manage your traffic campaigns effectively.",
      icon: "Compass"
    },
    {
      id: "analytics",
      title: "Analytics Walkthrough",
      description: "Understand how to analyze traffic quality and performance metrics.",
      icon: "History"
    },
    {
      id: "budget-optimizer",
      title: "Budget Optimizer",
      description: "Learn how to optimize your budget allocation across platforms.",
      icon: "Settings"
    }
  ];

  const faqs = [
    { 
      question: "What is Traffic Manager?", 
      answer: "Traffic Manager is an application designed to help you centralize, analyze, and optimize your traffic arbitrage activities, specifically when using autosurf platforms and monetizing with networks like Adsterra. Our goal is to help you maximize your ROI through better tracking, calculation, and strategic decision-making." 
    },
    { 
      question: "How do I connect my traffic platforms?", 
      answer: "Navigate to Settings > Integrations, find your platform in the list, click 'Connect' for unconnected platforms, enter your API key in the modal, and click 'Save' to establish the connection. Note that not all platforms provide APIs, and some functionalities may be limited." 
    },
    { 
      question: "What is the difference between CPM and Actual CPM?", 
      answer: "CPM (cost per mille/thousand impressions) is a general advertising metric. In Traffic Manager, 'Actual CPM ($)' refers to the effective revenue you actually earn from your ad network per 1000 valid impressions for a specific traffic source. This is a crucial input that you must determine based on your reports." 
    },
    { 
      question: "How does the Budget Optimizer work?", 
      answer: "The Budget Optimizer analyzes recent performance data for each platform, then suggests how to allocate your total budget across platforms to achieve your selected goal (max ROI, max revenue, etc.). The suggestions are based on historical performance data within Traffic Manager." 
    },
    { 
      question: "What is the Script Lab feature?", 
      answer: "Script Lab lets you create, test, and manage redirect scripts that are often used on landing pages before redirecting to an offer. You can write custom JavaScript, use templates, set parameters like delay and target URL, and test the scripts' behavior. Optimizing these scripts can improve traffic quality and acceptance rates." 
    },
    { 
      question: "How accurate are the AI recommendations?", 
      answer: "The AI analyzes historical performance data within Traffic Manager to identify patterns and suggest potential optimizations. Accuracy depends on the quality and amount of data available and the inherent unpredictability of traffic arbitrage. Treat them as data-driven suggestions, not guarantees." 
    },
    { 
      question: "Can Traffic Manager automatically get my credit balance from platforms?", 
      answer: "Generally, no. Most autosurf platforms do not provide reliable APIs for this functionality. You typically need to manually update the 'Credits Earned' field in your campaigns for accurate calculations." 
    },
    { 
      question: "If I connect Adsterra, does the app calculate my revenue automatically?", 
      answer: "No. The Adsterra API connection is mainly for fetching reference data or comparing reported earnings. The core revenue calculation relies on the Actual CPM ($) and Acceptance Rate (%) you manually input per campaign." 
    }
  ];

  return (
    <div className="container pb-8 pt-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground mt-1">
            Find documentation, tutorials, and resources to help you use Traffic Manager effectively.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
            onClick={() => window.open("https://example.com/traffic-manager/support", "_blank")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-5 h-auto mb-6">
          <TabsTrigger value="documentation" className="flex gap-2 py-3 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex gap-2 py-3 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <VideoIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="guided-tours" className="flex gap-2 py-3 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Guided Tours</span>
          </TabsTrigger>
          <TabsTrigger value="workflow-guide" className="flex gap-2 py-3 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan relative">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Workflow Guide</span>
            <span className="absolute -top-1 -right-1 bg-neon-cyan text-xs px-1 py-0.5 rounded text-background font-medium">NEW</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex gap-2 py-3 data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="flex-1 p-0">
          <HelpCategories />
        </TabsContent>

        <TabsContent value="tutorials" className="flex-1 p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-card/30 rounded-lg border border-border/30 overflow-hidden">
                <div className="h-40 bg-card/50 flex items-center justify-center relative">
                  <PlayCircle className="h-12 w-12 text-neon-cyan opacity-60" />
                  <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tutorial.description}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Tutorial
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guided-tours" className="flex-1 p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidedTours.map((tour) => (
              <div key={tour.id} className="p-6 bg-card/30 rounded-lg border border-border/30">
                <Compass className="h-8 w-8 text-neon-cyan mb-4" />
                <h3 className="text-lg font-medium">{tour.title}</h3>
                <p className="text-muted-foreground mt-2">
                  {tour.description}
                </p>
                <Button onClick={() => startTour(tour.id)} className="mt-4" variant="outline">
                  Start Tour
                </Button>
              </div>
            ))}
          </div>

          <GuidedTour
            tourId={selectedTour}
            open={tourOpen}
            onClose={() => setTourOpen(false)}
          />
        </TabsContent>
        
        <TabsContent value="workflow-guide" className="flex-1 p-0">
          <WorkflowGuide />
        </TabsContent>

        <TabsContent value="faq" className="flex-1 p-0">
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-card/30 rounded-lg border border-border/30">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <p className="text-muted-foreground mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
