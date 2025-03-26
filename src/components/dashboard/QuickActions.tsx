
import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Activity, Server, MonitorPlay, DollarSign, Loader2 } from "lucide-react"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  route?: string
  action?: () => Promise<void>
}

export function QuickActionButton({ icon, label, route, action }: QuickActionProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleClick = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      if (action) {
        await action()
      } else if (route) {
        navigate(route)
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
      className="h-auto py-6 flex flex-col items-center justify-center gap-2 shadow-modern hover:shadow-hover transition-all duration-300"
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
  
  const handleViewEarnings = async () => {
    // Simulate API call to prepare earnings data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate to earnings page
    navigate("/reporting")
    
    toast({
      title: "Earnings Report",
      description: "Preparing your earnings report...",
      duration: 3000,
    })
  }

  const handleViewTraffic = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    navigate("/traffic-analytics")
  }

  const handleManageRDPs = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    navigate("/rdp-management")
  }

  const handleCreateCampaign = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    navigate("/campaigns")
  }
  
  return (
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
          />
          <QuickActionButton
            icon={<Server />}
            label="Manage RDPs"
            action={handleManageRDPs}
          />
          <QuickActionButton
            icon={<MonitorPlay />}
            label="Create Campaign"
            action={handleCreateCampaign}
          />
          <QuickActionButton
            icon={<DollarSign />}
            label="View Earnings"
            action={handleViewEarnings}
          />
        </div>
      </CardContent>
    </Card>
  )
}
