
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
} from "lucide-react";
import HelpCategories from "@/components/help/HelpCategories";
import GuidedTour from "@/components/help/GuidedTour";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("documentation");
  const [tourOpen, setTourOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState("dashboard");

  const startTour = (tourId: string) => {
    setSelectedTour(tourId);
    setTourOpen(true);
  };

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
        <TabsList className="grid w-full grid-cols-4 h-auto mb-6">
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
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="bg-card/30 rounded-lg border border-border/30 overflow-hidden">
                <div className="h-40 bg-card/50 flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-neon-cyan opacity-60" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">
                    {i === 0
                      ? "Getting Started with Traffic Manager"
                      : i === 1
                      ? "Setting Up Your First Campaign"
                      : i === 2
                      ? "Understanding RDP Management"
                      : i === 3
                      ? "Advanced Budget Optimization"
                      : i === 4
                      ? "Working with Scripts"
                      : "Traffic Analytics Deep Dive"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    [Tutorial description placeholder with timing information]
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
            <div className="p-6 bg-card/30 rounded-lg border border-border/30">
              <Compass className="h-8 w-8 text-neon-cyan mb-4" />
              <h3 className="text-lg font-medium">Dashboard Tour</h3>
              <p className="text-muted-foreground mt-2">
                Learn how to use the dashboard to monitor your traffic performance and earnings.
              </p>
              <Button onClick={() => startTour("dashboard")} className="mt-4" variant="outline">
                Start Tour
              </Button>
            </div>
            <div className="p-6 bg-card/30 rounded-lg border border-border/30">
              <Compass className="h-8 w-8 text-neon-cyan mb-4" />
              <h3 className="text-lg font-medium">Campaign Management</h3>
              <p className="text-muted-foreground mt-2">
                Learn how to create, edit and manage your traffic campaigns effectively.
              </p>
              <Button onClick={() => startTour("campaign")} className="mt-4" variant="outline">
                Start Tour
              </Button>
            </div>
            <div className="p-6 bg-card/30 rounded-lg border border-border/30">
              <Settings className="h-8 w-8 text-neon-cyan mb-4" />
              <h3 className="text-lg font-medium">Platform Integration</h3>
              <p className="text-muted-foreground mt-2">
                Learn how to connect traffic platforms and manage API keys.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="p-6 bg-card/30 rounded-lg border border-border/30">
              <History className="h-8 w-8 text-neon-cyan mb-4" />
              <h3 className="text-lg font-medium">RDP Management</h3>
              <p className="text-muted-foreground mt-2">
                Learn how to manage your RDPs and track their performance.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>

          <GuidedTour
            tourId={selectedTour}
            open={tourOpen}
            onClose={() => setTourOpen(false)}
          />
        </TabsContent>

        <TabsContent value="faq" className="flex-1 p-0">
          <div className="space-y-6">
            {[
              { 
                question: "What is Traffic Manager?", 
                answer: "[Comprehensive explanation of the Traffic Manager application, its purpose, and key features.]" 
              },
              { 
                question: "How do I connect my traffic platforms?", 
                answer: "[Step-by-step explanation of how to connect traffic platforms using API keys through the Settings > Integrations section.]" 
              },
              { 
                question: "What is the difference between CPM and Actual CPM?", 
                answer: "[Explanation of CPM (cost per mille/thousand impressions) versus Actual CPM which accounts for acceptance rate and other factors.]" 
              },
              { 
                question: "How does the Budget Optimizer work?", 
                answer: "[Explanation of how the Budget Optimizer analyzes platform performance and recommends optimal budget allocation to maximize ROI.]" 
              },
              { 
                question: "What is the Script Lab feature?", 
                answer: "[Explanation of the Script Lab feature, its purpose for testing and optimizing traffic scripts, and how to use A/B testing functionality.]" 
              },
              { 
                question: "How accurate are the AI recommendations?", 
                answer: "[Information about how AI recommendations work, what data they're based on, and typical accuracy expectations.]" 
              },
            ].map((faq, i) => (
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
