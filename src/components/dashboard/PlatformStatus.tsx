
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils/formatters';
import { Check, AlertCircle, XCircle } from 'lucide-react';
import { platforms } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export const PlatformStatus = () => {
  const { toast } = useToast();

  const handlePlatformClick = (platformName: string, status: string) => {
    toast({
      title: `${platformName} Status`,
      description: `Current status: ${status}`,
      duration: 3000,
    });
  };

  // Get top 6 platforms to display
  const topPlatforms = platforms.slice(0, 6);

  // Count statuses
  const counts = {
    healthy: platforms.filter(p => p.status === 'healthy').length,
    warning: platforms.filter(p => p.status === 'warning').length,
    error: platforms.filter(p => p.status === 'error').length,
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Platform Status</CardTitle>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              <span>{counts.healthy}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-warning"></span>
              <span>{counts.warning}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive"></span>
              <span>{counts.error}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {topPlatforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => handlePlatformClick(platform.name, platform.status)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-colors",
                "border border-border hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-center mb-2">
                {platform.status === 'healthy' && (
                  <Check className="h-5 w-5 text-success" />
                )}
                {platform.status === 'warning' && (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                {platform.status === 'error' && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="text-xs font-medium text-center">{platform.name}</div>
              <div className={cn(
                "text-xs mt-1 px-1.5 py-0.5 rounded",
                getStatusColor(platform.status)
              )}>
                {platform.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
