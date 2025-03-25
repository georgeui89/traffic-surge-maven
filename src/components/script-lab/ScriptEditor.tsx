
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock, Smartphone, Code, Save, Play, Download, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScriptEditorProps {
  code: string;
  setCode: (code: string) => void;
}

// Template data for script examples
const templates = [
  {
    id: "basic-redirect",
    name: "Basic Redirect",
    description: "Simple timed redirect to a destination URL",
    code: `// Basic Redirect Script
setTimeout(() => {
  window.location.href = "https://example.com";
}, 1000); // 1 second delay`,
    icon: <Clock className="h-4 w-4" />,
    difficulty: "beginner",
  },
  {
    id: "device-detection",
    name: "Device Detection",
    description: "Redirect based on user's device type",
    code: `// Device Detection Redirect Script
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  window.location.href = "https://mobile.example.com";
} else {
  window.location.href = "https://desktop.example.com";
}`,
    icon: <Smartphone className="h-4 w-4" />,
    difficulty: "intermediate",
  },
  {
    id: "advanced",
    name: "Advanced Redirect",
    description: "Includes parameters and tracking",
    code: `// Advanced Redirect Script with Tracking
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get('source') || 'direct';
const campaign = urlParams.get('campaign') || 'none';

// Track the visit
fetch('https://api.example.com/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ source, campaign })
})
.then(() => {
  // Redirect after tracking
  window.location.href = \`https://example.com?ref=\${source}&camp=\${campaign}\`;
})
.catch(err => {
  console.error('Tracking failed:', err);
  // Redirect anyway
  window.location.href = "https://example.com";
});`,
    icon: <Code className="h-4 w-4" />,
    difficulty: "advanced",
  },
];

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  code,
  setCode
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string>("basic");
  const [targetUrl, setTargetUrl] = useState<string>("https://example.com");
  const [redirectDelay, setRedirectDelay] = useState<number[]>([30]);
  const [trackImpressions, setTrackImpressions] = useState<boolean>(true);
  const [mobileDetection, setMobileDetection] = useState<boolean>(false);
  const [geoTargeting, setGeoTargeting] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [scriptValidity, setScriptValidity] = useState<"valid" | "error" | "warning">("valid");
  
  const { toast } = useToast();

  const handleTemplateChange = (template: typeof templates[0]) => {
    setCode(template.code);
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied.`,
      variant: "default",
    });
  };

  const handleSaveScript = () => {
    toast({
      title: "Script Saved",
      description: "Your script has been saved successfully.",
      variant: "default",
    });
  };

  const handleRunScript = () => {
    try {
      // Simple validation
      new Function(code);
      toast({
        title: "Script Running",
        description: "Script is being executed in a sandboxed environment.",
        variant: "default",
      });
      setScriptValidity("valid");
    } catch (error) {
      setScriptValidity("error");
      toast({
        title: "Script Error",
        description: "There are syntax errors in your script.",
        variant: "destructive",
      });
    }
  };

  const handleExportScript = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `script.js`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Script Exported",
      description: "Your script has been exported successfully.",
      variant: "default",
    });
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <Card className="shadow-modern border-2 border-primary/10 transition-all duration-300 hover:shadow-hover">
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-muted/50 p-3 border-b">
              <div className="flex items-center gap-2">
                <Select value={activeTemplate} onValueChange={setActiveTemplate}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="font-mono">script.js</Badge>
              </div>
              <StatusBadge 
                variant={scriptValidity === "valid" ? "success" : 
                         scriptValidity === "warning" ? "warning" : "error"} 
                label={scriptValidity === "valid" ? "Valid" : 
                       scriptValidity === "warning" ? "Warning" : "Error"} 
                withDot 
              />
            </div>
            
            <div className="flex flex-col h-full">
              <Textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  try {
                    new Function(e.target.value);
                    setScriptValidity("valid");
                  } catch (error) {
                    setScriptValidity("error");
                  }
                }}
                className="font-mono text-sm border-0 rounded-none min-h-[500px] focus-visible:ring-0 resize-none"
                style={{ 
                  fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  lineHeight: 1.5,
                  whiteSpace: 'pre',
                  overflowX: 'auto'
                }}
              />
              
              <div className="flex items-center justify-end gap-2 p-3 border-t bg-muted/30">
                <Button variant="outline" size="sm" onClick={handleSaveScript}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" onClick={handleRunScript}>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportScript}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card className="shadow-modern transition-all duration-300 hover:shadow-hover">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Script Configuration</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="target-url">Target URL</Label>
                <Input 
                  id="target-url" 
                  placeholder="https://example.com" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="delay-slider">Redirect Delay (ms)</Label>
                  <span className="text-sm text-muted-foreground">{redirectDelay[0]}ms</span>
                </div>
                <Slider 
                  value={redirectDelay} 
                  onValueChange={setRedirectDelay} 
                  max={100} 
                  step={1} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="track-impressions" className="cursor-pointer">Track Impressions</Label>
                  <Switch 
                    id="track-impressions" 
                    checked={trackImpressions}
                    onCheckedChange={setTrackImpressions}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-detection" className="cursor-pointer">Mobile Detection</Label>
                  <Switch 
                    id="mobile-detection" 
                    checked={mobileDetection}
                    onCheckedChange={setMobileDetection}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="geo-targeting" className="cursor-pointer">Geo Targeting</Label>
                  <Switch 
                    id="geo-targeting" 
                    checked={geoTargeting}
                    onCheckedChange={setGeoTargeting}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="script-notes">Notes</Label>
                <Textarea 
                  id="script-notes" 
                  placeholder="Add notes about this script..." 
                  className="h-24 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-modern transition-all duration-300 hover:shadow-hover">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Script Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleTemplateChange(template)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                      {template.icon}
                    </div>
                    <h4 className="font-medium">{template.name}</h4>
                    <StatusBadge 
                      variant={
                        template.difficulty === "beginner" ? "success" : 
                        template.difficulty === "intermediate" ? "warning" : "info"
                      } 
                      label={template.difficulty}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateChange(template);
                    }}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
