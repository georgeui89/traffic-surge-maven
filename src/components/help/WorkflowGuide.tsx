
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ClockIcon, 
  CalendarDays, 
  Calendar, 
  CheckSquare, 
  Gauge, 
  AlertCircle, 
  Server, 
  TrendingUp,
  Bell,
  PieChart,
  BarChartHorizontal,
  LayoutDashboard,
  FileBarChart,
  Settings,
  TestTube,
  HelpCircle,
  Wallet,
  Calculator,
  Trash2,
  CheckCircle2,
  LightbulbIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { HelpIcon } from "@/components/ui/help-label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskProps {
  title: string;
  description: string;
  where: string;
  what: React.ReactNode;
  why: string;
  link?: {
    text: string;
    url: string;
  };
  takeaway: string;
}

function Task({ title, description, where, what, why, link, takeaway }: TaskProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  
  return (
    <div className={cn(
      "p-4 border border-border/40 rounded-md mb-3 relative transition-all",
      isCompleted && "bg-neon-cyan/5 border-neon-cyan/30"
    )}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-base">{title}</h4>
          <Button 
            variant={isCompleted ? "default" : "outline"} 
            size="sm" 
            className={cn(
              "min-w-24",
              isCompleted && "bg-neon-cyan hover:bg-neon-cyan/90"
            )}
            onClick={() => setIsCompleted(!isCompleted)}
          >
            {isCompleted ? (
              <>
                <CheckSquare className="h-4 w-4 mr-1" />
                Completed
              </>
            ) : (
              "Mark Complete"
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          <div className="flex gap-1 items-center">
            <span className="font-medium text-sm">Where:</span>
            <span className="text-sm text-muted-foreground">{where}</span>
          </div>
          
          <div>
            <span className="font-medium text-sm">What:</span>
            <div className="text-sm text-muted-foreground ml-4 mt-1 space-y-1">
              {what}
            </div>
          </div>
          
          <div className="flex gap-1 items-center">
            <span className="font-medium text-sm">Why:</span>
            <span className="text-sm text-muted-foreground">{why}</span>
          </div>
        </div>
        
        {link && (
          <div>
            <Button 
              size="sm" 
              className="bg-neon-cyan hover:bg-neon-cyan/80 text-background"
              onClick={() => window.location.href = link.url}
            >
              {link.text}
            </Button>
          </div>
        )}
        
        <div className="bg-neon-cyan/10 border border-neon-cyan/20 p-4 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <LightbulbIcon className="h-4 w-4 text-neon-cyan" />
            <h4 className="font-medium text-neon-cyan">Key Takeaway</h4>
          </div>
          <p className="text-sm text-muted-foreground">{takeaway}</p>
        </div>
      </div>
    </div>
  );
}

function WorkflowSection({ title, icon: Icon, timeEstimate, tasks }: {
  title: string;
  icon: React.ElementType;
  timeEstimate: string;
  tasks: TaskProps[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-neon-cyan/10 rounded-full flex items-center justify-center">
          <Icon className="h-5 w-5 text-neon-cyan" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            <span>{timeEstimate}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <Task key={index} {...task} />
        ))}
      </div>
    </div>
  );
}

