
import { useState } from 'react';
import { Save, Moon, Sun, BellRing, BellOff, DollarSign, Percent, Server, PlugZap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultSettings } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

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
                </div>
                <Input 
                  id="cpm-rate" 
                  type="number" 
                  value={settings.defaultCpmRate}
                  onChange={(e) => setSettings({ ...settings, defaultCpmRate: parseFloat(e.target.value) })}
                  min="0"
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
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        9H
                      </div>
                      <div>
                        <p className="text-sm font-medium">9Hits</p>
                        <p className="text-xs text-muted-foreground">API Key Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        HL
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hitleap</p>
                        <p className="text-xs text-muted-foreground">API Key Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        OH
                      </div>
                      <div>
                        <p className="text-sm font-medium">Otohits</p>
                        <p className="text-xs text-destructive">Not Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSaveSettings}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
