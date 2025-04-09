
import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Activity, Server, MonitorPlay, DollarSign, Zap, BarChart, TimerReset } from "lucide-react"
import { QuickActionButton } from "./QuickActionButton"

export function QuickActions() {
  const navigate = useNavigate()
  
  const handleViewEarnings = async () => {
    navigate("/reporting")
    
    toast.success("Earnings Report", {
      description: "Viewing your earnings report..."
    })
  }

  const handleViewTraffic = async () => {
    navigate("/traffic-analytics")
    
    toast.success("Traffic Analytics", {
      description: "Loading your traffic analytics dashboard..."
    })
  }

  const handleManageRDPs = async () => {
    navigate("/rdp-management")
    
    toast.success("RDP Management", {
      description: "Loading your RDP management console..."
    })
  }

  const handleCreateCampaign = async () => {
    navigate("/campaigns")
    
    toast.success("Campaign Creation", {
      description: "Opening campaign creation page..."
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
