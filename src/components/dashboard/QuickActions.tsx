
import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Activity, Server, MonitorPlay, DollarSign, Loader2, Zap, BarChart, TimerReset } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CampaignCreateDialog } from "@/components/campaign/CampaignCreateDialog"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  route?: string
  action?: () => Promise<void>
  description?: string
  quickAction?: boolean
}

export function QuickActionButton({ 
  icon, 
  label, 
  route, 
  action, 
  description,
  quickAction = false
}: QuickActionProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleClick = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 600))
      
      if (action) {
        await action()
      } else if (route) {
        navigate(route)
        
        toast({
          title: `Navigating to ${label}`,
          description: description || `You are now viewing the ${label.toLowerCase()} section.`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error executing quick action:", error)
      toast({
        title: "Action Failed",
        description: "There was an error executing this action. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button 
      className={`${quickAction ? 'h-auto py-6 flex flex-col items-center justify-center gap-2' : 'flex items-center gap-2'} shadow-modern hover:shadow-hover transition-all duration-300`}
      variant={route ? "default" : "outline"}
      onClick={handleClick}
      disabled={loading}
      id={`quick-action-${label.toLowerCase().replace(/\s+/g, '-')}`}
      data-testid={`quick-action-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })
      )}
      <span>{label}</span>
    </Button>
  )
}

export function QuickActions() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  
  const handleViewEarnings = async () => {
    navigate("/reporting")
    
    toast({
      title: "Earnings Report",
      description: "Viewing your earnings report...",
      duration: 3000,
    })
  }

  const handleViewTraffic = async () => {
    navigate("/traffic-analytics")
    
    toast({
      title: "Traffic Analytics",
      description: "Loading your traffic analytics dashboard...",
      duration: 3000,
    })
  }

  const handleManageRDPs = async () => {
    navigate("/rdp-management")
    
    toast({
      title: "RDP Management",
      description: "Loading your RDP management console...",
      duration: 3000,
    })
  }

  const handleCreateCampaign = async () => {
    navigate("/campaigns")
    
    toast({
      title: "Campaign Creation",
      description: "Opening campaign creation page...",
      duration: 3000,
    })
  }
  
  return (
    <>
      <Card className="shadow-modern hover:shadow-hover transition-all duration-300 border border-border/30 mb-8">
        <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<Activity />}
              label="View Traffic"
              action={handleViewTraffic}
              description="Viewing detailed traffic analytics and statistics."
              quickAction={true}
            />
            <QuickActionButton
              icon={<Server />}
              label="Manage RDPs"
              action={handleManageRDPs}
              description="Managing your RDP instances and configurations."
              quickAction={true}
            />
            <QuickActionButton
              icon={<MonitorPlay />}
              label="Create Campaign"
              action={handleCreateCampaign}
              description="Starting the campaign creation process."
              quickAction={true}
            />
            <QuickActionButton
              icon={<DollarSign />}
              label="View Earnings"
              action={handleViewEarnings}
              description="Viewing your detailed earnings reports and statistics."
              quickAction={true}
            />
          </div>
        </CardContent>
        
        <CardContent className="px-4 pb-4 pt-0">
          <div className="pt-4 border-t border-border/30">
            <h3 className="text-sm font-medium mb-3">Additional Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <QuickActionButton
                icon={<Zap />}
                label="Automation"
                route="/automation"
                description="Managing your automation rules and settings."
              />
              <QuickActionButton
                icon={<BarChart />}
                label="Budget Optimizer"
                route="/budget-optimizer"
                description="Optimizing your budget allocation across platforms."
              />
              <QuickActionButton
                icon={<TimerReset />}
                label="CPM Calculator"
                route="/cpm-calculator"
                description="Calculating CPM rates and estimating earnings."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
