
import * as React from "react"
import { Calendar, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

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
  const { toast } = useToast()
  const [format, setFormat] = useState<"pdf" | "csv" | "excel">("pdf")
  
  const generateReport = async () => {
    setLoading(true)
    try {
      // Simulate API call
      console.log(`Generating ${reportInfo.type} report in ${format} format`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Report Generated",
        description: `${reportInfo.title} has been generated successfully.`,
        duration: 3000,
      })
      
      // Simulate download
      const dummyLink = document.createElement('a')
      dummyLink.href = `data:application/octet-stream,${encodeURIComponent(`Sample ${reportInfo.type} report data`)}`
      dummyLink.download = `${reportInfo.type}-report.${format}`
      document.body.appendChild(dummyLink)
      dummyLink.click()
      document.body.removeChild(dummyLink)
      
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }
  
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
            <Select value={format} onValueChange={(value: "pdf" | "csv" | "excel") => setFormat(value)}>
              <SelectTrigger className="w-full">
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
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Select Date Range
            </Button>
            
            {loading && (
              <StatusBadge 
                variant="info" 
                label="Processing..." 
                withDot 
                loading 
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={generateReport} 
          disabled={loading} 
          className="gap-2 w-full"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
    >
      {loading ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download
    </Button>
  )
}
