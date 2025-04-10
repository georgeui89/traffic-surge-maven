
import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { Calendar, Download, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"

type ReportType = 'traffic' | 'earnings' | 'platforms' | 'rdps'

interface ReportInfo {
  title: string
  description: string
  type: ReportType
  icon: React.ReactNode
  metrics?: string[]
}

interface ReportGeneratorProps {
  title: string
  description: string
  icon: React.ReactNode
  metrics?: string[]
}

export function ReportGenerator({ title, description, icon, metrics = [] }: ReportGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileFormat, setFileFormat] = useState<"pdf" | "csv" | "excel">("pdf")
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  })
  
  const [triggerCount, setTriggerCount] = useState(0)
  
  const generateReport = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      setTriggerCount(prev => prev + 1)
      
      console.log(`Generating report for ${title} in ${fileFormat} format for date range:`, dateRange)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate dummy report data
      const reportData = {
        title,
        format: fileFormat,
        dateRange: {
          from: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
          to: format(dateRange.to || new Date(), 'yyyy-MM-dd')
        },
        metrics: metrics || ["Impressions", "Clicks", "Revenue", "CPM"],
        data: [
          { date: format(dateRange.from, 'yyyy-MM-dd'), impressions: 12500, clicks: 350, revenue: 75.25, cpm: 6.02 },
          { date: format(new Date(dateRange.from.getTime() + 86400000), 'yyyy-MM-dd'), impressions: 13200, clicks: 375, revenue: 81.35, cpm: 6.16 },
          { date: format(new Date(dateRange.from.getTime() + 86400000 * 2), 'yyyy-MM-dd'), impressions: 14100, clicks: 402, revenue: 86.42, cpm: 6.13 }
        ]
      }
      
      setSuccess(true)
      toast.success("Report Generated", {
        description: `${title} has been generated successfully.`
      })
      
      // Create and download the file
      const blob = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: fileFormat === 'pdf' ? 'application/pdf' : fileFormat === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' }
      )
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-report.${fileFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to generate report. Please try again."
      })
    } finally {
      if (success) {
        setTimeout(() => setSuccess(false), 3000)
      }
      setLoading(false)
    }
  }
  
  const formatDateRange = useCallback(() => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }
    return "Select date range"
  }, [dateRange])
  
  useEffect(() => {
    if (triggerCount > 0) {
      console.log(`Report generation triggered ${triggerCount} times`);
    }
  }, [triggerCount]);
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-muted">
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Format</label>
            <Select value={fileFormat} onValueChange={(value: "pdf" | "csv" | "excel") => setFileFormat(value)}>
              <SelectTrigger className="w-full" id={`format-select-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" id={`date-range-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Calendar className="h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({from: range.from, to: range.to});
                    } else if (range?.from) {
                      setDateRange({from: range.from, to: new Date()});
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            {loading && (
              <StatusBadge 
                variant="info" 
                label="Processing..." 
                withDot={true} 
                loading={true} 
              />
            )}
            
            {!loading && success && (
              <StatusBadge 
                variant="success" 
                label="Generated" 
                withDot={true} 
              />
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-2 bg-success/10 text-success border-success/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Report generated successfully. Download started.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={generateReport} 
          disabled={loading} 
          className="gap-2 w-full"
          id={`generate-report-btn-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ReportDownloadButton({ report, format }: { report: { name: string, date: string }, format: string }) {
  const [loading, setLoading] = useState(false)
  
  const handleDownload = async () => {
    setLoading(true)
    try {
      console.log(`Downloading report: ${report.name} in ${format} format`)
      
      // Create sample report data
      const reportData = {
        name: report.name,
        date: report.date,
        format: format,
        data: [
          { date: "2023-01-20", impressions: 12500, clicks: 350, revenue: 75.25, cpm: 6.02 },
          { date: "2023-01-21", impressions: 13200, clicks: 375, revenue: 81.35, cpm: 6.16 },
          { date: "2023-01-22", impressions: 14100, clicks: 402, revenue: 86.42, cpm: 6.13 }
        ]
      }
      
      // Create and download the file
      const blob = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: format === 'PDF' ? 'application/pdf' : format === 'Excel' ? 'application/vnd.ms-excel' : 'text/csv' }
      )
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.${format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("Download Started", {
        description: `${report.name} is downloading.`
      })
    } catch (error) {
      console.error("Error downloading report:", error)
      toast.error("Error", {
        description: "Failed to download report. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-1"
      onClick={handleDownload}
      disabled={loading}
      id={`download-${report.name.toLowerCase().replace(/\s+/g, '-')}-${format}`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download
    </Button>
  )
}
