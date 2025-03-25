
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScriptEditor } from '@/components/script-lab/ScriptEditor';
import { ScriptVariantTable } from '@/components/script-lab/ScriptVariantTable';
import { ScriptPerformance } from '@/components/script-lab/ScriptPerformance';
import { ScriptTemplates } from '@/components/script-lab/ScriptTemplates';
import { ScriptRecommendations } from '@/components/script-lab/ScriptRecommendations';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Play, Eye, Code } from 'lucide-react';
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
        variant: "default", // Changed from "success" to "default"
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
      <div className="page-header mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Code className="h-7 w-7 text-neon-cyan" />
          <h1 className="page-title font-futuristic text-3xl text-gradient-cyan">Script Lab</h1>
        </div>
        <p className="page-description text-lg">Create, test, and optimize redirect scripts for traffic arbitrage</p>
      </div>

      <div className="flex justify-end space-x-3 mb-6">
        <Button 
          variant="outline" 
          onClick={handlePreviewScript}
          className="gap-2 border-neon-cyan/30 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
        >
          <Eye className="h-4 w-4 text-neon-cyan" />
          Preview
        </Button>
        <Button 
          variant="outline" 
          onClick={handleTestScript} 
          disabled={isTestMode}
          className="gap-2 border-neon-cyan/30 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
        >
          <Play className="h-4 w-4 text-neon-cyan" />
          {isTestMode ? "Testing..." : "Test Script"}
        </Button>
        <Button 
          onClick={handleSaveScript} 
          className="gap-2 bg-neon-cyan hover:bg-neon-cyan/90 shadow-neon-cyan text-black font-medium transition-all duration-300"
        >
          <Save className="h-4 w-4" />
          Save Script
        </Button>
      </div>

      <Tabs 
        defaultValue="editor" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full animate-warp-in"
      >
        <TabsList className="grid grid-cols-5 mb-6 bg-background/50 backdrop-blur-sm rounded-xl p-1 border border-border/50">
          <TabsTrigger 
            value="editor"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan data-[state=active]:shadow-neon-cyan data-[state=active]:border-neon-cyan/50 transition-all duration-300 data-[state=active]:font-medium"
          >
            Script Editor
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan data-[state=active]:shadow-neon-cyan data-[state=active]:border-neon-cyan/50 transition-all duration-300 data-[state=active]:font-medium"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="variants"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan data-[state=active]:shadow-neon-cyan data-[state=active]:border-neon-cyan/50 transition-all duration-300 data-[state=active]:font-medium"
          >
            Script Variants
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan data-[state=active]:shadow-neon-cyan data-[state=active]:border-neon-cyan/50 transition-all duration-300 data-[state=active]:font-medium"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan data-[state=active]:shadow-neon-cyan data-[state=active]:border-neon-cyan/50 transition-all duration-300 data-[state=active]:font-medium"
          >
            AI Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-0 glass-card p-4">
          <ScriptEditor 
            scriptCode={scriptCode} 
            setScriptCode={setScriptCode} 
            scriptType={scriptType}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0 glass-card p-4">
          <ScriptTemplates 
            setScriptType={setScriptType} 
            setScriptCode={setScriptCode} 
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="variants" className="mt-0 glass-card p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-futuristic text-gradient-cyan">Script Variants</h2>
            <Button className="gap-2 bg-neon-magenta hover:bg-neon-magenta/90 shadow-neon-magenta text-white font-medium transition-all duration-300">
              <PlusCircle className="h-4 w-4" />
              Add Variant
            </Button>
          </div>
          <ScriptVariantTable />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0 glass-card p-4">
          <ScriptPerformance />
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-0 glass-card p-4">
          <ScriptRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptLab;
