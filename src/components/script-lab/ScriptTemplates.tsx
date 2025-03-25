
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, MousePointer, Globe, Smartphone, Clock, Shield, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Templates
const TEMPLATES = {
  BASIC: `// Basic Redirect Script
// This script will redirect the user after a set delay
// You can customize the delay and target URL

// Configuration
const config = {
  delay: 30, // Delay in milliseconds
  targetUrl: "https://example.com", // Target URL to redirect to
  trackImpression: true // Whether to track impressions
};

// Redirect logic
setTimeout(function() {
  if (config.trackImpression) {
    // Track impression before redirecting
    console.log("Tracking impression...");
  }
  
  // Redirect to target URL
  window.location.href = config.targetUrl;
}, config.delay);`,
  
  ADVANCED: `// Advanced Redirect Script with Device Detection
// This script detects device type and redirects accordingly
// You can customize delays and URLs for different devices

// Configuration
const config = {
  delay: {
    desktop: 30, // Desktop delay in milliseconds
    mobile: 20 // Mobile delay in milliseconds
  },
  targetUrl: {
    desktop: "https://example.com", // Desktop target URL
    mobile: "https://m.example.com" // Mobile target URL
  },
  trackImpression: true // Whether to track impressions
};

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Determine settings based on device
const delay = isMobile ? config.delay.mobile : config.delay.desktop;
const targetUrl = isMobile ? config.targetUrl.mobile : config.targetUrl.desktop;

// Redirect logic
setTimeout(function() {
  if (config.trackImpression) {
    // Track impression before redirecting
    console.log("Tracking impression for " + (isMobile ? "mobile" : "desktop") + "...");
  }
  
  // Redirect to target URL
  window.location.href = targetUrl;
}, delay);`,
  
  CUSTOM: `// Custom Redirect Script Template
// This is a starting point for your custom script
// You have full control over the redirect logic

// Your configuration variables
const config = {
  // Add your configuration here
};

// Your custom code goes here
console.log("Custom script running...");

// Example: Add your redirect logic
// window.location.href = "https://example.com";`
};

interface ScriptTemplatesProps {
  setScriptType: (type: string) => void;
  setScriptCode: (code: string) => void;
  setActiveTab: (tab: string) => void;
}

export const ScriptTemplates: React.FC<ScriptTemplatesProps> = ({
  setScriptType,
  setScriptCode,
  setActiveTab
}) => {
  const handleSelectTemplate = (type: string, code: string) => {
    setScriptType(type);
    setScriptCode(code);
    setActiveTab('editor');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Basic Redirect</span>
            <Badge>Beginner</Badge>
          </CardTitle>
          <CardDescription>Simple time-delayed redirect script</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Configurable delay</span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Single target URL</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Basic impression tracking</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSelectTemplate('basic', TEMPLATES.BASIC)}
          >
            Use Template
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Advanced Redirect</span>
            <Badge variant="secondary">Intermediate</Badge>
          </CardTitle>
          <CardDescription>Device-aware redirect with mobile detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Mobile device detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Device-specific delays</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Multiple target URLs</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSelectTemplate('advanced', TEMPLATES.ADVANCED)}
          >
            Use Template
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Custom Script</span>
            <Badge variant="destructive">Advanced</Badge>
          </CardTitle>
          <CardDescription>Start from scratch or with minimal boilerplate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Full code flexibility</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Advanced security options</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Custom logic flows</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSelectTemplate('custom', TEMPLATES.CUSTOM)}
          >
            Use Template
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
