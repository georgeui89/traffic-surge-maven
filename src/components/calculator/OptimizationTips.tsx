
import React from 'react';
import { Zap, DollarSign, Clock, PieChart, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OptimizationTips: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium">Optimization Tips</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
          <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Improve Acceptance Rate</p>
            <p className="text-xs text-muted-foreground">
              Increase time on site to at least 30 seconds and ensure your site loads quickly to improve acceptance rates.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
          <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Maximize CPM</p>
            <p className="text-xs text-muted-foreground">
              Focus on high-value regions like US, Canada, UK, and implement mobile-friendly designs.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
          <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Optimize Time on Site</p>
            <p className="text-xs text-muted-foreground">
              Add engaging content or use delayed redirects to keep visitors on your site longer.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
          <PieChart className="h-5 w-5 text-orange-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Balance Platform Mix</p>
            <p className="text-xs text-muted-foreground">
              Distribute credits across platforms based on their efficiency to maximize overall ROI.
            </p>
          </div>
        </div>
      </div>
      
      <Alert className="bg-primary/5 border-primary/20 mt-4">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          Use the "Optimal" distribution method for the most efficient allocation of your revenue goal across platforms.
        </AlertDescription>
      </Alert>
    </div>
  );
};
