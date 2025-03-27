
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScriptEditor } from '@/components/script-lab/ScriptEditor';
import ScriptPerformance from '@/components/script-lab/ScriptPerformance';
import ScriptRecommendations from '@/components/script-lab/ScriptRecommendations';
import ScriptVariantTable from '@/components/script-lab/ScriptVariantTable';
import ScriptTemplates from '@/components/script-lab/ScriptTemplates';
import { ScriptABTesting } from '@/components/script-lab/ScriptABTesting';
import { PlusCircle, Play, Save, Download, Upload, FileCode, RefreshCw, Share, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ScriptLab = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [scriptName, setScriptName] = useState('My Redirect Script');
  const [scriptCode, setScriptCode] = useState('// Basic redirect script\nsetTimeout(() => {\n  window.location.href = "https://example.com";\n}, 1000);');
  const [scriptType, setScriptType] = useState('redirect');
  const { toast } = useToast();

  const handleSaveScript = () => {
    // Here you would actually save the script to your backend
    toast({
      title: "Script Saved",
      description: `${scriptName} has been saved successfully.`,
      variant: "default",
    });
  };

  const handleRunScript = () => {
    toast({
      title: "Script Running",
      description: "Script is being executed in a sandboxed environment.",
      variant: "default",
    });
  };

  const handleExportScript = () => {
    const blob = new Blob([scriptCode], { type: 'text/javascript' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${scriptName.replace(/\s+/g, '-').toLowerCase()}.js`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="page-container">
      <div className="page-header backdrop-blur-sm bg-background/60 sticky top-0 z-10 p-4 mb-4 rounded-lg shadow-modern border border-border/30">
        <div>
          <h1 className="page-title text-gradient-primary">Script Lab</h1>
          <p className="page-description">Create, test, and optimize redirect scripts</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="shadow-modern transition-all hover:shadow-hover" onClick={handleSaveScript}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" className="shadow-modern transition-all hover:shadow-hover" onClick={handleRunScript}>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button size="sm" variant="outline" className="shadow-modern transition-all hover:shadow-hover" onClick={handleExportScript}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <Card className="shadow-modern border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-hover">
                <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-medium">Script Editor</CardTitle>
                      <CardDescription>Write and customize your redirection script</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        Script Type
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The type of script determines how traffic is handled and tracked.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select value={scriptType} onValueChange={setScriptType}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Script Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="redirect">Basic Redirect</SelectItem>
                          <SelectItem value="advanced">Advanced Redirect</SelectItem>
                          <SelectItem value="custom">Custom Script</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input 
                        value={scriptName} 
                        onChange={e => setScriptName(e.target.value)} 
                        placeholder="Script Name" 
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </Button>
                    </div>
                    <ScriptEditor code={scriptCode} setCode={setScriptCode} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="abtesting">
              <ScriptABTesting />
            </TabsContent>
            
            <TabsContent value="performance">
              <ScriptPerformance scriptId="1" />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-modern border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-hover">
            <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl">Script Variants</CardTitle>
              <CardDescription>Compare different versions of your script</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Current Variants</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Add Variant",
                      description: "Create a variant of your current script for testing.",
                      duration: 3000,
                    });
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
              <ScriptVariantTable />
            </CardContent>
          </Card>
          
          <Card className="shadow-modern border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-hover">
            <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl">Templates</CardTitle>
              <CardDescription>Use pre-built script templates</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScriptTemplates onSelectTemplate={(template) => {
                setScriptCode(template.code);
                setActiveTab('editor');
                toast({
                  title: "Template Applied",
                  description: `The "${template.name}" template has been applied.`,
                  duration: 3000,
                });
              }} />
            </CardContent>
          </Card>
          
          <ScriptRecommendations />
        </div>
      </div>
      
      <Card className="shadow-modern border border-border/50 mt-6 overflow-hidden transition-all duration-300 hover:shadow-hover">
        <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Performance Analytics</CardTitle>
              <CardDescription>Review how your scripts are performing</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/10 p-4 rounded-lg border border-border/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Executions</p>
                  <h3 className="text-2xl font-bold">24,583</h3>
                </div>
                <StatusBadge variant="success" label="+12.5%" />
              </div>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg border border-border/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-bold">96.3%</h3>
                </div>
                <StatusBadge variant="success" label="+2.1%" />
              </div>
            </div>
            <div className="bg-muted/10 p-4 rounded-lg border border-border/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Load Time</p>
                  <h3 className="text-2xl font-bold">0.83s</h3>
                </div>
                <StatusBadge variant="warning" label="+0.05s" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptLab;
