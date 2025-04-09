
import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  route?: string
  action?: () => Promise<void>
  description?: string
  quickAction?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export function QuickActionButton({ 
  icon, 
  label, 
  route, 
  action, 
  description,
  quickAction = false,
  variant = route ? "default" : "outline"
}: QuickActionProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
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
        
        toast.success(`Navigating to ${label}`, {
          description: description || `You are now viewing the ${label.toLowerCase()} section.`
        })
      }
    } catch (error) {
      console.error("Error executing quick action:", error)
      toast.error("Action Failed", {
        description: "There was an error executing this action. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button 
      className={`${quickAction ? 'h-auto py-6 flex flex-col items-center justify-center gap-2' : 'flex items-center gap-2'} shadow-modern hover:shadow-hover transition-all duration-300`}
      variant={variant}
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
