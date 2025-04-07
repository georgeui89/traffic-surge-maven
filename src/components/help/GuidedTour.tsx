
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface TourStep {
  title: string;
  description: string;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  tourId: string;
  open: boolean;
  onClose: () => void;
}

const dashboardTour: TourStep[] = [
  {
    title: "Welcome to Traffic Manager!",
    description: "This quick tour will show you how to use the main features of the dashboard.",
  },
  {
    title: "Key Metrics",
    description: "These cards show your most important metrics at a glance, including today's earnings, traffic, and ROI.",
    element: "#dashboard-metrics",
  },
  {
    title: "Traffic Chart",
    description: "This chart shows your traffic performance over time. You can switch between different metrics and time periods.",
    element: "#traffic-chart",
  },
  {
    title: "Platform Status",
    description: "This section shows the current status of your connected platforms and their performance.",
    element: "#platform-status",
  },
  {
    title: "Quick Actions",
    description: "Use these buttons to quickly access common tasks like creating a campaign or connecting a platform.",
    element: "#quick-actions",
  },
  {
    title: "Customize Your Dashboard",
    description: "Click the customize button to show/hide widgets and arrange your dashboard to your liking.",
    element: "#dashboard-customize",
  },
  {
    title: "That's it!",
    description: "You've completed the dashboard tour. Explore the rest of the application to discover more features!",
  }
];

const campaignTour: TourStep[] = [
  {
    title: "Campaign Management",
    description: "This quick tour will show you how to create and manage campaigns.",
  },
  {
    title: "Create a New Campaign",
    description: "Click this button to start the campaign creation wizard.",
    element: "#create-campaign",
  },
  {
    title: "Campaign List",
    description: "This table shows all your existing campaigns and their performance metrics.",
    element: "#campaigns-table",
  },
  {
    title: "Campaign Actions",
    description: "Use these buttons to pause, activate, edit, or delete individual campaigns.",
    element: "#campaign-actions",
  },
  {
    title: "Bulk Actions",
    description: "Select multiple campaigns using checkboxes to perform actions on them at once.",
    element: "#bulk-actions",
  },
  {
    title: "That's it!",
    description: "You've completed the campaign management tour. Try creating your first campaign!",
  }
];

const analyticsTour: TourStep[] = [
  {
    title: "Traffic Analytics",
    description: "This quick tour will show you how to analyze your traffic performance.",
  },
  {
    title: "Traffic Overview",
    description: "This section provides a high-level view of your traffic performance across all platforms.",
    element: "#traffic-overview",
  },
  {
    title: "Traffic Quality",
    description: "The traffic quality chart shows how your traffic quality metrics vary over time.",
    element: "#traffic-quality",
  },
  {
    title: "Source Breakdown",
    description: "This chart shows the distribution of your traffic across different platforms.",
    element: "#traffic-sources",
  },
  {
    title: "Optimization Suggestions",
    description: "Based on your traffic data, the system provides suggestions to improve performance.",
    element: "#optimization-suggestions",
  },
  {
    title: "Filters and Controls",
    description: "Use these filters to drill down into specific time periods, platforms, or campaigns.",
    element: "#analytics-filters",
  },
  {
    title: "That's it!",
    description: "You've completed the analytics tour. Use these insights to optimize your campaigns!",
  }
];

const budgetOptimizerTour: TourStep[] = [
  {
    title: "Budget Optimizer",
    description: "This quick tour will show you how to optimize your budget allocation.",
  },
  {
    title: "Budget Input",
    description: "Set your total daily budget that will be allocated across platforms.",
    element: "#budget-input",
  },
  {
    title: "Optimization Target",
    description: "Choose what you want to optimize for: maximum ROI, maximum traffic, or balanced growth.",
    element: "#optimization-target",
  },
  {
    title: "Platform Allocation",
    description: "These sliders show the recommended budget allocation for each platform. You can manually adjust them.",
    element: "#platform-allocation",
  },
  {
    title: "Expected Results",
    description: "This section shows the projected results based on the current allocation.",
    element: "#expected-results",
  },
  {
    title: "AI Recommendations",
    description: "The AI analyzes your historical data to provide tailored optimization suggestions.",
    element: "#ai-recommendations",
  },
  {
    title: "Apply Changes",
    description: "Once you're satisfied with the allocation, click this button to save your strategy.",
    element: "#apply-budget",
  },
  {
    title: "That's it!",
    description: "You've completed the budget optimizer tour. Optimize your spending for maximum returns!",
  }
];

const tours: Record<string, TourStep[]> = {
  "dashboard": dashboardTour,
  "campaign": campaignTour,
  "analytics": analyticsTour,
  "budget-optimizer": budgetOptimizerTour
};

export default function GuidedTour({ tourId, open, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const { toast } = useToast();
  
  const tour = tours[tourId] || [];
  const currentTourStep = tour[currentStep];
  const isLastStep = currentStep === tour.length - 1;
  
  useEffect(() => {
    if (open && currentTourStep?.element) {
      // This would typically use a more sophisticated highlighting mechanism
      // but we'll use a simple approach for this implementation
      setShowHighlight(true);
      
      // Scroll to the element if it exists
      const element = document.querySelector(currentTourStep.element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return () => {
      setShowHighlight(false);
    };
  }, [currentStep, open, currentTourStep]);
  
  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const handleComplete = () => {
    toast({
      title: "Tour Completed",
      description: `You've completed the ${tourId} tour!`,
    });
    onClose();
    setCurrentStep(0);
  };
  
  const handleSkip = () => {
    toast({
      title: "Tour Skipped",
      description: "You can restart the tour anytime from the Help Center.",
    });
    onClose();
    setCurrentStep(0);
  };
  
  if (!tour.length) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentTourStep?.title || "Guided Tour"}</DialogTitle>
          <DialogDescription>
            {currentTourStep?.description || "Learn how to use this feature"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {tour.length}
            </div>
          </div>
          <Separator className="my-4" />
        </div>
        
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
          <div>
            <Button variant="ghost" onClick={handleSkip} size="sm">
              Skip Tour
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} size="sm">
                Previous
              </Button>
            )}
            <Button onClick={handleNext} size="sm">
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
