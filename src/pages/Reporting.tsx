
import { useState } from 'react';
import { 
  FileText, Download, Filter, ChevronDown, Calendar, BarChart, PieChart, 
  LineChart, Sliders, ChevronRight, FileSpreadsheet, Plus, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportGenerator } from '@/components/reporting/ReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

const Reporting = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date(2023, 0, 25),
  });
  
  const [loadingReport, setLoadingReport] = useState<string | null>(null);
  const [loadingExport, setLoadingExport] = useState<string | null>(null);
  
  const handleGenerateReport = () => {
    toast.success("Generating report...");
    setLoadingReport("main");
    
    // Simulate report generation delay
    setTimeout(() => {
      // Create and trigger a download for demonstration
      const reportData = {
        title: "Traffic Performance Report",
        dateRange: {
          from: dateRange?.from?.toISOString() || new Date().toISOString(),
          to: dateRange?.to?.toISOString() || new Date().toISOString()
        },
        platforms: "All Platforms",
        metrics: ["Impressions", "Clicks", "Revenue", "CPM"],
        groupBy: "Day",
        data: [
          { date: "2023-01-20", impressions: 12500, clicks: 350, revenue: 75.25, cpm: 6.02 },
          { date: "2023-01-21", impressions: 13200, clicks: 375, revenue: 81.35, cpm: 6.16 },
          { date: "2023-01-22", impressions: 14100, clicks: 402, revenue: 86.42, cpm: 6.13 }
        ]
      };
      
      const element = document.createElement('a');
      const file = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: 'application/json' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `traffic-report.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success("Report generated successfully!");
      setLoadingReport(null);
    }, 1500);
  };

  const handleExportFormat = (format: string) => {
    setLoadingExport(format);
    toast.loading(`Preparing ${format} export...`);
    
    // Simulate export delay
    setTimeout(() => {
      // Create and trigger a download for demonstration
      const exportData = {
        title: `Traffic Report (${format})`,
        format: format,
        dateRange: {
          from: dateRange?.from?.toISOString() || new Date().toISOString(),
          to: dateRange?.to?.toISOString() || new Date().toISOString()
        },
        data: [
          { date: "2023-01-20", impressions: 12500, clicks: 350, revenue: 75.25, cpm: 6.02 },
          { date: "2023-01-21", impressions: 13200, clicks: 375, revenue: 81.35, cpm: 6.16 },
          { date: "2023-01-22", impressions: 14100, clicks: 402, revenue: 86.42, cpm: 6.13 }
        ]
      };
      
      const element = document.createElement('a');
      const file = new Blob(
        [JSON.stringify(exportData, null, 2)], 
        { type: format === 'PDF' ? 'application/pdf' : format === 'Excel' ? 'application/vnd.ms-excel' : format === 'CSV' ? 'text/csv' : 'application/json' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `traffic-report.${format.toLowerCase()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`${format} report downloaded successfully!`);
      setLoadingExport(null);
    }, 1500);
  };
  
  const handleOpenSavedReport = (reportName: string) => {
    toast.loading(`Opening ${reportName}...`);
    
    // Simulate loading delay
    setTimeout(() => {
      // Create and trigger a download for demonstration
      const reportData = {
        title: reportName,
        dateRange: {
          from: "2023-01-01",
          to: "2023-03-31"
        },
        data: [
          { date: "2023-01-20", impressions: 12500, clicks: 350, revenue: 75.25, cpm: 6.02 },
          { date: "2023-02-15", impressions: 13200, clicks: 375, revenue: 81.35, cpm: 6.16 },
          { date: "2023-03-10", impressions: 14100, clicks: 402, revenue: 86.42, cpm: 6.13 }
        ]
      };
      
      const element = document.createElement('a');
      const file = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: 'application/json' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${reportName.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`${reportName} loaded successfully!`);
    }, 1000);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reporting</h1>
        <p className="page-description">Generate and export detailed reports</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Report Settings</CardTitle>
            <CardDescription>Configure report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Platforms</label>
                <Button variant="outline" className="w-full justify-between">
                  All Platforms
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Metrics</label>
                <Button variant="outline" className="w-full justify-between">
                  Select Metrics
                  <Filter className="h-4 w-4 opacity-50" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Group By</label>
                <Button variant="outline" className="w-full justify-between">
                  Day
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Export Options</CardTitle>
            <CardDescription>Choose export format and delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleExportFormat('PDF')}
                  disabled={loadingExport !== null}
                >
                  {loadingExport === 'PDF' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleExportFormat('Excel')}
                  disabled={loadingExport !== null}
                >
                  {loadingExport === 'Excel' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                  )}
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleExportFormat('CSV')}
                  disabled={loadingExport !== null}
                >
                  {loadingExport === 'CSV' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => handleExportFormat('JSON')}
                  disabled={loadingExport !== null}
                >
                  {loadingExport === 'JSON' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  JSON
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => toast.success("Download option selected")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => toast.success("Email delivery selected")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerateReport}
                disabled={loadingReport === "main"}
              >
                {loadingReport === "main" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="templates">
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportGenerator 
              title="Performance Overview"
              description="Summary of key metrics across all platforms"
              icon={<BarChart className="h-5 w-5" />}
              metrics={["Impressions", "Clicks", "Revenue", "CPM"]}
            />
            
            <ReportGenerator 
              title="Revenue Analysis"
              description="Detailed breakdown of revenue by platform and date"
              icon={<LineChart className="h-5 w-5" />}
              metrics={["Revenue", "CPM", "Acceptance Rate", "ROI"]}
            />
            
            <ReportGenerator 
              title="Platform Comparison"
              description="Compare performance across different platforms"
              icon={<PieChart className="h-5 w-5" />}
              metrics={["Impressions", "Clicks", "Revenue", "CTR"]}
            />
            
            <ReportGenerator 
              title="RDP Efficiency"
              description="Analyze RDP cost vs. revenue performance"
              icon={<Sliders className="h-5 w-5" />}
              metrics={["RDP Cost", "Revenue", "ROI", "Profit Margin"]}
            />
            
            <ReportGenerator 
              title="Daily Breakdown"
              description="Day-by-day analysis of all key metrics"
              icon={<Calendar className="h-5 w-5" />}
              metrics={["Date", "Impressions", "Revenue", "CPM"]}
            />
            
            <Card 
              className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => toast.success("Custom Report Builder will open here")}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-base mb-1">Create Custom Report</CardTitle>
                <CardDescription className="text-center">
                  Build a custom report with your preferred metrics
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="rounded-md border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Q1 Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Created on April 2, 2023</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleOpenSavedReport("Q1 Performance Report")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">March Revenue Analysis</h3>
                    <p className="text-sm text-muted-foreground">Created on April 1, 2023</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleOpenSavedReport("March Revenue Analysis")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Platform Comparison - Q1</h3>
                    <p className="text-sm text-muted-foreground">Created on March 31, 2023</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleOpenSavedReport("Platform Comparison - Q1")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">RDP Cost Analysis</h3>
                    <p className="text-sm text-muted-foreground">Created on March 15, 2023</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleOpenSavedReport("RDP Cost Analysis")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <div className="rounded-md border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Weekly Performance Summary</h3>
                    <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.success("Edit scheduled report")}
                >
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Monthly Revenue Report</h3>
                    <p className="text-sm text-muted-foreground">1st of every month at 8:00 AM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.success("Edit scheduled report")}
                >
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Quarterly Platform Comparison</h3>
                    <p className="text-sm text-muted-foreground">Every 3 months on the 1st at 9:00 AM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.success("Edit scheduled report")}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reporting;
