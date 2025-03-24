
import { Server, Wifi, DollarSign, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface RDPMetricCardProps { 
  title: string; 
  value: string; 
  icon: any; 
  iconColor: string; 
  change?: string; 
}

const RDPMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  change 
}: RDPMetricCardProps) => {
  return (
    <Card className="backdrop-blur-sm bg-background/80 border-muted">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md", `bg-${iconColor}/10`)}>
              <Icon className={cn("h-5 w-5", `text-${iconColor}`)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-semibold mt-0.5">{value}</p>
            </div>
          </div>
          {change && (
            <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RdpMetricsCardsProps {
  totalRdps: number;
  onlineRdps: number;
  totalVisits: number;
  totalRevenue: number;
  totalCost: number;
  roi: number;
}

export const RdpMetricsCards = ({
  totalRdps,
  onlineRdps,
  totalVisits,
  totalRevenue,
  totalCost,
  roi
}: RdpMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <RDPMetricCard
        title="Total RDPs"
        value={`${onlineRdps} / ${totalRdps}`}
        icon={Server}
        iconColor="rdp"
      />
      
      <RDPMetricCard
        title="Total Visits"
        value={formatNumber(totalVisits)}
        icon={Wifi}
        iconColor="traffic"
      />
      
      <RDPMetricCard
        title="Revenue"
        value={formatCurrency(totalRevenue)}
        icon={DollarSign}
        iconColor="earnings"
      />
      
      <RDPMetricCard
        title="ROI"
        value={`${roi.toFixed(1)}%`}
        icon={BarChart2}
        iconColor="warning"
        change={roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`}
      />
    </div>
  );
};
