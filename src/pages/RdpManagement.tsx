import React, { useState, useEffect } from 'react';
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
import { rdps as initialRdps } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import { RdpMetricsCards } from '@/components/rdp-management/RdpMetricsCards';
import { RdpDetailsDialog } from '@/components/rdp-management/RdpDetailsDialog';
import { RdpCreateDialog } from '@/components/rdp-management/RdpCreateDialog';
import { fetchRdps, updateRdpStatus, deleteRdp, addRdp, subscribeToRdps, RdpData } from '@/lib/supabase';

const RdpManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [expandedRdp, setExpandedRdp] = useState<string | null>(null);
  const [selectedRdp, setSelectedRdp] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [rdps, setRdps] = useState<RdpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    console.log("Setting up Supabase subscription for RDPs");
    
    // Initial data load
    const loadInitialData = async () => {
      try {
        const data = await fetchRdps();
        if (isMounted) {
          setRdps(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading initial RDP data:", error);
        if (isMounted) {
          // Use mock data as a fallback - now initialRdps matches RdpData
          setRdps(initialRdps as RdpData[]);
          setIsUsingMockData(true);
          setIsLoading(false);
          toast.warning("Using local data", {
            description: "Could not connect to database. Changes will not be saved."
          });
        }
      }
    };
    
    loadInitialData();
    
    // Setup real-time subscription
    const unsubscribe = subscribeToRdps(
      (fetchedRdps) => {
        if (isMounted) {
          console.log("RDPs loaded from Supabase:", fetchedRdps);
          setRdps(fetchedRdps);
          setIsLoading(false);
          if (isUsingMockData) {
            setIsUsingMockData(false);
            toast.success("Connected to database", {
              description: "Your changes will now be saved"
            });
          }
        }
      },
      (error) => {
        console.error("Error loading RDPs:", error);
        if (isMounted && !isUsingMockData) {
          // Only show toast if we weren't already using mock data
          toast.error("Failed to load RDPs", {
            description: "Using local data. Changes will not be saved."
          });
          // If we don't have any data yet, use mock data
          if (rdps.length === 0) {
            setRdps(initialRdps as RdpData[]);
          }
          setIsUsingMockData(true);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      console.log("Cleaning up Supabase subscription");
      unsubscribe();
    };
  }, []);

  const handleAddRdp = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateRdp = async (newRdp: any) => {
    try {
      console.log("Creating new RDP:", newRdp);
      
      const rdpToAdd = {
        ...newRdp,
        visits: 0,
        revenue: 0,
        cost: parseFloat(newRdp.cost) || 5,
        status: 'offline',
      };
      
      const addedRdp = await addRdp(rdpToAdd);
      
      // If we're using mock data, update the local state
      if (isUsingMockData) {
        setRdps(prev => [...prev, addedRdp]);
      }
      
      toast.success(`RDP Added`, {
        description: `${newRdp.name} has been added successfully`
      });
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to add RDP:", error);
      toast.error("Failed to add RDP", {
        description: "An error occurred while adding the RDP. Please try again."
      });
    }
  };

  const handleDeleteRdp = async (rdpId: string) => {
    try {
      console.log("Deleting RDP:", rdpId);
      const rdpToDelete = rdps.find(rdp => rdp.id === rdpId);
      if (!rdpToDelete) return;
      
      await deleteRdp(rdpId);
      
      // If we're using mock data, update the local state
      if (isUsingMockData) {
        setRdps(prev => prev.filter(rdp => rdp.id !== rdpId));
      }
      
      toast.success(`RDP Deleted`, {
        description: `${rdpToDelete.name} has been removed successfully`
      });
    } catch (error) {
      console.error("Failed to delete RDP:", error);
      toast.error("Failed to delete RDP", {
        description: "An error occurred while deleting the RDP. Please try again."
      });
    }
  };

  const handleToggleStatus = async (rdpId: string) => {
    try {
      const rdpToUpdate = rdps.find(rdp => rdp.id === rdpId);
      if (!rdpToUpdate) return;
      
      const newStatus = rdpToUpdate.status === 'online' ? 'offline' : 'online';
      console.log(`Changing RDP ${rdpId} status from ${rdpToUpdate.status} to ${newStatus}`);
      
      await updateRdpStatus(rdpId, newStatus);
      
      // If we're using mock data, update the local state
      if (isUsingMockData) {
        setRdps(prev => prev.map(rdp => 
          rdp.id === rdpId ? { ...rdp, status: newStatus } : rdp
        ));
      }
      
      toast.success(`RDP Status Changed`, {
        description: `${rdpToUpdate.name} is now ${newStatus}`
      });
    } catch (error) {
      console.error("Failed to update RDP status:", error);
      toast.error("Failed to update RDP status", {
        description: "An error occurred while updating the RDP status. Please try again."
      });
    }
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

  const filteredRdps = rdps.filter(rdp => {
    const matchesSearch = rdp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = viewMode === 'all' || 
                         (viewMode === 'online' && rdp.status === 'online') ||
                         (viewMode === 'offline' && rdp.status === 'offline');
    return matchesSearch && matchesStatus;
  });

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
        {isUsingMockData && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-md">
            ⚠️ Using local data. Changes will not be saved to the database.
          </div>
        )}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  Loading RDP data...
                </TableCell>
              </TableRow>
            ) : rdps.length > 0 ? (
              rdps
                .filter(rdp => {
                  const matchesSearch = rdp.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = viewMode === 'all' || 
                                      (viewMode === 'online' && rdp.status === 'online') ||
                                      (viewMode === 'offline' && rdp.status === 'offline');
                  return matchesSearch && matchesStatus;
                })
                .map((rdp) => {
                  const rdpRoi = rdp.revenue > 0 && rdp.cost > 0 
                    ? ((rdp.revenue - rdp.cost) / rdp.cost) * 100 
                    : 0;
                
                  const platforms = rdp.platforms || [];
                
                  const platformAssociations = platforms.length > 0 
                    ? platforms.map(platform => {
                        const percentage = platform.weight || 0;
                        const weight = percentage / 100;
                        const status = Math.random() > 0.7 ? 'warning' : 'healthy';
                        return {
                          name: platform.name,
                          percentage,
                          status,
                          visits: Math.round(rdp.visits * weight),
                          revenue: rdp.revenue * weight,
                          roi: rdpRoi * (status === 'healthy' ? 1.15 : 0.85)
                        };
                      }) 
                    : [
                        { name: '9Hits', percentage: 60, status: 'healthy', visits: Math.round(rdp.visits * 0.6), revenue: rdp.revenue * 0.6, roi: rdpRoi * 1.15 },
                        { name: 'Otohits', percentage: 40, status: 'warning', visits: Math.round(rdp.visits * 0.4), revenue: rdp.revenue * 0.4, roi: rdpRoi * 0.85 }
                      ];
                
                  const isExpanded = expandedRdp === rdp.id;
                
                  return (
                    <React.Fragment key={rdp.id}>
                      <TableRow className={cn(isExpanded && "bg-muted/30")}>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={() => toggleExpandRow(rdp.id!)}
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
                              <DropdownMenuItem onClick={() => handleToggleStatus(rdp.id!)}>
                                <Power className="h-4 w-4 mr-2" />
                                {rdp.status === 'online' ? 'Turn Off' : 'Turn On'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteRdp(rdp.id!)}
                              >
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
                    </React.Fragment>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  No RDPs found. Add one to get started.
                </TableCell>
              </TableRow>
            )}
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
        onCreateRdp={handleCreateRdp}
      />
    </div>
  );
};

export default RdpManagement;
