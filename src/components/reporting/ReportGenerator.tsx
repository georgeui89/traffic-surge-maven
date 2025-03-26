
import * as React from "react"
import { useState, useCallback } from "react"
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

type ReportType = 'traffic' | 'earnings' | 'platforms' | 'rdps'

interface ReportInfo {
  title: string
  description: string
  type: ReportType
  icon: React.ReactNode
}

interface ReportGeneratorProps {
  reportInfo: ReportInfo
}

export function ReportGenerator({ reportInfo }: ReportGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const [fileFormat, setFileFormat] = useState<"pdf" | "csv" | "excel">("pdf")
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
  })
  
  const generateReport = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Simulate API call
      console.log(`Generating ${reportInfo.type} report in ${fileFormat} format for date range:`, dateRange)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate random error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Server connection timeout. Please try again.");
      }
      
      setSuccess(true)
      toast({
        title: "Report Generated",
        description: `${reportInfo.title} has been generated successfully.`,
        duration: 3000,
      })
      
      // Simulate download
      const dummyLink = document.createElement('a')
      dummyLink.href = `data:application/octet-stream,${encodeURIComponent(`Sample ${reportInfo.type} report data from ${format(dateRange.from || new Date(), 'yyyy-MM-dd')} to ${format(dateRange.to || new Date(), 'yyyy-MM-dd')}`)}`
      dummyLink.download = `${reportInfo.type}-report-${format(new Date(), 'yyyy-MM-dd')}.${fileFormat}`
      document.body.appendChild(dummyLink)
      dummyLink.click()
      document.body.removeChild(dummyLink)
      
    } catch (error) {
      console.error("Error generating report:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      // Reset success state after 3 seconds
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
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-muted">
            {reportInfo.icon}
          </div>
          <CardTitle className="text-base">{reportInfo.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{reportInfo.description}</CardDescription>
        
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Format</label>
            <Select value={fileFormat} onValueChange={(value: "pdf" | "csv" | "excel") => setFileFormat(value)}>
              <SelectTrigger className="w-full" id={`format-select-${reportInfo.type}`}>
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
                <Button variant="outline" size="sm" className="gap-2" id={`date-range-${reportInfo.type}`}>
                  <Calendar className="h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({from: range.from, to: range.to});
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
                withDot 
                loading 
              />
            )}
            
            {!loading && success && (
              <StatusBadge 
                variant="success" 
                label="Generated" 
                withDot 
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
          id={`generate-report-btn-${reportInfo.type}`}
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
  const { toast } = useToast()
  
  const handleDownload = async () => {
    setLoading(true)
    try {
      // Simulate API call
      console.log(`Downloading report: ${report.name} in ${format} format`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate download
      const dummyLink = document.createElement('a')
      dummyLink.href = `data:application/octet-stream,${encodeURIComponent(`Sample report data for ${report.name}`)}`
      dummyLink.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.${format}`
      document.body.appendChild(dummyLink)
      dummyLink.click()
      document.body.removeChild(dummyLink)
      
      toast({
        title: "Download Started",
        description: `${report.name} is downloading.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
        duration: 3000,
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
