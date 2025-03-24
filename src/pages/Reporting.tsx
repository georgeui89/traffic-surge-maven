
import { useState } from 'react';
import { Calendar, Download, FileText, BarChart, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ReportType = 'traffic' | 'earnings' | 'platforms' | 'rdps';
type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'custom';

const ReportCard = ({ 
  title, 
  description, 
  type, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  type: ReportType; 
  icon: any;
}) => {
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: `${title} report is being generated.`,
      duration: 3000,
    });
  };
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-md",
            type === 'traffic' ? "bg-traffic/10" : 
            type === 'earnings' ? "bg-earnings/10" :
            type === 'platforms' ? "bg-platforms/10" :
            "bg-rdp/10"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              type === 'traffic' ? "text-traffic" : 
              type === 'earnings' ? "text-earnings" :
              type === 'platforms' ? "text-platforms" :
              "text-rdp"
            )} />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleGenerateReport}>
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
};

const Reporting = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV.",
      duration: 3000,
    });
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reporting</h1>
        <p className="page-description">Generate and manage analytics reports</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs 
          defaultValue="weekly" 
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Select Date Range
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ReportCard
          title="Traffic Analysis"
          description="Detailed traffic analysis including sources, quality metrics, and conversion rates."
          type="traffic"
          icon={TrendingUp}
        />
        
        <ReportCard
          title="Earnings Report"
          description="Comprehensive earnings breakdown by platform, campaign, and time period."
          type="earnings"
          icon={BarChart}
        />
        
        <ReportCard
          title="Platform Performance"
          description="Comparative analysis of performance across all connected platforms."
          type="platforms"
          icon={PieChart}
        />
        
        <ReportCard
          title="RDP Efficiency"
          description="ROI and performance metrics for each RDP instance."
          type="rdps"
          icon={BarChart}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {i === 1 ? "Weekly Performance Report" : 
                      i === 2 ? "Monthly Earnings Summary" : 
                      "Platform Comparison Analysis"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {i === 1 ? "Jan 28, 2024" : 
                      i === 2 ? "Jan 15, 2024" : 
                      "Dec 31, 2023"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reporting;
