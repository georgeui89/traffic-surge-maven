
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ScriptEditorProps {
  scriptCode: string;
  setScriptCode: (code: string) => void;
  scriptType: string;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  scriptCode,
  setScriptCode,
  scriptType
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <Card className="border-2 border-primary/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-muted p-2 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline">script.js</Badge>
                <Badge variant={scriptType === 'basic' ? 'default' : 'outline'}>Basic</Badge>
                <Badge variant={scriptType === 'advanced' ? 'secondary' : 'outline'}>Advanced</Badge>
                <Badge variant={scriptType === 'custom' ? 'destructive' : 'outline'}>Custom</Badge>
              </div>
              <Badge variant="success" className="bg-success text-success-foreground">Valid</Badge>
            </div>
            <Textarea
              value={scriptCode}
              onChange={(e) => setScriptCode(e.target.value)}
              className="font-mono text-sm border-0 rounded-none min-h-[500px] focus-visible:ring-0 resize-none"
              style={{ 
                fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                lineHeight: 1.5,
                whiteSpace: 'pre',
                overflowX: 'auto'
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-4">
        <Card className="h-full">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Script Configuration</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="target-url">Target URL</Label>
                <Input id="target-url" placeholder="https://example.com" defaultValue="https://example.com" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="delay-slider">Redirect Delay (ms)</Label>
                  <span className="text-sm text-muted-foreground">30ms</span>
                </div>
                <Slider defaultValue={[30]} max={100} step={1} />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="track-impressions" className="cursor-pointer">Track Impressions</Label>
                  <Switch id="track-impressions" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-detection" className="cursor-pointer">Mobile Detection</Label>
                  <Switch id="mobile-detection" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="geo-targeting" className="cursor-pointer">Geo Targeting</Label>
                  <Switch id="geo-targeting" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="script-notes">Notes</Label>
                <Textarea 
                  id="script-notes" 
                  placeholder="Add notes about this script..." 
                  className="h-24 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
