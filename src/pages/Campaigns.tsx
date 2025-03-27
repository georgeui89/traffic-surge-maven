
import { useState } from 'react';
import { Search, Plus, ExternalLink, PlayCircle, PauseCircle, MoreHorizontal, Copy, BarChart, Eye } from 'lucide-react';
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
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber, getStatusColor } from '@/utils/formatters';
import { campaigns } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { CampaignCreateDialog } from '@/components/campaign/CampaignCreateDialog';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const { toast } = useToast();

  const toggleCampaignStatus = (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast({
      title: `Campaign ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `Campaign status has been updated to ${newStatus}.`,
      duration: 3000,
    });
  };

  // Apply filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campaign.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Get unique platforms for the filter
  const uniquePlatforms = Array.from(new Set(campaigns.map(c => c.platform)));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Campaigns</h1>
        <p className="page-description">Manage your traffic campaigns across platforms</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Total Campaigns</div>
              <div className="text-2xl font-semibold">{campaigns.length}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Active Campaigns</div>
              <div className="text-2xl font-semibold text-success">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Total Visits</div>
              <div className="text-2xl font-semibold">{formatNumber(campaigns.reduce((sum, c) => sum + c.visits, 0))}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-semibold text-earnings">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.revenue, 0))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={platformFilter} 
              onValueChange={setPlatformFilter}
            >
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {uniquePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <CampaignCreateDialog />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map(campaign => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <a 
                      href={campaign.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-muted-foreground flex items-center hover:text-primary"
                    >
                      {campaign.url.replace('https://', '')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    getStatusColor(campaign.status),
                    "capitalize"
                  )}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.platform}</TableCell>
                <TableCell className="text-right">{formatNumber(campaign.visits)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(campaign.revenue)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'active' ? (
                        <PauseCircle className="h-4 w-4 text-warning" />
                      ) : (
                        <PlayCircle className="h-4 w-4 text-success" />
                      )}
                      <span className="sr-only">
                        {campaign.status === 'active' ? 'Pause' : 'Activate'}
                      </span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Campaigns;
