
import * as React from "react"
import { useState, useEffect } from "react"
import { Check, Copy, RefreshCw, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { useToast } from "@/hooks/use-toast"

type ApiStatus = 'disconnected' | 'connected' | 'error'

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
  const { toast } = useToast()
  
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
    try {
      // Simulate API call
      console.log(`Connecting to ${apiId} with key ${apiKey}`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatus('connected')
      toast({
        title: "Connected Successfully",
        description: `Your ${title} account has been connected.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error connecting API:", error)
      setStatus('error')
      toast({
        title: "Connection Error",
        description: "Failed to connect to the API. Please check your key and try again.",
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
  
  const handleFetchData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      console.log(`Fetching ${selectedMetric} data for ${selectedDateRange} from ${apiId}`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Data Fetched",
        description: `${selectedMetric} data for the last ${selectedDateRange} has been retrieved.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Data Fetch Error",
        description: "Failed to fetch data from the API. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
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
            <Label htmlFor="api-key">API Key</Label>
            <StatusBadge 
              variant={status === 'connected' ? 'success' : status === 'error' ? 'error' : 'muted'}
              label={status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Disconnected'}
              withDot
            />
          </div>
          
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
              disabled={status === 'connected' || connecting}
            />
            
            {status === 'connected' ? (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={connecting}
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnect}
                disabled={connecting || !apiKey.trim()}
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
        </div>
        
        {status === 'connected' && (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data Retrieval</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="metric">Metric</Label>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger id="metric">
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
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger id="date-range">
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
                    disabled={loading}
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
