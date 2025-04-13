
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart2, DollarSign, Activity } from 'lucide-react';

interface MetricsDashboardProps {
  metrics: {
    totalVisits: number;
    validImpressions: number;
    revenue: number;
    acceptanceRate: number;
    totalCredits: number;
    timeEstimate: string;
  };
  prevMetrics: {
    totalVisits: number;
    validImpressions: number;
    revenue: number;
    acceptanceRate: number;
    totalCredits: number;
    timeEstimate: string;
  };
  calculatePercentageChange: (current: number, previous: number) => number;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ 
  metrics, 
  prevMetrics, 
  calculatePercentageChange 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-muted/5 border">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <h3 className="text-2xl font-bold">
                {Math.round(metrics.totalVisits).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={calculatePercentageChange(metrics.totalVisits, prevMetrics.totalVisits) >= 0 ? "outline" : "destructive"} className="text-xs">
              {calculatePercentageChange(metrics.totalVisits, prevMetrics.totalVisits) >= 0 ? "+" : ""}
              {calculatePercentageChange(metrics.totalVisits, prevMetrics.totalVisits).toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/5 border">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Valid Impressions</p>
              <h3 className="text-2xl font-bold">
                {Math.round(metrics.validImpressions).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <BarChart2 className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={calculatePercentageChange(metrics.validImpressions, prevMetrics.validImpressions) >= 0 ? "outline" : "destructive"} className="text-xs">
              {calculatePercentageChange(metrics.validImpressions, prevMetrics.validImpressions) >= 0 ? "+" : ""}
              {calculatePercentageChange(metrics.validImpressions, prevMetrics.validImpressions).toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/5 border">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <h3 className="text-2xl font-bold text-green-500">
                ${metrics.revenue.toFixed(2)}
              </h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={calculatePercentageChange(metrics.revenue, prevMetrics.revenue) >= 0 ? "outline" : "destructive"} className="text-xs">
              {calculatePercentageChange(metrics.revenue, prevMetrics.revenue) >= 0 ? "+" : ""}
              {calculatePercentageChange(metrics.revenue, prevMetrics.revenue).toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/5 border">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <h3 className="text-2xl font-bold">
                {Math.round(metrics.totalCredits).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-full">
              <Activity className="h-5 w-5 text-cyan-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-muted/20">
              {metrics.timeEstimate}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
