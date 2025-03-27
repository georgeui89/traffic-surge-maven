
import { useState } from 'react';
import { Save, Moon, Sun, BellRing, BellOff, DollarSign, Percent, Server, PlugZap, BarChart, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultSettings } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { ApiIntegration } from '@/components/integrations/ApiIntegration';
import { ApiKeyModal } from '@/components/settings/ApiKeyModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    darkMode: defaultSettings.darkMode,
    dailyRevenueGoal: defaultSettings.dailyRevenueGoal,
    defaultAcceptanceRate: defaultSettings.defaultAcceptanceRate,
    defaultCpmRate: defaultSettings.defaultCpmRate,
    rdpDefaultCost: defaultSettings.rdpDefaultCost,
    notificationsEnabled: defaultSettings.notificationsEnabled,
    autoscalingEnabled: defaultSettings.autoscalingEnabled,
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    platformName: '',
    platformId: '',
    isConnected: false,
    existingKey: '',
  });
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
      duration: 3000,
    });
  };
  
  const handleToggleDarkMode = (enabled: boolean) => {
    setSettings({ ...settings, darkMode: enabled });
    
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: `${enabled ? 'Dark' : 'Light'} Mode Activated`,
      duration: 2000,
    });
  };

  const handleOpenApiKeyModal = (platformName: string, platformId: string, isConnected: boolean, existingKey?: string) => {
    setModalState({
      isOpen: true,
      platformName,
      platformId,
      isConnected,
      existingKey: existingKey || '',
    });
  };

  const handleCloseApiKeyModal = () => {
    setModalState(prevState => ({
      ...prevState,
      isOpen: false,
    }));
  };

  const adsterraCodeExamples = [
    {
      language: "PHP",
      code: `<?php
$client = new \\GuzzleHttp\\Client();
$response = $client->request('GET', 'https://api3.adsterratools.com/publisher/stats.json?domain=domain_id&placement=placement_id&start_date=2022-03-06&finish_date=2022-03-06&group_by=placement', [
'headers' => [
  'Accept' => 'application/json',
  'X-API-Key' => 'YOUR_API_KEY_HERE',
],
]);
echo $response->getBody();`
    },
    {
      language: "JavaScript",
      code: `const settings = {
  async: true,
  crossDomain: true,
  url: 'https://api3.adsterratools.com/publisher/stats.json?domain=domain_id&placement=placement_id&start_date=2022-03-06&finish_date=2022-03-06&group_by=placement',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-API-Key': 'YOUR_API_KEY_HERE'
  }
};
$.ajax(settings).done(function (response) {
  console.log(response);
});`
    },
    {
      language: "Python",
      code: `import requests

url = "https://api3.adsterratools.com/publisher/stats.json"
params = {
    "domain": "domain_id",
    "placement": "placement_id",
    "start_date": "2022-03-06",
    "finish_date": "2022-03-06",
    "group_by": "placement"
}
headers = {
    "Accept": "application/json",
    "X-API-Key": "YOUR_API_KEY_HERE"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`
    }
  ];
  
  // Platform list with API connection status
  const platformList = [
    { id: '9hits', name: '9Hits', connected: true, apiKey: 'abcd1234efgh5678ijkl90' },
    { id: 'hitleap', name: 'HitLeap', connected: true, apiKey: 'xyz123456789abcdefgh' },
    { id: 'otohits', name: 'Otohits', connected: false },
    { id: 'bighits4u', name: 'BigHits4U', connected: false },
    { id: 'webhitnet', name: 'Webhit.net', connected: true, apiKey: 'webhit987654321abcxyz' },
  ];
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Configure application preferences and defaults</p>
      </div>
      
      <Tabs defaultValue="appearance" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.darkMode ? 
                    <Moon className="h-5 w-5 text-primary" /> : 
                    <Sun className="h-5 w-5 text-warning" />
                  }
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="12h">
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Metrics & Defaults</CardTitle>
              <CardDescription>Configure default values for metrics and calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-earnings" />
                  <Label htmlFor="daily-revenue-goal">Daily Revenue Goal ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Target daily revenue used for progress bars and recommendations. Set this to a realistic goal to better optimize your traffic strategy.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="daily-revenue-goal" 
                  type="number" 
                  value={settings.dailyRevenueGoal}
                  onChange={(e) => setSettings({ ...settings, dailyRevenueGoal: parseFloat(e.target.value) })}
                  min="0"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  Target daily revenue used for progress bars and recommendations
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-warning" />
                  <Label htmlFor="acceptance-rate">Default Acceptance Rate (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Percentage of traffic that is accepted by ad networks. Higher rates typically mean better traffic quality and improved revenue.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="acceptance-rate" 
                  type="number" 
                  value={settings.defaultAcceptanceRate}
                  onChange={(e) => setSettings({ ...settings, defaultAcceptanceRate: parseFloat(e.target.value) })}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  Default value used for calculations when platform-specific data is unavailable
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <Label htmlFor="cpm-rate">Default CPM Rate ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Cost Per Mille (1000 impressions). This is the rate you earn for every 1000 ad impressions on your site.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="cpm-rate" 
                  type="number" 
                  value={settings.defaultCpmRate}
                  onChange={(e) => setSettings({ ...settings, defaultCpmRate: parseFloat(e.target.value) })}
                  min="0"
                  max="1"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">
                  Default cost per 1000 impressions for revenue projections
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-rdp" />
                  <Label htmlFor="rdp-cost">Default RDP Cost ($/day)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The daily operating cost of your Remote Desktop servers. This is used to calculate ROI.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="rdp-cost" 
                  type="number" 
                  value={settings.rdpDefaultCost}
                  onChange={(e) => setSettings({ ...settings, rdpDefaultCost: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-muted-foreground">
                  Standard daily cost used for RDP ROI calculations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.notificationsEnabled ? 
                    <BellRing className="h-5 w-5 text-primary" /> : 
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  }
                  <div>
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about important events
                    </p>
                  </div>
                </div>
                <Switch 
                  id="enable-notifications" 
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(value) => setSettings({ ...settings, notificationsEnabled: value })}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Notification Categories</Label>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-performance">Performance Alerts</Label>
                    <Switch id="notify-performance" defaultChecked disabled={!settings.notificationsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-budget">Budget Alerts</Label>
                    <Switch id="notify-budget" defaultChecked disabled={!settings.notificationsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-rdp">RDP Status Changes</Label>
                    <Switch id="notify-rdp" defaultChecked disabled={!settings.notificationsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-recommendations">AI Recommendations</Label>
                    <Switch id="notify-recommendations" defaultChecked disabled={!settings.notificationsEnabled} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <div className="space-y-6">
            <ApiIntegration 
              title="Adsterra Publisher API" 
              description="Connect to Adsterra API to fetch monetization data including impressions, clicks, CPM rates, and revenue across your websites and ad placements."
              apiId="adsterra"
              codeExamples={adsterraCodeExamples}
              metrics={['impressions', 'clicks', 'ctr', 'cpm', 'revenue']}
              dateRanges={['7d', '30d', '90d', 'custom']}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Manage platform connections and API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlugZap className="h-5 w-5 text-primary" />
                    <div>
                      <Label htmlFor="enable-autoscaling">Auto-Scaling</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic RDP provisioning
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="enable-autoscaling" 
                    checked={settings.autoscalingEnabled}
                    onCheckedChange={(value) => setSettings({ ...settings, autoscalingEnabled: value })}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="api-keys">Platform API Keys</Label>
                  
                  <div className="rounded-md border overflow-hidden">
                    {platformList.map((platform, index) => (
                      <div key={platform.id} className={`p-3 ${index < platformList.length - 1 ? 'border-b' : ''} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            {platform.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {platform.connected ? 'API Key Connected' : 'Not Connected'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenApiKeyModal(
                            platform.name, 
                            platform.id, 
                            platform.connected, 
                            platform.apiKey
                          )}
                        >
                          {platform.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <CardTitle>Adsterra API Documentation</CardTitle>
                </div>
                <CardDescription>Key information about using the Adsterra Publisher API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Data</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Website information (names and IDs)</li>
                    <li>Ad placements on each website</li>
                    <li>Performance metrics (impressions, clicks, CTR, CPM, revenue)</li>
                    <li>Data filterable by domain, placement, date, and GEO</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Common Use Cases</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Track performance of multiple ad placements across websites</li>
                    <li>Group statistics by country to identify top-performing regions</li>
                    <li>Use placement_sub_id parameter to track Direct Links on different pages</li>
                    <li>Automate data collection for revenue reporting</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">API Endpoints</h3>
                  <div className="rounded-md bg-muted p-3 text-sm font-mono overflow-x-auto">
                    https://api3.adsterratools.com/publisher
                  </div>
                  <p className="text-sm text-muted-foreground">Base URL for all Adsterra Publisher API requests</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Getting Started</h3>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li>Register as an Adsterra publisher</li>
                    <li>Add a website with ad units to your account</li>
                    <li>Generate an API token from your Adsterra dashboard</li>
                    <li>Include your token in the X-API-Key header with each request</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open("https://publishers.adsterra.com/api", "_blank")}>
                  Visit Official Documentation
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSaveSettings}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>

      <ApiKeyModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseApiKeyModal}
        platformName={modalState.platformName}
        platformId={modalState.platformId}
        isConnected={modalState.isConnected}
        existingKey={modalState.existingKey}
      />
    </div>
  );
};

export default Settings;
