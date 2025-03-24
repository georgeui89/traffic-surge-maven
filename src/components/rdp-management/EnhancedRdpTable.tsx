import { useState } from 'react';
import { 
  Server, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Power, 
  Edit, 
  Trash2, 
  ExternalLink,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getStatusColor, formatCurrency, formatNumber } from '@/utils/formatters';

interface EnhancedRdpTableProps {
  data: any[];
  onViewDetails: (rdp: any) => void;
  onEdit?: (rdp: any) => void;
  onDelete?: (rdp: any) => void;
  onTogglePower?: (rdp: any) => void;
}

export const EnhancedRdpTable = ({
  data,
  onViewDetails,
  onEdit,
  onDelete,
  onTogglePower,
}: EnhancedRdpTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRdp, setExpandedRdp] = useState<string | null>(null);
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleExpandRow = (rdpId: string) => {
    if (expandedRdp === rdpId) {
      setExpandedRdp(null);
    } else {
      setExpandedRdp(rdpId);
    }
  };
  
  // Filter and sort the data
  const filteredData = data.filter(rdp => {
    const matchesSearch = rdp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rdp.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (typeof fieldA === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    } else {
      return sortDirection === 'asc' 
        ? fieldA - fieldB 
        : fieldB - fieldA;
    }
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search RDPs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-6"></TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort('status')}>
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('visits')}>
                  Visits
                  {sortField === 'visits' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('revenue')}>
                  Revenue
                  {sortField === 'revenue' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('cost')}>
                  Cost
                  {sortField === 'cost' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => toggleSort('roi')}>
                  ROI
                  {sortField === 'roi' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No RDPs found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map(rdp => {
                const rdpRoi = rdp.revenue > 0 && rdp.cost > 0 
                  ? ((rdp.revenue - rdp.cost) / rdp.cost) * 100 
                  : 0;
                
                // Simulate platform associations for mock data
                const platformAssociations = [
                  { name: '9Hits', percentage: 60, status: 'healthy', visits: Math.round(rdp.visits * 0.6), revenue: rdp.revenue * 0.6, roi: rdpRoi * 1.15 },
                  { name: 'Otohits', percentage: 40, status: 'warning', visits: Math.round(rdp.visits * 0.4), revenue: rdp.revenue * 0.4, roi: rdpRoi * 0.85 }
                ];
                
                const isExpanded = expandedRdp === rdp.id;
                
                return (
                  <>
                    <TableRow key={rdp.id} className={cn(
                      isExpanded && "bg-muted/30",
                      "transition-colors hover:bg-muted/20"
                    )}>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => toggleExpandRow(rdp.id)}
                        >
                          {isExpanded ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            rdp.status === 'online' ? "bg-success/10 text-success" : 
                            rdp.status === 'offline' ? "bg-destructive/10 text-destructive" : 
                            "bg-warning/10 text-warning"
                          )}>
                            <Server className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{rdp.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          getStatusColor(rdp.status),
                          "capitalize"
                        )}>
                          {rdp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          {platformAssociations.map((platform, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <span className={cn(
                                "h-2 w-2 rounded-full",
                                platform.status === 'healthy' ? "bg-success" : 
                                platform.status === 'warning' ? "bg-warning" : "bg-destructive"
                              )}></span>
                              <span>{platform.name} ({platform.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatNumber(rdp.visits)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(rdp.revenue)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(rdp.cost)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        rdpRoi > 0 ? "text-success" : rdpRoi < 0 ? "text-destructive" : ""
                      )}>
                        {rdpRoi.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onViewDetails(rdp)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onTogglePower && onTogglePower(rdp)}>
                              <Power className="h-4 w-4 mr-2" />
                              {rdp.status === 'online' ? 'Turn Off' : 'Turn On'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit && onEdit(rdp)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDelete && onDelete(rdp)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && (
                      <TableRow className="bg-muted/10">
                        <TableCell colSpan={9} className="p-0">
                          <div className="px-8 py-4 animate-fade-in">
                            <h4 className="text-sm font-medium mb-3">Platform Details</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Platform</TableHead>
                                  <TableHead>Visits</TableHead>
                                  <TableHead>Revenue</TableHead>
                                  <TableHead>ROI</TableHead>
                                  <TableHead>Health</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {platformAssociations.map((platform, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{platform.name}</TableCell>
                                    <TableCell>{formatNumber(platform.visits)}</TableCell>
                                    <TableCell>{formatCurrency(platform.revenue)}</TableCell>
                                    <TableCell className={cn(
                                      "font-medium",
                                      platform.roi > 0 ? "text-success" : "text-destructive"
                                    )}>
                                      {platform.roi.toFixed(1)}%
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={cn(
                                        getStatusColor(platform.status),
                                        "capitalize"
                                      )}>
                                        {platform.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};