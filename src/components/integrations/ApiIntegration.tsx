
import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, Copy, RefreshCw, Loader2, X, AlertCircle, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

type ApiStatus = 'disconnected' | 'connected' | 'error' | 'connecting' | 'syncing'

interface ApiIntegrationProps {
  title: string
  description: string
  apiId: string
  apiLogo?: string
  codeExamples: {
    language: string
    code: string
  }[]
  metrics?: string[]
  dateRanges?: string[]
  isConnected?: boolean
}

export function ApiIntegration({
  title,
  description,
  apiId,
  apiLogo,
  codeExamples,
  metrics = ['impressions', 'clicks', 'ctr', 'cpm', 'revenue'],
  dateRanges = ['7d', '30d', '90d', 'custom'],
  isConnected = false
}: ApiIntegrationProps) {
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState<ApiStatus>(isConnected ? 'connected' : 'disconnected')
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(codeExamples[0]?.language || "")
  const [selectedMetric, setSelectedMetric] = useState(metrics[0])
  const [selectedDateRange, setSelectedDateRange] = useState(dateRanges[0])
  const [copied, setCopied] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'unknown'>('unknown')
  const [retryCount, setRetryCount] = useState(0)
  const syncIntervalRef = useRef<number | null>(null)
  const { toast } = useToast()
  
  // Simulate periodic data freshness check
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        // Random chance to become stale (for demo purposes)
        const freshness = Math.random() > 0.7 ? 'stale' : 'fresh'
        setDataFreshness(freshness)
        
        if (freshness === 'stale') {
          toast({
            title: "Data Sync Required",
            description: `${title} data is stale and needs to be synchronized.`,
            duration: 5000,
          })
        }
      }, 30000) // Check every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [status, title, toast])
  
  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [errorMessage])
  
  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to connect.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    
    setConnecting(true)
    setStatus('connecting')
    setErrorMessage(null)
    
    try {
      // Simulate API call
      console.log(`Connecting to ${apiId} with key ${apiKey}`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate random connection error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Authentication failed. Please check your API key and try again.")
      }
      
      setStatus('connected')
      setDataFreshness('fresh')
      setLastSyncTime(new Date())
      
      toast({
        title: "Connected Successfully",
        description: `Your ${title} account has been connected.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error connecting API:", error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to the API")
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to the API. Please check your key and try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setConnecting(false)
    }
  }
  
  const handleDisconnect = async () => {
    setConnecting(true)
    try {
      // Simulate API call
      console.log(`Disconnecting from ${apiId}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('disconnected')
      setApiKey("")
      setDataFreshness('unknown')
      setLastSyncTime(null)
      
      // Clear any sync intervals
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
        syncIntervalRef.current = null
      }
      
      toast({
        title: "Disconnected",
        description: `Your ${title} account has been disconnected.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error disconnecting API:", error)
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect from the API. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setConnecting(false)
    }
  }
  
  const syncData = async () => {
    if (status !== 'connected') return
    
    setStatus('syncing')
    setLoading(true)
    setSyncProgress(0)
    setErrorMessage(null)
    
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        const newProgress = prev + Math.random() * 20
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 300)
    
    try {
      // Simulate API sync
      console.log(`Syncing data from ${apiId}`)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate random error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Data synchronization failed. Server returned an error.")
      }
      
      setLastSyncTime(new Date())
      setDataFreshness('fresh')
      
      toast({
        title: "Data Synchronized",
        description: `${title} data has been successfully updated.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error syncing data:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to sync data")
      
      // Auto-retry logic
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1)
        toast({
          title: `Sync Failed (Retry ${retryCount + 1}/3)`,
          description: "Attempting to reconnect in 5 seconds...",
          variant: "destructive",
          duration: 4000,
        })
        
        setTimeout(() => syncData(), 5000)
      } else {
        toast({
          title: "Sync Failed",
          description: error instanceof Error ? error.message : "Failed to sync data. Please try manually.",
          variant: "destructive",
          duration: 3000,
        })
        setRetryCount(0)
      }
    } finally {
      clearInterval(progressInterval)
      setSyncProgress(100)
      
      // Reset UI after a delay
      setTimeout(() => {
        setStatus('connected')
        setLoading(false)
      }, 500)
    }
  }
  
  const handleFetchData = async () => {
    setLoading(true)
    setErrorMessage(null)
    
    try {
      // Simulate API call
      console.log(`Fetching ${selectedMetric} data for ${selectedDateRange} from ${apiId}`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Failed to fetch data. API returned an error.")
      }
      
      toast({
        title: "Data Fetched",
        description: `${selectedMetric} data for the last ${selectedDateRange} has been retrieved.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch data")
      toast({
        title: "Data Fetch Error",
        description: error instanceof Error ? error.message : "Failed to fetch data from the API. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }
  
  const startAutoSync = () => {
    // Clear any existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current)
    }
    
    // Set up new sync interval (every 5 minutes)
    syncIntervalRef.current = window.setInterval(() => {
      if (status === 'connected') {
        syncData()
      }
    }, 300000) // 5 minutes
    
    toast({
      title: "Auto-Sync Enabled",
      description: `${title} data will be automatically synchronized every 5 minutes.`,
      duration: 3000,
    })
  }
  
  const stopAutoSync = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current)
      syncIntervalRef.current = null
      
      toast({
        title: "Auto-Sync Disabled",
        description: `${title} data will no longer be automatically synchronized.`,
        duration: 3000,
      })
    }
  }
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        title: "Code Copied",
        description: "Code example copied to clipboard.",
        duration: 2000,
      })
    })
  }
  
  // Find the selected code example
  const selectedExample = codeExamples.find(example => example.language === selectedLanguage) || codeExamples[0]
  
  const getStatusVariant = (): 'success' | 'error' | 'info' | 'muted' => {
    switch (status) {
      case 'connected': return 'success'
      case 'error': return 'error'
      case 'connecting':
      case 'syncing': return 'info'
      default: return 'muted'
    }
  }
  
  const getStatusLabel = (): string => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'error': return 'Error'
      case 'connecting': return 'Connecting...'
      case 'syncing': return 'Syncing Data...'
      default: return 'Disconnected'
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {apiLogo && (
            <img src={apiLogo} alt={`${title} logo`} className="h-8 w-8" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`api-key-${apiId}`}>API Key</Label>
            <StatusBadge 
              variant={getStatusVariant()}
              label={getStatusLabel()}
              withDot
              loading={status === 'connecting' || status === 'syncing'}
            />
          </div>
          
          <div className="flex gap-2">
            <Input
              id={`api-key-${apiId}`}
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
              disabled={status === 'connected' || status === 'connecting' || status === 'syncing'}
            />
            
            {status === 'connected' || status === 'syncing' ? (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={connecting || status === 'syncing'}
                className="shrink-0"
                id={`disconnect-${apiId}`}
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnect}
                disabled={connecting || !apiKey.trim()}
                className="shrink-0"
                id={`connect-${apiId}`}
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Connect
              </Button>
            )}
          </div>
          
          {status === 'syncing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Synchronizing data...</span>
                <span>{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        
        {status === 'connected' && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {lastSyncTime 
                    ? `Last synced: ${lastSyncTime.toLocaleTimeString()}`
                    : 'Never synced'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={syncData}
                  disabled={loading || status === 'syncing'}
                  className="gap-1"
                  id={`sync-${apiId}`}
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  Sync Now
                </Button>
                
                {syncIntervalRef.current ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopAutoSync}
                    className="gap-1"
                    id={`stop-autosync-${apiId}`}
                  >
                    <X className="h-3 w-3" />
                    Stop Auto-Sync
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startAutoSync}
                    className="gap-1"
                    id={`start-autosync-${apiId}`}
                  >
                    <Clock className="h-3 w-3" />
                    Auto-Sync
                  </Button>
                )}
              </div>
            </div>
            
            {dataFreshness === 'stale' && (
              <Alert className="bg-warning/10 border-warning/30 text-warning-foreground">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Data is out of sync. Click "Sync Now" to update.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data Retrieval</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`metric-${apiId}`}>Metric</Label>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger id={`metric-${apiId}`}>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {metrics.map(metric => (
                        <SelectItem key={metric} value={metric}>
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`date-range-${apiId}`}>Date Range</Label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger id={`date-range-${apiId}`}>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map(range => (
                        <SelectItem key={range} value={range}>
                          {range === '7d' ? 'Last 7 Days' : 
                           range === '30d' ? 'Last 30 Days' : 
                           range === '90d' ? 'Last 90 Days' : 
                           'Custom Range'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    className="w-full"
                    onClick={handleFetchData}
                    disabled={loading || status === 'syncing'}
                    id={`fetch-${apiId}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Fetch Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Code Examples</h3>
              <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <TabsList className="mb-2">
                  {codeExamples.map(example => (
                    <TabsTrigger key={example.language} value={example.language}>
                      {example.language}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>{selectedExample?.code}</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(selectedExample?.code || "")}
                    id={`copy-code-${apiId}`}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Tabs>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {status === 'connected' 
            ? 'API connection is active and healthy.' 
            : 'Connect your API to start retrieving data.'}
        </p>
      </CardFooter>
    </Card>
  )
}
