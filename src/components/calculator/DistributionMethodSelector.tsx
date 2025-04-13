
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface PlatformData {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

interface DistributionMethodSelectorProps {
  distributionMethod: string;
  useUnevenDistribution: boolean;
  setDistributionMethod: (method: 'equal' | 'weighted' | 'optimal') => void;
  setUseUnevenDistribution: (value: boolean) => void;
  platforms: PlatformData[];
  customDistribution: Record<string, number>;
  updatePlatformDistribution: (platformName: string, value: number) => void;
}

export const DistributionMethodSelector: React.FC<DistributionMethodSelectorProps> = ({
  distributionMethod,
  useUnevenDistribution,
  setDistributionMethod,
  setUseUnevenDistribution,
  platforms,
  customDistribution,
  updatePlatformDistribution
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">Distribution Method</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button 
            variant={!useUnevenDistribution && distributionMethod === 'equal' ? "default" : "outline"}
            className="justify-start"
            onClick={() => {
              setUseUnevenDistribution(false);
              setDistributionMethod('equal');
            }}
          >
            <div className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'equal' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Equal</span>
            </div>
          </Button>
          
          <Button 
            variant={!useUnevenDistribution && distributionMethod === 'weighted' ? "default" : "outline"}
            className="justify-start"
            onClick={() => {
              setUseUnevenDistribution(false);
              setDistributionMethod('weighted');
            }}
          >
            <div className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'weighted' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Weighted</span>
            </div>
          </Button>
          
          <Button 
            variant={!useUnevenDistribution && distributionMethod === 'optimal' ? "default" : "outline"}
            className="justify-start"
            onClick={() => {
              setUseUnevenDistribution(false);
              setDistributionMethod('optimal');
            }}
          >
            <div className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${!useUnevenDistribution && distributionMethod === 'optimal' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Optimal</span>
            </div>
          </Button>
          
          <Button 
            variant={useUnevenDistribution ? "default" : "outline"}
            className="justify-start"
            onClick={() => {
              setUseUnevenDistribution(true);
            }}
          >
            <div className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${useUnevenDistribution ? 'opacity-100' : 'opacity-0'}`} />
              <span>Manual</span>
            </div>
          </Button>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
              <Info className="h-4 w-4" />
              <span>About distribution methods</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              <strong>Equal:</strong> Divides revenue goal equally across platforms<br />
              <strong>Weighted:</strong> Distributes based on platform performance metrics<br />
              <strong>Optimal:</strong> Maximizes efficiency based on platform metrics<br />
              <strong>Manual:</strong> Set custom percentage for each platform
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {useUnevenDistribution && platforms.length > 0 && (
        <div className="mt-4 space-y-4 border rounded-md p-4">
          <h4 className="text-sm font-medium">Manual Distribution</h4>
          {platforms.map((platform) => (
            <div key={`dist-${platform.id}`} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{platform.name}</span>
                <span>{customDistribution[platform.name] || 0}%</span>
              </div>
              <Slider
                value={[customDistribution[platform.name] || 0]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => updatePlatformDistribution(platform.name, values[0])}
                className={`${platform.color ? `[&>[role=slider]]:bg-[${platform.color}]` : ''}`}
              />
            </div>
          ))}
          
          <div className="text-xs text-muted-foreground">
            Total: {platforms
              .reduce((sum, p) => sum + (customDistribution[p.name] || 0), 0)}%
          </div>
        </div>
      )}
    </div>
  );
};
