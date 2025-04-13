
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import { PlatformData } from '@/utils/cpmCalculatorUtils';

interface PlatformSelectorProps {
  platforms: PlatformData[];
  togglePlatform: (platformId: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platforms, togglePlatform }) => {
  return (
    <div className="border rounded-md p-4 bg-muted/10">
      <h3 className="text-base font-medium mb-3">Platform Selection</h3>
      <div className="space-y-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`platform-${platform.id}`} 
                checked={platform.enabled}
                onCheckedChange={() => togglePlatform(platform.id)}
              />
              <Label htmlFor={`platform-${platform.id}`} className="cursor-pointer flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: platform.color || '#CCCCCC' }}
                ></div>
                {platform.name}
              </Label>
            </div>
            <div className="text-sm text-muted-foreground">
              CPM: ${platform.cpm.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Platform Settings</h4>
        <Alert variant="default" className="bg-muted/20">
          <AlertDescription className="text-xs flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced platform settings are available in the Settings tab
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
