
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlatformData } from '@/utils/cpmCalculatorUtils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface CpmRatesPanelProps {
  platforms: PlatformData[];
}

export const CpmRatesPanel: React.FC<CpmRatesPanelProps> = ({ platforms }) => {
  return (
    <Card className="bg-muted/5">
      <CardHeader className="pb-3">
        <CardTitle>CPM Rates by Platform</CardTitle>
        <CardDescription>
          Current average CPM rates for popular autosurf platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex justify-between items-center pb-2 border-b border-muted">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: platform.color || '#CCCCCC' }}
                ></div>
                <span>{platform.name}</span>
              </div>
              <span className="font-medium">{platform.cpm.toFixed(1)}</span>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted/20 p-4 rounded-lg">
          CPM rates are based on recent performance data. Actual rates may vary depending on traffic quality, niche, and other factors.
        </div>
        
        <Button variant="outline" className="w-full" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Custom Rates
        </Button>
      </CardContent>
    </Card>
  );
};
