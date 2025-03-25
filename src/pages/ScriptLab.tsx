
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScriptEditor } from '@/components/script-lab/ScriptEditor';
import ScriptPerformance from '@/components/script-lab/ScriptPerformance';
import ScriptRecommendations from '@/components/script-lab/ScriptRecommendations';
import ScriptVariantTable from '@/components/script-lab/ScriptVariantTable';
import ScriptTemplates from '@/components/script-lab/ScriptTemplates';
import { PlusCircle, Play, Save, Download, Upload, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="page-header">
        <div>
          <h1 className="page-title">Script Lab</h1>
          <p className="page-description">Create, test, and optimize redirect scripts</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSaveScript}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleRunScript}>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportScript}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-modern border border-border/50">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Script Editor</CardTitle>
                  <CardDescription>Write and customize your redirection script</CardDescription>
                </div>
                <div className="flex gap-2">
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
                <Input 
                  value={scriptName} 
                  onChange={e => setScriptName(e.target.value)} 
                  placeholder="Script Name" 
                  className="mb-4"
                />
                <ScriptEditor code={scriptCode} setCode={setScriptCode} />
              </div>
            </CardContent>
          </Card>
          
          <ScriptPerformance scriptId="1" />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-modern border border-border/50">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-xl">Script Variants</CardTitle>
              <CardDescription>Compare different versions of your script</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Current Variants</h3>
                <Button size="sm" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
              <ScriptVariantTable />
            </CardContent>
          </Card>
          
          <Card className="shadow-modern border border-border/50">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-xl">Templates</CardTitle>
              <CardDescription>Use pre-built script templates</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScriptTemplates onSelectTemplate={(template) => setScriptCode(template.code)} />
            </CardContent>
          </Card>
          
          <ScriptRecommendations />
        </div>
      </div>
    </div>
  );
};

export default ScriptLab;
