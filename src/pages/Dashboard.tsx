
import { Activity, DollarSign, TrendingUp, Percent, Server, Globe, MonitorPlay } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { PlatformStatus } from '@/components/dashboard/PlatformStatus';
import { dashboardSummary } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Filter } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Monitor your traffic performance and earnings</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Visits"
          value={dashboardSummary.totalVisits.toLocaleString()}
          icon={<Activity className="h-4 w-4 text-traffic" />}
          variant="traffic"
          trend="up"
          change={8.2}
        />
        
        <MetricCard
          title="Valid Impressions"
          value={dashboardSummary.validImpressions.toLocaleString()}
          icon={<TrendingUp className="h-4 w-4 text-platforms" />}
          variant="platforms"
          trend="up"
          change={5.7}
        />
        
        <MetricCard
          title="Revenue"
          value={`$${dashboardSummary.revenue.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-earnings" />}
          variant="earnings"
          trend="up"
          change={12.3}
        />
        
        <MetricCard
          title="Acceptance Rate"
          value={`${dashboardSummary.acceptanceRate}%`}
          icon={<Percent className="h-4 w-4 text-warning" />}
          variant="warning"
          trend="down"
          change={2.1}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div>
          <PlatformStatus />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <MetricCard
            title="Active RDPs"
            value={dashboardSummary.activeRdps}
            variant="primary"
            icon={<Server className="h-4 w-4 text-rdp" />}
            suffix={` / ${dashboardSummary.totalRdps}`}
          />
          
          <MetricCard
            title="Active Platforms"
            value={dashboardSummary.platforms.active}
            variant="platforms"
            icon={<Globe className="h-4 w-4 text-platforms" />}
            suffix={` / ${dashboardSummary.platforms.total}`}
          />
          
          <MetricCard
            title="Active Campaigns"
            value={dashboardSummary.activeCampaigns}
            variant="modern"
            icon={<MonitorPlay className="h-4 w-4 text-primary" />}
            suffix={` / ${dashboardSummary.totalCampaigns}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
