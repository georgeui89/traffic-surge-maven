
import { useState } from 'react';
import { Search, Plus, ExternalLink, PlayCircle, PauseCircle, MoreHorizontal, Copy, BarChart, Eye, Filter, Download, CheckSquare, X, Check } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber, getStatusColor } from '@/utils/formatters';
import { campaigns } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { CampaignCreateDialog } from '@/components/campaign/CampaignCreateDialog';
import { CampaignSetupWizard } from '@/components/wizards/CampaignSetupWizard';

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
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
  
  // Check/uncheck all visible campaigns
  const toggleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id));
    }
  };
  
  // Check/uncheck a single campaign
  const toggleCampaignSelected = (campaignId: string) => {
    if (selectedCampaigns.includes(campaignId)) {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    } else {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    }
  };
  
  // Bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedCampaigns.length === 0) {
      toast({
        title: "No Campaigns Selected",
        description: "Please select at least one campaign to perform this action.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    let message = '';
    
    switch (action) {
      case 'activate':
        message = `${selectedCampaigns.length} campaigns have been activated.`;
        break;
      case 'pause':
        message = `${selectedCampaigns.length} campaigns have been paused.`;
        break;
      case 'duplicate':
        message = `${selectedCampaigns.length} campaigns have been duplicated.`;
        break;
      case 'delete':
        message = `${selectedCampaigns.length} campaigns have been deleted.`;
        break;
      default:
        return;
    }
    
    toast({
      title: "Bulk Action Completed",
      description: message,
      duration: 3000,
    });
    
    setSelectedCampaigns([]);
  };

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
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
            onClick={() => setIsWizardOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign (Guided)
          </Button>
          <CampaignCreateDialog />
        </div>
      </div>
      
      {selectedCampaigns.length > 0 && (
        <div className="bg-muted/30 border rounded-md p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="text-sm">{selectedCampaigns.length} campaigns selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
              <PlayCircle className="h-4 w-4 mr-2 text-success" />
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('pause')}>
              <PauseCircle className="h-4 w-4 mr-2 text-warning" />
              Pause
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('duplicate')}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
              <X className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox 
                  checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all campaigns"
                />
              </TableHead>
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
                <TableCell className="p-0 pl-4">
                  <Checkbox 
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={() => toggleCampaignSelected(campaign.id)}
                    aria-label={`Select ${campaign.name}`}
                  />
                </TableCell>
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
                <TableCell>
                  <a 
                    href="/traffic-analytics" 
                    className="hover:text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // Here you would actually navigate and set filters
                      toast({
                        title: "Filter Applied",
                        description: `Viewing analytics for ${campaign.platform} platform.`,
                        duration: 3000,
                      });
                      window.location.href = '/traffic-analytics';
                    }}
                  >
                    {campaign.platform}
                  </a>
                </TableCell>
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
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            // Here you would actually navigate to analytics for this campaign
                            toast({
                              title: "Analytics",
                              description: `Viewing analytics for "${campaign.name}".`,
                              duration: 3000,
                            });
                            window.location.href = '/traffic-analytics';
                          }}
                        >
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
            {filteredCampaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No campaigns found. Try adjusting your filters or create a new campaign.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CampaignSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </div>
  );
};

export default Campaigns;
