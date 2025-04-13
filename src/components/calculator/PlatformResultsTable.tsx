
import React from 'react';

interface Platform {
  id: string;
  name: string;
  creditsNeeded: number;
  visitsGenerated: number;
  validImpressions: number;
  revenue: number;
  color: string;
  efficiency: number;
  timeEstimate: string;
}

interface DashboardMetrics {
  totalVisits: number;
  validImpressions: number;
  revenue: number;
  totalCredits: number;
  timeEstimate: string;
}

interface PlatformResultsTableProps {
  platforms: Platform[];
  dashboardMetrics: DashboardMetrics;
}

export const PlatformResultsTable: React.FC<PlatformResultsTableProps> = ({ platforms, dashboardMetrics }) => {
  // Calculate efficiency rating (1-100) for a platform
  const calculateEfficiencyRating = (platform: Platform): number => {
    const creditsPerDollar = platform.creditsNeeded / Math.max(0.01, platform.revenue);
    
    // Get the max and min credits per dollar across all platforms
    if (platforms.length <= 1) return 100; // If only one platform, it's 100% efficient
    
    const allCreditsPerDollar = platforms.map(p => 
      p.creditsNeeded / Math.max(0.01, p.revenue)
    );
    
    const maxCreditsPerDollar = Math.max(...allCreditsPerDollar);
    const minCreditsPerDollar = Math.min(...allCreditsPerDollar);
    
    // If all platforms have the same efficiency, return 100
    if (maxCreditsPerDollar === minCreditsPerDollar) return 100;
    
    // Normalize to 0-100 scale, where lower credits per dollar (more efficient) means higher score
    const normalizedValue = 100 - (((creditsPerDollar - minCreditsPerDollar) / (maxCreditsPerDollar - minCreditsPerDollar)) * 100);
    return Math.round(normalizedValue);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="py-2 px-4 text-left">Platform</th>
            <th className="py-2 px-4 text-left">Credits Needed</th>
            <th className="py-2 px-4 text-left">Expected Visits</th>
            <th className="py-2 px-4 text-left">Valid Impressions</th>
            <th className="py-2 px-4 text-left">Revenue</th>
            <th className="py-2 px-4 text-left">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform) => (
            <tr key={`results-${platform.id}`} className="border-t">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color || '#CCCCCC' }}
                  ></div>
                  {platform.name}
                </div>
              </td>
              <td className="py-3 px-4">
                {Math.round(platform.creditsNeeded).toLocaleString()}
                <div className="text-xs text-muted-foreground">{platform.timeEstimate}</div>
              </td>
              <td className="py-3 px-4">{Math.round(platform.visitsGenerated).toLocaleString()}</td>
              <td className="py-3 px-4">{Math.round(platform.validImpressions).toLocaleString()}</td>
              <td className="py-3 px-4">${platform.revenue.toFixed(2)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${calculateEfficiencyRating(platform) > 80 ? "bg-green-500" : calculateEfficiencyRating(platform) > 50 ? "bg-blue-500" : "bg-amber-500"}`} 
                      style={{ width: `${calculateEfficiencyRating(platform)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{calculateEfficiencyRating(platform)}%</span>
                </div>
              </td>
            </tr>
          ))}
          
          {platforms.length > 0 && (
            <tr className="border-t bg-muted/20">
              <td className="py-3 px-4 font-medium">Total</td>
              <td className="py-3 px-4 font-medium">
                {Math.round(dashboardMetrics.totalCredits).toLocaleString()}
                <div className="text-xs font-normal">{dashboardMetrics.timeEstimate}</div>
              </td>
              <td className="py-3 px-4 font-medium">
                {Math.round(dashboardMetrics.totalVisits).toLocaleString()}
              </td>
              <td className="py-3 px-4 font-medium">
                {Math.round(dashboardMetrics.validImpressions).toLocaleString()}
              </td>
              <td className="py-3 px-4 font-medium">
                ${dashboardMetrics.revenue.toFixed(2)}
              </td>
              <td className="py-3 px-4">-</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
