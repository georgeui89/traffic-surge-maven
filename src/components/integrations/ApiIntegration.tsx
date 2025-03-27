import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2, AlertTriangle, Copy, RefreshCw, Plus, MoreHorizontal, Trash, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ApiConnectionProps {
  platformName: string
  icon: React.ReactNode
  description: string
  connectionStatus: 'not-connected' | 'connected' | 'syncing' | 'error'
  lastSync: string | null
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
  onSync: () => Promise<void>
  errorMessage: string | null
}

export function ApiConnection({
  platformName,
  icon,
  description,
  connectionStatus,
  lastSync,
  onConnect,
  onDisconnect,
  onSync,
  errorMessage
}: ApiConnectionProps) {
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()
  
  const handleConnect = async () => {
    setConnecting(true)
    try {
      await onConnect()
      toast({
        title: "Connected",
        description: `Successfully connected to ${platformName}.`,
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platformName}. Please check your credentials.`,
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }
  
  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await onDisconnect()
      toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${platformName}.`,
      })
    } catch (error) {
      console.error("Disconnection error:", error)
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect from ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setDisconnecting(false)
    }
  }
  
  const handleSync = async () => {
    setSyncing(true)
    try {
      await onSync()
      toast({
        title: "Sync Complete",
        description: `Successfully synced data from ${platformName}.`,
      })
    } catch (error) {
      console.error("Sync error:", error)
      toast({
        title: "Sync Failed",
        description: `Failed to sync data from ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }
  
  let statusBadge
  
  if (connecting) {
    statusBadge = (
      <StatusBadge 
        variant="info" 
        label="Connecting..." 
        withDot 
        loading
      />
    )
  } else if (disconnecting) {
    statusBadge = (
      <StatusBadge 
        variant="info" 
        label="Disconnecting..." 
        withDot 
        loading
      />
    )
  } else if (syncing) {
    statusBadge = (
      <StatusBadge 
        variant="info" 
        label="Syncing data..." 
        withDot 
        loading
      />
    )
  } else if (connectionStatus == 'connected') {
    statusBadge = (
      <StatusBadge 
        variant="success" 
        label="Connected" 
        withDot 
      />
    )
  } else if (connectionStatus == 'error') {
    statusBadge = (
      <StatusBadge 
        variant="destructive" 
        label="Error" 
        withDot 
      />
    )
  } else {
    statusBadge = (
      <StatusBadge 
        variant="secondary" 
        label="Not Connected" 
        withDot={false}
      />
    )
  }
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-muted">
            {icon}
          </div>
          <CardTitle className="text-base">{platformName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            {statusBadge}
          </div>
          
          {lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Sync:</span>
              <span className="text-sm">{lastSync}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="mt-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 inline-block mr-1" />
              {errorMessage}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {connectionStatus == 'connected' ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleDisconnect} 
              disabled={disconnecting}
              id={`disconnect-${platformName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {disconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
            
            <Button 
              onClick={handleSync} 
              disabled={syncing}
              id={`sync-${platformName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {syncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Sync Data"
              )}
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            id={`connect-${platformName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

interface CredentialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platformName: string
  onSave: (credentials: Record<string, string>) => Promise<void>
  credentialFields: {
    label: string
    key: string
    type?: string
  }[]
}

export function CredentialsDialog({
  open,
  onOpenChange,
  platformName,
  onSave,
  credentialFields
}: CredentialsDialogProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  const handleInputChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }))
  }
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(credentials)
      toast({
        title: "Credentials Saved",
        description: `Successfully saved credentials for ${platformName}.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving credentials:", error)
      toast({
        title: "Save Failed",
        description: `Failed to save credentials for ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect to {platformName}</DialogTitle>
          <DialogDescription>
            Enter your API credentials to connect to {platformName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {credentialFields.map(field => (
            <div className="grid gap-2" key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input 
                type={field.type || "text"}
                id={field.key}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={credentials[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Credentials"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ApiDataTableProps {
  platformName: string
  data: any[]
  columns: {
    header: string
    key: string
  }[]
  onRowClick?: (row: any) => void
}

export function ApiDataTable({
  platformName,
  data,
  columns,
  onRowClick
}: ApiDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const { toast } = useToast()
  
  const handleCopy = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No Rows Selected",
        description: "Please select rows to copy.",
        variant: "destructive",
      })
      return
    }
    
    const textToCopy = selectedRows.map(row => {
      return columns.map(col => row[col.key]).join('\t')
    }).join('\n')
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: `${selectedRows.length} rows copied to clipboard.`,
        })
      })
      .catch(err => {
        console.error("Failed to copy:", err)
        toast({
          title: "Copy Failed",
          description: "Failed to copy data to clipboard.",
          variant: "destructive",
        })
      })
  }
  
  const handleSelectRow = (row: any) => {
    const isSelected = selectedRows.some(selectedRow => 
      columns.every(col => selectedRow[col.key] === row[col.key])
    )
    
    if (isSelected) {
      setSelectedRows(prev => prev.filter(selectedRow =>
        !columns.every(col => selectedRow[col.key] === row[col.key])
      ))
    } else {
      setSelectedRows(prev => [...prev, row])
    }
  }
  
  const isRowSelected = (row: any) => {
    return selectedRows.some(selectedRow =>
      columns.every(col => selectedRow[col.key] === row[col.key])
    )
  }
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{platformName} Data</h3>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={data.length === 0}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Selected
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Actions <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add New Entry
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              {columns.map(column => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index}
                onClick={() => onRowClick ? onRowClick(row) : null}
                className={cn(
                  "cursor-pointer hover:bg-muted",
                  isRowSelected(row) ? "bg-accent hover:bg-accent" : ""
                )}
              >
                <TableCell className="w-[50px]">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectRow(row)
                    }}
                  >
                    {isRowSelected(row) ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border" />
                    )}
                    <span className="sr-only">Select row</span>
                  </Button>
                </TableCell>
                {columns.map(column => (
                  <TableCell key={column.key}>{row[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface ScriptEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platformName: string
  script: string
  onSave: (script: string) => Promise<void>
}

export function ScriptEditorDialog({
  open,
  onOpenChange,
  platformName,
  script,
  onSave
}: ScriptEditorDialogProps) {
  const [currentScript, setCurrentScript] = useState(script)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(currentScript)
      toast({
        title: "Script Saved",
        description: `Successfully saved script for ${platformName}.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving script:", error)
      toast({
        title: "Save Failed",
        description: `Failed to save script for ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  const detectScriptVersion = (script: string) => {
    if (script.includes("v2")) {
      return "v2"
    } else if (script.includes("v1")) {
      return "v1"
    } else {
      return "unknown"
    }
  }
  
  const scriptVersion = detectScriptVersion(script)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Script for {platformName}</DialogTitle>
          <DialogDescription>
            Modify the script used to interact with the {platformName} API.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Script Version: {scriptVersion}
            </Badge>
            
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
          
          <Textarea 
            className="min-h-[300px]"
            value={currentScript}
            onChange={(e) => setCurrentScript(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Script"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface TrafficQualityOptimizerProps {
  platformName: string
  trafficQuality: 'low' | 'medium' | 'high'
  onTrafficQualityChange: (quality: 'low' | 'medium' | 'high') => Promise<void>
}

export function TrafficQualityOptimizer({
  platformName,
  trafficQuality,
  onTrafficQualityChange
}: TrafficQualityOptimizerProps) {
  const [optimizing, setOptimizing] = useState(false)
  const { toast } = useToast()
  
  const handleOptimize = async () => {
    setOptimizing(true)
    try {
      await onTrafficQualityChange(trafficQuality)
      toast({
        title: "Traffic Quality Optimized",
        description: `Successfully optimized traffic quality for ${platformName}.`,
      })
    } catch (error) {
      console.error("Error optimizing traffic quality:", error)
      toast({
        title: "Optimization Failed",
        description: `Failed to optimize traffic quality for ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setOptimizing(false)
    }
  }
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Traffic Quality Optimization</CardTitle>
        <CardDescription>
          Adjust settings to improve the quality of traffic from {platformName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="traffic-quality">Current Traffic Quality</Label>
          <Input 
            type="text"
            id="traffic-quality"
            value={trafficQuality}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="optimization-suggestions">Optimization Suggestions</Label>
          <Textarea 
            className="min-h-[100px]"
            id="optimization-suggestions"
            value="Implement advanced filtering rules to block low-quality traffic sources."
            disabled
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOptimize} disabled={optimizing}>
          {optimizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            "Apply Fix"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface BudgetOptimizationSettingsProps {
  platformName: string
  budgetOptimizationEnabled: boolean
  onBudgetOptimizationToggle: (enabled: boolean) => Promise<void>
  optimizationTarget: 'roi' | 'traffic' | 'conversions'
  onOptimizationTargetChange: (target: 'roi' | 'traffic' | 'conversions') => Promise<void>
}

export function BudgetOptimizationSettings({
  platformName,
  budgetOptimizationEnabled,
  onBudgetOptimizationToggle,
  optimizationTarget,
  onOptimizationTargetChange
}: BudgetOptimizationSettingsProps) {
  const [optimizing, setOptimizing] = useState(false)
  const { toast } = useToast()
  
  const handleToggle = async (enabled: boolean) => {
    setOptimizing(true)
    try {
      await onBudgetOptimizationToggle(enabled)
      toast({
        title: "Budget Optimization Updated",
        description: `Budget optimization ${enabled ? 'enabled' : 'disabled'} for ${platformName}.`,
      })
    } catch (error) {
      console.error("Error toggling budget optimization:", error)
      toast({
        title: "Update Failed",
        description: `Failed to update budget optimization settings for ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setOptimizing(false)
    }
  }
  
  const handleTargetChange = async (target: 'roi' | 'traffic' | 'conversions') => {
    setOptimizing(true)
    try {
      await onOptimizationTargetChange(target)
      toast({
        title: "Optimization Target Updated",
        description: `Optimization target updated to ${target} for ${platformName}.`,
      })
    } catch (error) {
      console.error("Error changing optimization target:", error)
      toast({
        title: "Update Failed",
        description: `Failed to update optimization target for ${platformName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setOptimizing(false)
    }
  }
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Budget Optimization Settings</CardTitle>
        <CardDescription>
          Configure budget optimization settings for {platformName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="budget-optimization">Enable Budget Optimization</Label>
          <Switch 
            id="budget-optimization"
            checked={budgetOptimizationEnabled}
            onCheckedChange={handleToggle}
            disabled={optimizing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="optimization-target">Optimization Target</Label>
          <select 
            id="optimization-target"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={optimizationTarget}
            onChange={(e) => handleTargetChange(e.target.value as 'roi' | 'traffic' | 'conversions')}
            disabled={!budgetOptimizationEnabled || optimizing}
          >
            <option value="roi">Maximize ROI</option>
            <option value="traffic">Maximize Traffic</option>
            <option value="conversions">Maximize Conversions</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}

interface ApiIntegrationProps {
  title: string
  description: string
  apiId: string
  codeExamples: Array<{
    language: string
    code: string
  }>
  metrics: string[]
  dateRanges: string[]
}

export function ApiIntegration({
  title,
  description,
  apiId,
  codeExamples,
  metrics,
  dateRanges
}: ApiIntegrationProps) {
  const [activeTab, setActiveTab] = useState<string>("documentation")
  const [apiKey, setApiKey] = useState<string>("")
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleConnect = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to connect.",
        variant: "error",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      toast({
        title: "API Connected",
        description: `Successfully connected to ${title} API.`,
        variant: "success",
      })
    }, 1500)
  }

  const handleDisconnect = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsConnected(false)
      setIsLoading(false)
      toast({
        title: "API Disconnected",
        description: `Disconnected from ${title} API.`,
        variant: "default",
      })
    }, 1000)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={cn("grid gap-4", isConnected ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge 
                      variant={isConnected ? "success" : "default"} 
                      label={isConnected ? "Connected" : "Not Connected"} 
                      withDot={isConnected}
                    />
                  </div>
                  
                  {!isConnected && (
                    <div className="space-y-2">
                      <Label htmlFor={`${apiId}-api-key`}>API Key</Label>
                      <Input 
                        id={`${apiId}-api-key`}
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </div>
                  )}
                  
                  {isConnected && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Sync:</span>
                      <span className="text-sm">Today at 09:45 AM</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {isConnected ? (
                  <div className="flex space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnect}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                    <Button 
                      variant="default"
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Data
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleConnect}
                    disabled={isLoading || !apiKey}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {isConnected && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Available Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {metrics.map((metric) => (
                      <Badge key={metric} variant="outline">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Label>Available Date Ranges</Label>
                    <div className="flex flex-wrap gap-2">
                      {dateRanges.map((range) => (
                        <Badge key={range} variant="outline">
                          {range}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy API Endpoint
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-base font-medium mb-4">Code Examples</h3>
            <div className="space-y-4">
              {codeExamples.map((example, index) => (
                <div key={index} className="p-4 rounded-md bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{example.language}</Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto p-2">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