function BestPractice({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3 p-3 border border-border/30 rounded-md bg-card/20">
      <div className="mt-0.5">
        <CheckCircle2 className="h-5 w-5 text-neon-cyan" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function WorkflowGuide() {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string | undefined>("daily");

  const handleFeedback = (isHelpful: boolean) => {
    toast({
      title: "Thank you for your feedback!",
      description: isHelpful 
        ? "We're glad this guide was helpful." 
        : "We'll work on improving this guide based on your feedback.",
    });
  };

  const dailyTasks: TaskProps[] = [
    {
      title: "Morning Kick-off",
      description: "Start your day by checking critical metrics to catch any issues early.",
      where: "Dashboard",
      what: (
        <ul className="list-disc list-inside">
          <li>Check the <Tooltip><TooltipTrigger><span className="font-medium text-foreground underline decoration-dotted">Current Daily Earnings ($)</span></TooltipTrigger><TooltipContent className="max-w-xs">Shows your current earnings for the day against your daily goal</TooltipContent></Tooltip> gauge – how's the pace towards your goal?</li>
          <li>Scan <span className="font-medium text-foreground">Platform Status</span> – any red flags (Errors/Warnings)? Address immediately if critical.</li>
          <li>Check <span className="font-medium text-foreground">Active RDPs</span> count/status in the summary card – are all expected RDPs running?</li>
          <li>Glance at the hourly <span className="font-medium text-foreground">Traffic Trends</span> chart – any sharp drops overnight?</li>
          <li>Check for critical alerts in the notifications area.</li>
        </ul>
      ),
      why: "Catch major system failures or sudden performance drops ASAP to minimize lost revenue.",
      link: {
        text: "Go to Dashboard",
        url: "/dashboard"
      },
      takeaway: "Early checks catch issues before they impact your daily revenue goals."
    },
    {
      title: "Periodic Credit Updates",
      description: "Keep your data accurate by updating credits throughout the day.",
      where: "Campaign Management",
      what: (
        <ul className="list-disc list-inside">
          <li>Log into autosurf platforms and note down <span className="font-medium text-foreground">credits earned</span> for each active campaign.</li>
          <li>In Traffic Manager's <span className="font-medium text-foreground">Campaign Management</span> table, manually input the latest <Tooltip><TooltipTrigger><span className="font-medium text-foreground underline decoration-dotted">Credits Earned</span></TooltipTrigger><TooltipContent className="max-w-xs">The number of credits you've earned from an autosurf platform, which is used to calculate visits</TooltipContent></Tooltip> figures.</li>
        </ul>
      ),
      why: "Keeps dashboard and analytics current for accurate calculations.",
      link: {
        text: "Go to Campaign Management",
        url: "/campaigns"
      },
      takeaway: "Regular updates maintain calculation accuracy throughout the day."
    },
    {
      title: "End-of-Day Review",
      description: "Compare actual earnings with projections and adjust campaigns as needed.",
      where: "Dashboard, Traffic Analytics, Adsterra Account",
      what: (
        <ul className="list-disc list-inside">
          <li>Check final <span className="font-medium text-foreground">Daily Earnings</span> on the Dashboard.</li>
          <li>Log into Adsterra to compare actual earnings with Traffic Manager's calculations.</li>
          <li>Investigate discrepancies using <span className="font-medium text-foreground">Traffic Analytics</span> – check for drops in acceptance or performance.</li>
          <li>Review daily ROI per campaign in <span className="font-medium text-foreground">Campaign Management</span> – pause any campaigns losing money.</li>
        </ul>
      ),
      why: "Ensures accurate revenue tracking and prevents losses.",
      link: {
        text: "Go to Traffic Analytics",
        url: "/traffic-analytics"
      },
      takeaway: "Daily diligence ensures you catch issues early and keep your data up-to-date for better decision-making."
    }
  ];

  const weeklyTasks: TaskProps[] = [
    {
      title: "Deep Performance Review",
      description: "Analyze weekly trends and update your campaign parameters for accuracy.",
      where: "Traffic Analytics, Reporting, Campaign Management",
      what: (
        <ul className="list-disc list-inside">
          <li>Set <span className="font-medium text-foreground">Traffic Analytics</span> date range to "Last 7 Days".</li>
          <li>Analyze <span className="font-medium text-foreground">Platform Acceptance Rates</span> – which platforms deliver quality traffic accepted by Adsterra?</li>
          <li>Analyze <span className="font-medium text-foreground">Revenue per Platform</span> and <span className="font-medium text-foreground">ROI per Platform</span> – which are most profitable after costs?</li>
          <li>Generate a <span className="font-medium text-foreground">Performance Overview</span> or <span className="font-medium text-foreground">Revenue Analysis</span> report from <span className="font-medium text-foreground">Reporting</span>.</li>
          <li>Update <Tooltip><TooltipTrigger><span className="font-medium text-foreground underline decoration-dotted">Actual CPM ($)</span></TooltipTrigger><TooltipContent className="max-w-xs">The effective revenue earned per 1000 valid impressions from your ad network</TooltipContent></Tooltip> and <Tooltip><TooltipTrigger><span className="font-medium text-foreground underline decoration-dotted">Acceptance Rate (%)</span></TooltipTrigger><TooltipContent className="max-w-xs">Percentage of traffic visits that result in valid impressions counted by your ad network</TooltipContent></Tooltip> inputs in <span className="font-medium text-foreground">Campaign Management</span>.</li>
        </ul>
      ),
      why: "Trends become clearer over a week. Updating inputs keeps calculations accurate.",
      link: {
        text: "Go to Traffic Analytics",
        url: "/traffic-analytics"
      },
      takeaway: "Weekly analysis reveals patterns that might be hidden in daily fluctuations."
    },
    {
      title: "Budget & Resource Optimization",
      description: "Allocate your budget and resources to maximize ROI based on performance data.",
      where: "Budget Optimizer, RDP Scaler, RDP Management",
      what: (
        <ul className="list-disc list-inside">
          <li>Use <span className="font-medium text-foreground">Budget Optimizer</span> to review AI recommendations and adjust budget allocations.</li>
          <li>Use <span className="font-medium text-foreground">RDP Scaler</span> to evaluate scaling up/down RDPs based on ROI.</li>
          <li>Review <span className="font-medium text-foreground">RDP Efficiency</span> report to ensure costs align with revenue.</li>
        </ul>
      ),
      why: "Shift resources towards proven profitable strategies.",
      link: {
        text: "Go to Budget Optimizer",
        url: "/budget-optimizer"
      },
      takeaway: "Weekly resource reallocation maximizes ROI by focusing on what works."
    },
    {
      title: "Experiment Review & Script Check",
      description: "Review test results and implement winning strategies.",
      where: "Script Lab, Campaign Management",
      what: (
        <ul className="list-disc list-inside">
          <li>Review A/B test performance in <span className="font-medium text-foreground">Script Lab</span> and implement winners.</li>
          <li>Check campaigns with experimental settings for performance.</li>
          <li>Review redirect scripts for issues or improvements.</li>
        </ul>
      ),
      why: "Continuous improvement through testing.",
      link: {
        text: "Go to Script Lab",
        url: "/script-lab"
      },
      takeaway: "Regular experimentation and analysis leads to incremental performance gains."
    }
  ];

  const monthlyTasks: TaskProps[] = [
    {
      title: "Financial Reconciliation",
      description: "Verify overall profitability and make strategic platform decisions.",
      where: "Reporting, Adsterra Account, Bank/Payment records",
      what: (
        <ul className="list-disc list-inside">
          <li>Generate monthly reports (<span className="font-medium text-foreground">Performance Overview</span>, <span className="font-medium text-foreground">Revenue Analysis</span>, <span className="font-medium text-foreground">RDP Efficiency</span>).</li>
          <li>Compare Traffic Manager's calculated net profit with actual cash received from Adsterra.</li>
          <li>Analyze long-term ROI trends per platform.</li>
        </ul>
      ),
      why: "Verify true profitability and make decisions about platform viability.",
      link: {
        text: "Go to Reporting",
        url: "/reporting"
      },
      takeaway: "Monthly financial review ensures your business remains profitable and strategies are working."
    },
    {
      title: "Strategic Planning",
      description: "Review long-term trends and set goals for the next month.",
      where: "Traffic Analytics, Budget Optimizer, Settings",
      what: (
        <ul className="list-disc list-inside">
          <li>Review 90-day trends in <span className="font-medium text-foreground">Traffic Analytics</span>.</li>
          <li>Consider strategic shifts (e.g., drop/add platforms, scale investments).</li>
          <li>Set the <span className="font-medium text-foreground">Daily Revenue Goal</span> for the next month in <span className="font-medium text-foreground">Settings</span>.</li>
          <li>Plan the budget strategy using <span className="font-medium text-foreground">Budget Optimizer</span>.</li>
        </ul>
      ),
      why: "Make forward-looking decisions for growth and sustainability.",
      link: {
        text: "Go to Traffic Analytics",
        url: "/traffic-analytics"
      },
      takeaway: "Monthly strategic review keeps your operation aligned with long-term goals."
    },
    {
      title: "System Maintenance & Cleanup",
      description: "Keep your workspace organized by archiving old data.",
      where: "Campaign Management, RDP Management, Script Lab",
      what: (
        <ul className="list-disc list-inside">
          <li>Archive old campaigns, remove unused RDPs, clean up old scripts in <span className="font-medium text-foreground">Script Lab</span>.</li>
        </ul>
      ),
      why: "Keep the app interface clean and focused.",
      link: {
        text: "Go to Campaign Management",
        url: "/campaigns"
      },
      takeaway: "A clean system supports efficient daily work."
    }
  ];

  const bestPractices = [
    {
      title: "Data Integrity",
      description: "Keep inputs (e.g., credits, CPM) accurate for reliable decisions."
    },
    {
      title: "Proactive Monitoring",
      description: "Respond quickly to issues to prevent revenue leaks."
    },
    {
      title: "Incremental Optimization",
      description: "Small tweaks compound into big wins over time."
    },
    {
      title: "Strategic Alignment",
      description: "Ensure daily tasks support long-term goals."
    },
    {
      title: "Continuous Learning",
      description: "Revisit the Help Center to master features and improve workflows."
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-neon-cyan flex items-center">
            Traffic Strategy Workflow
            <span className="ml-2 bg-neon-cyan text-xs px-1 py-0.5 rounded text-background font-medium">NEW</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            A step-by-step guide for traffic arbitrageurs to efficiently manage traffic sources, optimize costs, and make data-driven decisions using Traffic Manager.
          </p>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 mb-6 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
          <h3 className="font-medium mb-3">Introduction</h3>
          <p className="text-sm text-muted-foreground">
            This guide provides a structured approach for traffic arbitrageurs to manage their campaigns effectively. 
            Follow these daily, weekly, and monthly workflows to optimize your traffic sources and maximize ROI. 
            Each section outlines specific tasks with clear objectives, instructions, and key takeaways.
          </p>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          defaultValue="daily"
          value={expandedSection}
          onValueChange={setExpandedSection}
          className="mb-6"
        >
          <AccordionItem value="daily" className="border-border/30">
            <AccordionTrigger className="py-4 hover:bg-neon-cyan/5 hover:no-underline px-3 rounded-lg">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-neon-cyan/10 rounded-full flex items-center justify-center mr-3">
                  <CalendarDays className="h-4 w-4 text-neon-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Daily Workflow: The Pulse Check & Maintenance</h3>
                  <p className="text-sm text-muted-foreground">20-45 minutes total, spread throughout the day</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <WorkflowSection
                title="Daily Tasks"
                icon={Gauge}
                timeEstimate="20-45 minutes total"
                tasks={dailyTasks}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="weekly" className="border-border/30">
            <AccordionTrigger className="py-4 hover:bg-neon-cyan/5 hover:no-underline px-3 rounded-lg">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-neon-cyan/10 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-neon-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Weekly Workflow: The Optimization Cycle</h3>
                  <p className="text-sm text-muted-foreground">1-2 hours total, usually done on a specific day</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <WorkflowSection
                title="Weekly Tasks"
                icon={BarChartHorizontal}
                timeEstimate="1-2 hours total"
                tasks={weeklyTasks}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="monthly" className="border-border/30">
            <AccordionTrigger className="py-4 hover:bg-neon-cyan/5 hover:no-underline px-3 rounded-lg">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-neon-cyan/10 rounded-full flex items-center justify-center mr-3">
                  <CalendarDays className="h-4 w-4 text-neon-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Monthly Workflow: The Strategic Overview</h3>
                  <p className="text-sm text-muted-foreground">1-2 hours total</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <WorkflowSection
                title="Monthly Tasks"
                icon={FileBarChart}
                timeEstimate="1-2 hours total"
                tasks={monthlyTasks}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="p-6 bg-card/30 rounded-lg border border-border/30 mb-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-neon-cyan" />
            Best Practices
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {bestPractices.map((practice, index) => (
              <BestPractice 
                key={index} 
                title={practice.title} 
                description={practice.description} 
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-card/10 rounded-lg border border-border/30 mb-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-neon-cyan" />
            Workflow Terminology
          </h3>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="text-sm">
              <span className="font-medium">Actual CPM ($):</span>
              <span className="text-muted-foreground ml-2">The effective revenue earned per 1000 valid impressions from your ad network.</span>
              <HelpIcon text="This is a crucial input that directly affects revenue calculations. It must be determined from your ad network reporting." className="inline-block ml-1" />
            </div>
            <div className="text-sm">
              <span className="font-medium">Acceptance Rate (%):</span>
              <span className="text-muted-foreground ml-2">Percentage of traffic visits that result in valid impressions counted by your ad network.</span>
              <HelpIcon text="This varies by traffic source quality. Higher is better, and directly impacts revenue." className="inline-block ml-1" />
            </div>
            <div className="text-sm">
              <span className="font-medium">ROI (Return on Investment):</span>
              <span className="text-muted-foreground ml-2">Calculated as ((Revenue - Cost) / Cost) * 100%. Shows campaign profitability.</span>
              <HelpIcon text="A positive ROI means you're making money; negative means you're losing money." className="inline-block ml-1" />
            </div>
            <div className="text-sm">
              <span className="font-medium">Credits:</span>
              <span className="text-muted-foreground ml-2">The currency of autosurf platforms, usually converted to visits using the Conversion Factor.</span>
              <HelpIcon text="Different platforms use different credit systems (seconds, points, hits, etc)." className="inline-block ml-1" />
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="bg-card/10 rounded-lg border border-border/30 p-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">Was this workflow guide helpful? Let us know!</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="min-w-20"
              onClick={() => handleFeedback(false)}
            >
              No
            </Button>
            <Button 
              size="sm"
              className="bg-neon-cyan hover:bg-neon-cyan/90 text-background min-w-20"
              onClick={() => handleFeedback(true)}
            >
              Yes
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
