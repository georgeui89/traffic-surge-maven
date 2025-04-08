
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
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { HelpIcon } from "@/components/ui/help-label";

interface TaskProps {
  title: string;
  description: string;
  link?: {
    text: string;
    url: string;
  };
}

function Task({ title, description, link }: TaskProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  
  return (
    <div className={cn(
      "p-4 border border-border/40 rounded-md mb-3 relative transition-all",
      isCompleted && "bg-neon-cyan/5 border-neon-cyan/30"
    )}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-medium text-base">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {link && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-neon-cyan hover:text-neon-cyan/80 hover:bg-neon-cyan/10 mt-2 px-0"
              onClick={() => window.location.href = link.url}
            >
              <span>{link.text}</span>
            </Button>
          )}
        </div>
        
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
    </div>
  );
}

function WorkflowSection({ title, icon: Icon, timeEstimate, where, what, why, tasks, takeaway, link }: {
  title: string;
  icon: React.ElementType;
  timeEstimate: string;
  where: string;
  what: React.ReactNode;
  why: string;
  tasks?: TaskProps[];
  takeaway: string;
  link?: {
    text: string;
    url: string;
  };
}) {
  return (
    <div className="mb-6 bg-card/30 rounded-lg border border-border/30 p-6">
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
      
      <div className="mb-4">
        <div className="flex gap-1 items-center mb-1">
          <span className="font-medium text-sm">Where:</span>
          <span className="text-sm text-muted-foreground">{where}</span>
        </div>
        
        <div className="mb-1">
          <span className="font-medium text-sm">What:</span>
          <div className="text-sm text-muted-foreground ml-4 mt-1 space-y-1">
            {what}
          </div>
        </div>
        
        <div className="flex gap-1 items-center mb-3">
          <span className="font-medium text-sm">Why:</span>
          <span className="text-sm text-muted-foreground">{why}</span>
        </div>
      </div>
      
      {tasks && tasks.length > 0 && (
        <div className="mb-4">
          {tasks.map((task, index) => (
            <Task key={index} {...task} />
          ))}
        </div>
      )}
      
      {link && (
        <div className="mb-4">
          <Button 
            className="bg-neon-cyan hover:bg-neon-cyan/80 text-black" 
            size="sm"
            onClick={() => window.location.href = link.url}
          >
            {link.text}
          </Button>
        </div>
      )}
      
      <div className="bg-neon-cyan/10 border border-neon-cyan/20 p-4 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <CheckSquare className="h-4 w-4 text-neon-cyan" />
          <h4 className="font-medium text-neon-cyan">Key Takeaway</h4>
        </div>
        <p className="text-sm text-muted-foreground">{takeaway}</p>
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
                title="Morning Kick-off"
                icon={Gauge}
                timeEstimate="5-10 minutes"
                where="Dashboard"
                what={
                  <ul className="list-disc list-inside">
                    <li>Check the <span className="font-medium text-foreground">Current Daily Earnings ($)</span> gauge – how's the pace towards your goal?</li>
                    <li>Scan <span className="font-medium text-foreground">Platform Status</span> – any red flags (Errors/Warnings)? Address immediately if critical.</li>
                    <li>Check <span className="font-medium text-foreground">Active RDPs</span> count/status in the summary card – are all expected RDPs running?</li>
                    <li>Glance at the hourly <span className="font-medium text-foreground">Traffic Trends</span> chart – any sharp drops overnight?</li>
                    <li>Check for critical alerts in the notifications area.</li>
                  </ul>
                }
                why="Catch major system failures or sudden performance drops ASAP to minimize lost revenue."
                link={{
                  text: "Go to Dashboard",
                  url: "/dashboard"
                }}
                takeaway="Early checks catch issues before they impact your daily revenue goals."
              />

              <WorkflowSection
                title="Mid-day / Periodic Credit Updates"
                icon={TrendingUp}
                timeEstimate="5-10 minutes per check, 1-3 times daily"
                where="Campaign Management"
                what={
                  <ul className="list-disc list-inside">
                    <li>Log into autosurf platforms and note down <span className="font-medium text-foreground">credits earned</span> for each active campaign.</li>
                    <li>In Traffic Manager's <span className="font-medium text-foreground">Campaign Management</span> table, manually input the latest <span className="font-medium text-foreground">Credits Earned</span> figures.</li>
                  </ul>
                }
                why="Keeps dashboard and analytics current for accurate calculations."
                link={{
                  text: "Go to Campaign Management",
                  url: "/campaigns"
                }}
                takeaway="Regular updates maintain calculation accuracy throughout the day."
              />

              <WorkflowSection
                title="Adsterra Reconciliation & End-of-Day Review"
                icon={PieChart}
                timeEstimate="10-25 minutes"
                where="Dashboard, Traffic Analytics, Adsterra Account"
                what={
                  <ul className="list-disc list-inside">
                    <li>Check final <span className="font-medium text-foreground">Daily Earnings</span> on the Dashboard.</li>
                    <li>Log into Adsterra to compare actual earnings with Traffic Manager's calculations.</li>
                    <li>Investigate discrepancies using <span className="font-medium text-foreground">Traffic Analytics</span> – check for drops in acceptance or performance.</li>
                    <li>Review daily ROI per campaign in <span className="font-medium text-foreground">Campaign Management</span> – pause any campaigns losing money.</li>
                  </ul>
                }
                why="Ensures accurate revenue tracking and prevents losses."
                link={{
                  text: "Go to Traffic Analytics",
                  url: "/traffic-analytics"
                }}
                takeaway="Daily diligence ensures you catch issues early and keep your data up-to-date for better decision-making."
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
                title="Deep Performance Review & Input Refinement"
                icon={BarChartHorizontal}
                timeEstimate="30-60 minutes"
                where="Traffic Analytics, Reporting, Campaign Management, Settings"
                what={
                  <ul className="list-disc list-inside">
                    <li>Set <span className="font-medium text-foreground">Traffic Analytics</span> date range to "Last 7 Days".</li>
                    <li>Analyze <span className="font-medium text-foreground">Platform Acceptance Rates</span> – which platforms deliver quality traffic accepted by Adsterra?</li>
                    <li>Analyze <span className="font-medium text-foreground">Revenue per Platform</span> and <span className="font-medium text-foreground">ROI per Platform</span> – which are most profitable after costs?</li>
                    <li>Generate a <span className="font-medium text-foreground">Performance Overview</span> or <span className="font-medium text-foreground">Revenue Analysis</span> report from <span className="font-medium text-foreground">Reporting</span>.</li>
                    <li>Update <span className="font-medium text-foreground">Actual CPM ($)</span> and <span className="font-medium text-foreground">Acceptance Rate (%)</span> inputs in <span className="font-medium text-foreground">Campaign Management</span> based on the past week's performance.</li>
                  </ul>
                }
                why="Trends become clearer over a week. Updating inputs keeps calculations accurate."
                link={{
                  text: "Go to Traffic Analytics",
                  url: "/traffic-analytics"
                }}
                takeaway="Weekly analysis reveals patterns that might be hidden in daily fluctuations."
              />

              <WorkflowSection
                title="Budget & Resource Optimization"
                icon={Calculator}
                timeEstimate="20-40 minutes"
                where="Budget Optimizer, RDP Scaler, RDP Management, Reporting"
                what={
                  <ul className="list-disc list-inside">
                    <li>Use <span className="font-medium text-foreground">Budget Optimizer</span> to review AI recommendations and adjust budget allocations.</li>
                    <li>Use <span className="font-medium text-foreground">RDP Scaler</span> to evaluate scaling up/down RDPs based on ROI.</li>
                    <li>Review <span className="font-medium text-foreground">RDP Efficiency</span> report to ensure costs align with revenue.</li>
                  </ul>
                }
                why="Shift resources towards proven profitable strategies."
                link={{
                  text: "Go to Budget Optimizer",
                  url: "/budget-optimizer"
                }}
                takeaway="Weekly resource reallocation maximizes ROI by focusing on what works."
              />

              <WorkflowSection
                title="Experiment Review & Script Check"
                icon={TestTube}
                timeEstimate="15-30 minutes"
                where="Script Lab, Campaign Management"
                what={
                  <ul className="list-disc list-inside">
                    <li>Review A/B test performance in <span className="font-medium text-foreground">Script Lab</span> and implement winners.</li>
                    <li>Check campaigns with experimental settings for performance.</li>
                    <li>Review redirect scripts for issues or improvements.</li>
                  </ul>
                }
                why="Continuous improvement through testing."
                link={{
                  text: "Go to Script Lab",
                  url: "/script-lab"
                }}
                takeaway="Regular experimentation and analysis leads to incremental performance gains."
              />

              <WorkflowSection
                title="Review Help Center / Documentation"
                icon={HelpCircle}
                timeEstimate="10 minutes (Optional)"
                where="Help Center"
                what={
                  <ul className="list-disc list-inside">
                    <li>Browse for articles or tutorials to improve usage of features.</li>
                  </ul>
                }
                why="Continuous learning to maximize the tool's value."
                link={{
                  text: "Go to Help Center",
                  url: "/help-center"
                }}
                takeaway="Weekly optimization ensures you're focusing on what works and improving what doesn't."
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
                title="Financial Reconciliation & Profitability Assessment"
                icon={Wallet}
                timeEstimate="30-60 minutes"
                where="Reporting, Adsterra Account, Bank/Payment records"
                what={
                  <ul className="list-disc list-inside">
                    <li>Generate monthly reports (<span className="font-medium text-foreground">Performance Overview</span>, <span className="font-medium text-foreground">Revenue Analysis</span>, <span className="font-medium text-foreground">RDP Efficiency</span>).</li>
                    <li>Compare Traffic Manager's calculated net profit with actual cash received from Adsterra.</li>
                    <li>Analyze long-term ROI trends per platform.</li>
                  </ul>
                }
                why="Verify true profitability and make decisions about platform viability."
                link={{
                  text: "Go to Reporting",
                  url: "/reporting"
                }}
                takeaway="Monthly financial review ensures your business remains profitable and strategies are working."
              />

              <WorkflowSection
                title="Strategic Review & Planning"
                icon={Settings}
                timeEstimate="30-45 minutes"
                where="Traffic Analytics, Budget Optimizer, RDP Scaler, Platform Management"
                what={
                  <ul className="list-disc list-inside">
                    <li>Review 90-day trends in <span className="font-medium text-foreground">Traffic Analytics</span>.</li>
                    <li>Consider strategic shifts (e.g., drop/add platforms, scale investments).</li>
                    <li>Set the <span className="font-medium text-foreground">Daily Revenue Goal</span> for the next month in <span className="font-medium text-foreground">Settings</span>.</li>
                    <li>Plan the budget strategy using <span className="font-medium text-foreground">Budget Optimizer</span>.</li>
                  </ul>
                }
                why="Make forward-looking decisions for growth and sustainability."
                link={{
                  text: "Go to Traffic Analytics",
                  url: "/traffic-analytics"
                }}
                takeaway="Monthly strategic review keeps your operation aligned with long-term goals."
              />

              <WorkflowSection
                title="System Maintenance & Cleanup"
                icon={Trash2}
                timeEstimate="15-30 minutes"
                where="Campaign Management, RDP Management, Script Lab"
                what={
                  <ul className="list-disc list-inside">
                    <li>Archive old campaigns, remove unused RDPs, clean up old scripts in <span className="font-medium text-foreground">Script Lab</span>.</li>
                  </ul>
                }
                why="Keep the app interface clean and focused."
                link={{
                  text: "Go to Campaign Management",
                  url: "/campaigns"
                }}
                takeaway="Monthly reviews help you plan strategically and ensure long-term profitability."
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="p-4 bg-card/20 rounded-lg border border-border/30 mb-6">
          <h3 className="font-medium mb-2 flex items-center gap-2">
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
