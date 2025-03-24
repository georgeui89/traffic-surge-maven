import { useState } from 'react';
import { Calendar, Download, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  onDateRangeChange?: (range: string) => void;
  isLoading?: boolean;
}

export const DashboardHeader = ({ 
  onRefresh, 
  onDateRangeChange,
  isLoading = false
}: DashboardHeaderProps) => {
  const [dateRange, setDateRange] = useState('7d');
  const { toast } = useToast();
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Refreshing Data",
        description: "Dashboard data is being updated.",
        duration: 3000,
      });
    }
  };
  
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (onDateRangeChange) {
      onDateRangeChange(value);
    }
  };
  
  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your dashboard data is being exported.",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="h-4 w-4 mr-2" />
          Custom Range
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleExport} className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};