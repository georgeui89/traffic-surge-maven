import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSection } from '@/components/ui/form-section';

interface SettingsLayoutProps {
  generalSettings: React.ReactNode;
  notificationSettings: React.ReactNode;
  accountSettings: React.ReactNode;
  apiSettings: React.ReactNode;
  appearanceSettings: React.ReactNode;
}

export const SettingsLayout = ({
  generalSettings,
  notificationSettings,
  accountSettings,
  apiSettings,
  appearanceSettings
}: SettingsLayoutProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <Tabs 
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1">
                  <TabsTrigger 
                    value="general" 
                    className="justify-start text-left px-3 py-2 h-auto data-[state=active]:bg-muted"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start text-left px-3 py-2 h-auto data-[state=active]:bg-muted"
                  >
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="justify-start text-left px-3 py-2 h-auto data-[state=active]:bg-muted"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="api" 
                    className="justify-start text-left px-3 py-2 h-auto data-[state=active]:bg-muted"
                  >
                    API & Integrations
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="justify-start text-left px-3 py-2 h-auto data-[state=active]:bg-muted"
                  >
                    Appearance
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <TabsContent value="general" className="mt-0">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general application settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {generalSettings}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationSettings}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {accountSettings}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="api" className="mt-0">
              <CardHeader>
                <CardTitle>API & Integrations</CardTitle>
                <CardDescription>
                  Manage API keys and third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {apiSettings}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {appearanceSettings}
              </CardContent>
            </TabsContent>
          </Card>
        </div>
      </div>
    </div>
  );
};