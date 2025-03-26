
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AutomationRuleProps {
  title: string
  description: string
  icon: React.ReactNode
  initialEnabled?: boolean
  onToggle?: (enabled: boolean) => void
}

export function AutomationRule({ 
  title, 
  description, 
  icon,
  initialEnabled = false,
  onToggle 
}: AutomationRuleProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [configOpen, setConfigOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  // Configuration state
  const [triggerType, setTriggerType] = useState("threshold")
  const [actionType, setActionType] = useState("notification")
  const [threshold, setThreshold] = useState([50])
  
  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    if (onToggle) {
      onToggle(checked)
    }
    
    toast({
      title: `Rule ${checked ? 'Enabled' : 'Disabled'}`,
      description: `${title} has been ${checked ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    })
  }
  
  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      // Simulate API call
      console.log("Saving configuration:", { title, triggerType, actionType, threshold: threshold[0] })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Configuration Saved",
        description: `${title} configuration has been saved successfully.`,
        duration: 3000,
      })
      
      setConfigOpen(false)
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-md border-border/80 ${
        enabled ? "hover:border-primary/20" : ""
      }`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-md ${enabled ? 'bg-primary/10' : 'bg-muted'} transition-colors duration-300`}>
                {React.cloneElement(icon as React.ReactElement, { 
                  className: `h-5 w-5 ${enabled ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-300`
                })}
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </div>
            <Switch 
              checked={enabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!enabled}
            className="transition-all duration-200 hover:bg-primary/10"
            onClick={() => setConfigOpen(true)}
          >
            Configure
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {title}</DialogTitle>
            <DialogDescription>
              Set up triggers and actions for this automation rule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select a trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="threshold">Threshold Reached</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="event">Event Triggered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {triggerType === "threshold" && (
              <div className="grid gap-2">
                <Label>Threshold Level ({threshold[0]}%)</Label>
                <Slider 
                  value={threshold} 
                  onValueChange={setThreshold} 
                  min={0} 
                  max={100} 
                  step={5} 
                />
                
                <Label htmlFor="metric">Metric</Label>
                <Select defaultValue="traffic">
                  <SelectTrigger id="metric">
                    <SelectValue placeholder="Select a metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traffic">Traffic Volume</SelectItem>
                    <SelectItem value="conversion">Conversion Rate</SelectItem>
                    <SelectItem value="cost">Cost Per Click</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {triggerType === "schedule" && (
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time"
                  type="time"
                  defaultValue="10:00"
                />
              </div>
            )}
            
            {triggerType === "event" && (
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event</Label>
                <Select defaultValue="campaign-created">
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign-created">Campaign Created</SelectItem>
                    <SelectItem value="error-detected">Error Detected</SelectItem>
                    <SelectItem value="budget-depleted">Budget Depleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="action-type">Action</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">Send Notification</SelectItem>
                  <SelectItem value="budget">Adjust Budget</SelectItem>
                  <SelectItem value="campaign">Toggle Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {actionType === "budget" && (
              <div className="grid gap-2">
                <Label>Budget Adjustment</Label>
                <div className="flex gap-4 items-center">
                  <Select defaultValue="increase">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                      <SelectItem value="set">Set to</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      defaultValue="10" 
                      className="w-[100px]"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
