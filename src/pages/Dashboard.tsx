
import { Activity, DollarSign, TrendingUp, Percent, Server, Globe, MonitorPlay } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { PlatformStatus } from '@/components/dashboard/PlatformStatus';
import { dashboardSummary } from '@/utils/mockData';

const Dashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Monitor your traffic performance and earnings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Visits"
          value={dashboardSummary.totalVisits}
          formatter="number"
          icon={<Activity className="h-4 w-4 text-traffic" />}
          iconBackground="bg-traffic/10"
          footnote="Last 30 days"
          color="text-traffic"
        />
        
        <MetricCard
          title="Valid Impressions"
          value={dashboardSummary.validImpressions}
          formatter="number"
          icon={<TrendingUp className="h-4 w-4 text-platforms" />}
          iconBackground="bg-platforms/10"
          footnote="Last 30 days"
          color="text-platforms"
        />
        
        <MetricCard
          title="Revenue"
          value={dashboardSummary.revenue}
          target={dashboardSummary.dailyGoal}
          formatter="currency"
          icon={<DollarSign className="h-4 w-4 text-earnings" />}
          iconBackground="bg-earnings/10"
          showProgress={true}
          footnote="Today vs. Daily Goal"
          color="text-earnings"
        />
        
        <MetricCard
          title="Acceptance Rate"
          value={dashboardSummary.acceptanceRate}
          formatter="percent"
          icon={<Percent className="h-4 w-4 text-warning" />}
          iconBackground="bg-warning/10"
          footnote="Average last 7 days"
          color="text-warning"
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
            icon={<Server className="h-4 w-4 text-rdp" />}
            iconBackground="bg-rdp/10"
            valueSuffix={` / ${dashboardSummary.totalRdps}`}
            footnote="Online / Total"
            color="text-rdp"
          />
          
          <MetricCard
            title="Active Platforms"
            value={dashboardSummary.platforms.active}
            icon={<Globe className="h-4 w-4 text-platforms" />}
            iconBackground="bg-platforms/10"
            valueSuffix={` / ${dashboardSummary.platforms.total}`}
            footnote="Active / Total"
            color="text-platforms"
          />
          
          <MetricCard
            title="Active Campaigns"
            value={dashboardSummary.activeCampaigns}
            icon={<MonitorPlay className="h-4 w-4 text-primary" />}
            iconBackground="bg-primary/10"
            valueSuffix={` / ${dashboardSummary.totalCampaigns}`}
            footnote="Running / Total"
            color="text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
