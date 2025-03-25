
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScriptEditor } from '@/components/script-lab/ScriptEditor';
import { ScriptVariantTable } from '@/components/script-lab/ScriptVariantTable';
import { ScriptPerformance } from '@/components/script-lab/ScriptPerformance';
import { ScriptTemplates } from '@/components/script-lab/ScriptTemplates';
import { ScriptRecommendations } from '@/components/script-lab/ScriptRecommendations';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Play, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock script templates
const SCRIPT_TYPES = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  CUSTOM: 'custom'
};

const DEFAULT_SCRIPT = `// Basic Redirect Script
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
}, config.delay);
`;

const ScriptLab = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [scriptType, setScriptType] = useState(SCRIPT_TYPES.BASIC);
  const [scriptCode, setScriptCode] = useState(DEFAULT_SCRIPT);
  const [isTestMode, setIsTestMode] = useState(false);

  const handleSaveScript = () => {
    toast({
      title: "Script Saved",
      description: "Your script has been saved successfully.",
    });
  };

  const handleTestScript = () => {
    setIsTestMode(true);
    toast({
      title: "Testing Script",
      description: "Your script is now running in the sandbox environment.",
    });

    // Simulate testing completion after 2 seconds
    setTimeout(() => {
      setIsTestMode(false);
      toast({
        title: "Test Complete",
        description: "Script executed successfully with no errors.",
        variant: "success",
      });
    }, 2000);
  };

  const handlePreviewScript = () => {
    toast({
      title: "Script Preview",
      description: "Preview mode activated. Script behavior is simulated.",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Script Lab</h1>
        <p className="page-description">Create, test, and optimize redirect scripts for traffic arbitrage</p>
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <Button 
          variant="outline" 
          onClick={handlePreviewScript}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button 
          variant="outline" 
          onClick={handleTestScript} 
          disabled={isTestMode}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isTestMode ? "Testing..." : "Test Script"}
        </Button>
        <Button onClick={handleSaveScript} className="gap-2">
          <Save className="h-4 w-4" />
          Save Script
        </Button>
      </div>

      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="editor">Script Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="variants">Script Variants</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-0">
          <ScriptEditor 
            scriptCode={scriptCode} 
            setScriptCode={setScriptCode} 
            scriptType={scriptType}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <ScriptTemplates 
            setScriptType={setScriptType} 
            setScriptCode={setScriptCode} 
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="variants" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Script Variants</h2>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Variant
            </Button>
          </div>
          <ScriptVariantTable />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <ScriptPerformance />
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-0">
          <ScriptRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptLab;
