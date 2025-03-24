
import { useState } from 'react';
import { Server, Search, Plus, Power, Wifi, DollarSign, BarChart2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const RDPMetricsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  change 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  iconColor: string; 
  change?: string; 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md", `bg-${iconColor}/10`)}>
              <Icon className={cn("h-5 w-5", `text-${iconColor}`)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-semibold mt-0.5">{value}</p>
            </div>
          </div>
          {change && (
            <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RdpManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const { toast } = useToast();

  const handleAddRdp = () => {
    toast({
      title: "Add RDP",
      description: "RDP configuration form would open here.",
      duration: 3000,
    });
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <RDPMetricsCard
          title="Total RDPs"
          value={`${onlineRdps} / ${totalRdps}`}
          icon={Server}
          iconColor="rdp"
        />
        
        <RDPMetricsCard
          title="Total Visits"
          value={formatNumber(totalVisits)}
          icon={Wifi}
          iconColor="traffic"
        />
        
        <RDPMetricsCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          iconColor="earnings"
        />
        
        <RDPMetricsCard
          title="ROI"
          value={`${roi.toFixed(1)}%`}
          icon={BarChart2}
          iconColor="warning"
          change={roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`}
        />
      </div>
      
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Platform</TableHead>
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
              
              return (
                <TableRow key={rdp.id}>
                  <TableCell className="font-medium">{rdp.name}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getStatusColor(rdp.status)
                    )}>
                      {rdp.status}
                    </div>
                  </TableCell>
                  <TableCell>{rdp.platform}</TableCell>
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
                        <DropdownMenuItem>
                          <Power className="h-4 w-4 mr-2" />
                          {rdp.status === 'online' ? 'Turn Off' : 'Turn On'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RdpManagement;
