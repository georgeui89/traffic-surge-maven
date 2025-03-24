
import { useState } from 'react';
import { Server, Search, Plus, Power, Wifi, DollarSign, BarChart2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getStatusColor, formatCurrency, formatNumber } from '@/utils/formatters';
import { rdps } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { RdpMetricsCards } from '@/components/rdp-management/RdpMetricsCards';
import { RdpDetailsDialog } from '@/components/rdp-management/RdpDetailsDialog';
import { RdpCreateDialog } from '@/components/rdp-management/RdpCreateDialog';

const RdpManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [expandedRdp, setExpandedRdp] = useState<string | null>(null);
  const [selectedRdp, setSelectedRdp] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddRdp = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewDetails = (rdp: any) => {
    setSelectedRdp(rdp);
    setIsDetailsDialogOpen(true);
  };

  const toggleExpandRow = (rdpId: string) => {
    if (expandedRdp === rdpId) {
      setExpandedRdp(null);
    } else {
      setExpandedRdp(rdpId);
    }
  };

  // Filter RDPs based on search term and view mode
  const filteredRdps = rdps.filter(rdp => {
    const matchesSearch = rdp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = viewMode === 'all' || 
                         (viewMode === 'online' && rdp.status === 'online') ||
                         (viewMode === 'offline' && rdp.status === 'offline');
    return matchesSearch && matchesStatus;
  });

  // Calculate summary metrics
  const totalRdps = rdps.length;
  const onlineRdps = rdps.filter(rdp => rdp.status === 'online').length;
  const totalVisits = rdps.reduce((sum, rdp) => sum + rdp.visits, 0);
  const totalRevenue = rdps.reduce((sum, rdp) => sum + rdp.revenue, 0);
  const totalCost = rdps.reduce((sum, rdp) => sum + rdp.cost, 0);
  const roi = totalRevenue > 0 && totalCost > 0 
    ? ((totalRevenue - totalCost) / totalCost) * 100 
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">RDP Management</h1>
        <p className="page-description">Monitor and manage your remote desktop instances</p>
      </div>
      
      <RdpMetricsCards 
        totalRdps={totalRdps}
        onlineRdps={onlineRdps}
        totalVisits={totalVisits}
        totalRevenue={totalRevenue}
        totalCost={totalCost}
        roi={roi}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search RDPs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={viewMode}
            onValueChange={setViewMode}
            className="hidden md:block"
          >
            <TabsList className="bg-muted/40">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button onClick={handleAddRdp} className="gap-2">
          <Plus className="h-4 w-4" />
          Add RDP
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-6"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRdps.map(rdp => {
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
                  <TableRow key={rdp.id} className={cn(isExpanded && "bg-muted/30")}>
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
                    <TableCell className="font-medium">{rdp.name}</TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getStatusColor(rdp.status)
                      )}>
                        {rdp.status}
                      </div>
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
                    <TableCell className="text-right">{formatNumber(rdp.visits)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(rdp.revenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(rdp.cost)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(rdp)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Power className="h-4 w-4 mr-2" />
                            {rdp.status === 'online' ? 'Turn Off' : 'Turn On'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={9} className="p-0">
                        <div className="px-8 py-4">
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
                                    <div className={cn(
                                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                      getStatusColor(platform.status)
                                    )}>
                                      {platform.status}
                                    </div>
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
            })}
          </TableBody>
        </Table>
      </div>
      
      <RdpDetailsDialog 
        open={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen}
        rdp={selectedRdp}
      />
      
      <RdpCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default RdpManagement;
