
import { useState } from 'react';
import { Calendar, Download, FileText, BarChart, PieChart, TrendingUp, Server, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ReportGenerator, ReportDownloadButton } from '@/components/reporting/ReportGenerator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'custom';

interface RecentReport {
  id: string;
  name: string;
  date: string;
  type: string;
  format: string;
}

const recentReports: RecentReport[] = [
  {
    id: '1',
    name: 'Weekly Performance Report',
    date: 'Jan 28, 2024',
    type: 'performance',
    format: 'pdf'
  },
  {
    id: '2',
    name: 'Monthly Earnings Summary',
    date: 'Jan 15, 2024',
    type: 'earnings',
    format: 'excel'
  },
  {
    id: '3',
    name: 'Platform Comparison Analysis',
    date: 'Dec 31, 2023',
    type: 'platforms',
    format: 'csv'
  }
];

const Reporting = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  });
  const { toast } = useToast();
  
  const handleExport = () => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      
      toast({
        title: "Export Complete",
        description: "Your data has been exported to CSV successfully.",
        duration: 3000,
      });
      
      // Simulate download
      const dummyLink = document.createElement('a');
      dummyLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent('Date,Impressions,Clicks,Conversions,Revenue\n2023-01-01,12500,350,12,75.50')}`;
      dummyLink.download = `traffic-data-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(dummyLink);
      dummyLink.click();
      document.body.removeChild(dummyLink);
    }, 2000);
  };
  
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return "Select date range";
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
            <TabsTrigger value="daily" id="daily-tab">Daily</TabsTrigger>
            <TabsTrigger value="weekly" id="weekly-tab">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" id="monthly-tab">Monthly</TabsTrigger>
            <TabsTrigger value="custom" id="custom-tab">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" id="date-range-button">
                <Calendar className="h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range || {from: undefined, to: undefined})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={handleExport}
            disabled={exporting}
            id="export-data-button"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ReportGenerator
          reportInfo={{
            title: "Traffic Analysis",
            description: "Detailed traffic analysis including sources, quality metrics, and conversion rates.",
            type: "traffic",
            icon: <TrendingUp className={cn("h-5 w-5 text-traffic")} />
          }}
        />
        
        <ReportGenerator
          reportInfo={{
            title: "Earnings Report",
            description: "Comprehensive earnings breakdown by platform, campaign, and time period.",
            type: "earnings",
            icon: <BarChart className={cn("h-5 w-5 text-earnings")} />
          }}
        />
        
        <ReportGenerator
          reportInfo={{
            title: "Platform Performance",
            description: "Comparative analysis of performance across all connected platforms.",
            type: "platforms",
            icon: <PieChart className={cn("h-5 w-5 text-platforms")} />
          }}
        />
        
        <ReportGenerator
          reportInfo={{
            title: "RDP Efficiency",
            description: "ROI and performance metrics for each RDP instance.",
            type: "rdps",
            icon: <Server className={cn("h-5 w-5 text-rdp")} />
          }}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            {recentReports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {report.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {report.format.toUpperCase()}
                  </span>
                  <ReportDownloadButton 
                    report={report} 
                    format={report.format} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="py-3 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2" id="view-all-reports">
                <ArrowDown className="h-4 w-4" />
                View All Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Report Archive</DialogTitle>
                <DialogDescription>
                  All your previously generated reports
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <table className="w-full table-modern">
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Format</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...recentReports, ...recentReports, ...recentReports].map((report, index) => (
                      <tr key={`${report.id}-${index}`}>
                        <td>{report.name}</td>
                        <td>
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-xs font-medium",
                            report.type === 'performance' ? "bg-traffic/10 text-traffic" :
                            report.type === 'earnings' ? "bg-earnings/10 text-earnings" :
                            "bg-platforms/10 text-platforms"
                          )}>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </span>
                        </td>
                        <td>{report.date}</td>
                        <td>{report.format.toUpperCase()}</td>
                        <td>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 h-8"
                            id={`download-archive-${report.id}-${index}`}
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Export All</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reporting;
