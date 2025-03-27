import { useState } from 'react';
import { Check, Copy, ExternalLink, ChevronDown, AlertCircle, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import { CodeBlock } from '@/components/ui/code-block';

interface CodeExample {
  language: string;
  code: string;
}

interface ApiIntegrationProps {
  title: string;
  description: string;
  apiId: string;
  codeExamples?: CodeExample[];
  metrics?: string[];
  dateRanges?: string[];
}

export function ApiIntegration({
  title,
  description,
  apiId,
  codeExamples = [],
  metrics = [],
  dateRanges = []
}: ApiIntegrationProps) {
  const [apiKey, setApiKey] = useState('');
  const [testEndpoint, setTestEndpoint] = useState('stats');
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedCodeExample, setSelectedCodeExample] = useState(codeExamples[0]?.language || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(metrics);
  const [refreshInterval, setRefreshInterval] = useState('15m');
  const [autoSync, setAutoSync] = useState(true);
  const { toast } = useToast();
  
  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 4)}${'•'.repeat(key.length - 8)}${key.slice(-4)}`;
  };
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    
    toast({
      title: "Code Copied",
      description: "Example code copied to clipboard",
      duration: 3000,
    });
  };
  
  const testApiConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to test the connection",
        variant: "default",
        duration: 3000,
      });
      return;
    }
    
    setIsTestingApi(true);
    setTestError(null);
    setTestSuccess(false);
    
    try {
      // Simulate API connection test
      console.log(`Testing API connection with key: ${apiKey.substring(0, 4)}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random test result (success/failure)
      if (Math.random() > 0.3) {
        setIsApiConnected(true);
        setTestSuccess(true);
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${title} API`,
          variant: "default",
          duration: 3000,
        });
      } else {
        throw new Error("API key validation failed. Please check your API key and try again.");
      }
    } catch (error) {
      console.error("API test error:", error);
      setTestError(error instanceof Error ? error.message : "Unknown error occurred");
      setIsApiConnected(false);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to API",
        variant: "default",
        duration: 3000,
      });
    } finally {
      setIsTestingApi(false);
    }
  };
  
  const disconnectApi = () => {
    setApiKey('');
    setIsApiConnected(false);
    toast({
      title: "API Disconnected",
      description: `${title} API has been disconnected`,
      variant: "default",
      duration: 3000,
    });
  };
  
  const handleSelectMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="connect">Connection</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${apiId}-api-key`}>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id={`${apiId}-api-key`}
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="flex-1"
                    disabled={isApiConnected}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                    disabled={isApiConnected || !apiKey}
                    type="button"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
                
                {isApiConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Connected using API key: {maskApiKey(apiKey)}
                  </p>
                )}
              </div>
              
              {!isApiConnected ? (
                <Button 
                  onClick={testApiConnection} 
                  disabled={isTestingApi || !apiKey.trim()}
                  className="w-full"
                >
                  {isTestingApi ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={disconnectApi}
                  >
                    Disconnect
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "API Settings Saved",
                        description: `Your ${title} API settings have been updated`,
                        duration: 3000,
                      });
                    }}
                  >
                    Update Settings
                  </Button>
                </div>
              )}
              
              {testError && (
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {testError}
                  </AlertDescription>
                </Alert>
              )}
              
              {testSuccess && (
                <Alert variant="default">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connection successful! Your API key has been verified.
                  </AlertDescription>
                </Alert>
              )}
              
              {!isApiConnected && (
                <div className="text-sm space-y-2 pt-2">
                  <p className="font-medium">How to get your API key:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log in to your {title} account</li>
                    <li>Navigate to API settings or Developer section</li>
                    <li>Generate a new API key with read access</li>
                    <li>Copy and paste the key here</li>
                  </ol>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Data Sync Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">Auto Sync</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically fetch updated data
                      </p>
                    </div>
                    <Switch 
                      id="auto-sync"
                      checked={autoSync}
                      onCheckedChange={setAutoSync}
                      disabled={!isApiConnected}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Refresh Interval</Label>
                    <Select 
                      value={refreshInterval} 
                      onValueChange={setRefreshInterval}
                      disabled={!isApiConnected || !autoSync}
                    >
                      <SelectTrigger id="refresh-interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5m">Every 5 minutes</SelectItem>
                        <SelectItem value="15m">Every 15 minutes</SelectItem>
                        <SelectItem value="30m">Every 30 minutes</SelectItem>
                        <SelectItem value="1h">Every hour</SelectItem>
                        <SelectItem value="6h">Every 6 hours</SelectItem>
                        <SelectItem value="12h">Every 12 hours</SelectItem>
                        <SelectItem value="24h">Every 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Data Selection</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Metrics to Import</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map(metric => (
                        <Button
                          key={metric}
                          variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleSelectMetric(metric)}
                          disabled={!isApiConnected}
                        >
                          {selectedMetrics.includes(metric) && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Default Date Range</Label>
                    <Select defaultValue="7d" disabled={!isApiConnected}>
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        {dateRanges.map(range => (
                          <SelectItem key={range} value={range}>
                            {range === '7d' && 'Last 7 days'}
                            {range === '30d' && 'Last 30 days'}
                            {range === '90d' && 'Last 90 days'}
                            {range === 'custom' && 'Custom range'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">API Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    <StatusBadge 
                      variant={isApiConnected ? "success" : "error"} 
                      label={isApiConnected ? "Connected" : "Disconnected"} 
                      withDot 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rate Limit:</span>
                    <span className="text-sm">1000 requests/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Sync:</span>
                    <span className="text-sm">{isApiConnected ? new Date().toLocaleString() : "Never"}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="space-y-4">
              {codeExamples.length > 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="language-select">Select Language</Label>
                    <Select 
                      value={selectedCodeExample || codeExamples[0]?.language} 
                      onValueChange={setSelectedCodeExample}
                    >
                      <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {codeExamples.map(example => (
                          <SelectItem key={example.language} value={example.language}>
                            {example.language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm"
                        onClick={() => {
                          const example = codeExamples.find(ex => ex.language === selectedCodeExample);
                          if (example) {
                            copyCode(example.code);
                          }
                        }}
                      >
                        {copiedCode ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm font-mono">
                      {codeExamples.find(ex => ex.language === selectedCodeExample)?.code || '// No code example available'}
                    </pre>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Endpoints</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Endpoint</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-xs">/stats</td>
                      <td className="py-2">Get performance statistics</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-xs">/domains</td>
                      <td className="py-2">Get list of domains</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">/placements</td>
                      <td className="py-2">Get list of ad placements</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    window.open('https://publishers.adsterra.com/api', '_blank');
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Documentation
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setTestEndpoint('stats');
                    testApiConnection();
                  }}
                  disabled={isTestingApi || !apiKey.trim()}
                >
                  <Settings className="h-3.5 w-3.5" />
                  Test Endpoint
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function EyeOff(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
}

function EyeIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
}

function Loader2(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm font-mono">
      {children}
    </pre>
  );
}
