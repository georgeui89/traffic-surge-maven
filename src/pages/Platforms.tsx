import { useState, useEffect } from 'react';
import { ExternalLink, Search, Plus, MoreHorizontal, Edit, BarChart2, Link2Off } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPlatform, deletePlatform, updatePlatform, subscribeToPlatforms, PlatformData } from '@/lib/supabase';

const Platforms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast: uiToast } = useToast();
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isAddPlatformOpen, setIsAddPlatformOpen] = useState(false);
  const [isEditPlatformOpen, setIsEditPlatformOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  
  // Platform data states
  const [newPlatform, setNewPlatform] = useState<Omit<PlatformData, "id">>({ 
    name: '', 
    url: '', 
    status: 'inactive' 
  });
  const [currentPlatform, setCurrentPlatform] = useState<PlatformData>({
    id: '',
    name: '',
    url: '',
    status: ''
  });

  // Subscribe to platforms data from Supabase
  useEffect(() => {
    console.log("Setting up Supabase subscription for platforms");
    const unsubscribe = subscribeToPlatforms(
      (fetchedPlatforms) => {
        console.log("Platforms loaded from Supabase:", fetchedPlatforms);
        setPlatforms(fetchedPlatforms);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading platforms:", error);
        toast.error("Failed to load platforms");
        setIsLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up Supabase subscription for platforms");
      unsubscribe();
    };
  }, []);

  const filteredPlatforms = platforms.filter(platform => 
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for opening Add Platform dialog
  const handleAddPlatform = () => {
    console.log("Opening Add Platform dialog");
    setNewPlatform({ name: '', url: '', status: 'inactive' });
    setIsAddPlatformOpen(true);
  };

  // Handler for saving a new platform to Supabase
  const handleSavePlatform = async () => {
    console.log("Attempting to save platform to Supabase:", newPlatform);
    
    if (!newPlatform.name || !newPlatform.url) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      await addPlatform(newPlatform);
      
      toast.success("Platform Added", {
        description: `${newPlatform.name} was successfully added to Supabase`
      });
      
      setIsAddPlatformOpen(false);
      setNewPlatform({ name: '', url: '', status: 'inactive' });
    } catch (error) {
      console.error("Error saving platform to Supabase:", error);
      toast.error("Failed to save platform", {
        description: "An error occurred while saving to Supabase. Please try again."
      });
    }
  };

  // Handler for opening Edit Platform dialog
  const handleEditPlatform = (platformId: string) => {
    console.log("Opening edit dialog for platform ID:", platformId);
    
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setCurrentPlatform({
        id: platform.id,
        name: platform.name,
        url: platform.url,
        status: platform.status
      });
      setIsEditPlatformOpen(true);
    }
  };

  // Handler for saving edited platform to Supabase
  const handleSaveEditedPlatform = async () => {
    console.log("Saving edited platform to Supabase:", currentPlatform);
    
    if (!currentPlatform.name || !currentPlatform.url) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      if (!currentPlatform.id) {
        throw new Error("Platform ID is missing");
      }
      
      // Extract updatable fields (excluding id)
      const { id, ...updateData } = currentPlatform;
      
      await updatePlatform(id, updateData);
      
      toast.success("Platform Updated", {
        description: `${currentPlatform.name} was successfully updated in Supabase`
      });
      
      setIsEditPlatformOpen(false);
    } catch (error) {
      console.error("Error updating platform in Supabase:", error);
      toast.error("Failed to update platform", {
        description: "An error occurred while updating in Supabase. Please try again."
      });
    }
  };

  // Handler for viewing analytics
  const handleViewAnalytics = (platformId: string) => {
    console.log("Viewing analytics for platform ID:", platformId);
    
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setCurrentPlatform({
        id: platform.id,
        name: platform.name,
        url: platform.url,
        status: platform.status
      });
      setIsAnalyticsDialogOpen(true);
    }
  };

  // Handler for disconnecting platform (deleting from Supabase)
  const handleDisconnect = async (platformId: string) => {
    console.log("Disconnecting platform ID from Supabase:", platformId);
    
    try {
      await deletePlatform(platformId);
      
      toast.warning("Platform Disconnected", {
        description: "The platform has been disconnected and removed from Supabase."
      });
    } catch (error) {
      console.error("Error deleting platform from Supabase:", error);
      toast.error("Failed to disconnect platform", {
        description: "An error occurred while removing from Supabase. Please try again."
      });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Platforms</h1>
        <p className="page-description">Manage your autosurf platform integrations</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search platforms..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleAddPlatform} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading platform data...
                </TableCell>
              </TableRow>
            ) : filteredPlatforms.length > 0 ? (
              filteredPlatforms.map(platform => (
                <TableRow key={platform.id}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getStatusColor(platform.status)
                    )}>
                      {platform.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={platform.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {platform.url.replace('https://', '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
                        <DropdownMenuItem onClick={() => handleEditPlatform(platform.id!)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAnalytics(platform.id!)} className="cursor-pointer">
                          <BarChart2 className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDisconnect(platform.id!)}
                          className="text-destructive cursor-pointer"
                        >
                          <Link2Off className="mr-2 h-4 w-4" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No platforms found. Add your first platform to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Platform Dialog */}
      <Dialog open={isAddPlatformOpen} onOpenChange={setIsAddPlatformOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Platform</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform-name" className="text-right">
                Name
              </Label>
              <Input
                id="platform-name"
                placeholder="Platform name"
                className="col-span-3"
                value={newPlatform.name}
                onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform-url" className="text-right">
                URL
              </Label>
              <Input
                id="platform-url"
                placeholder="https://platform-url.com"
                className="col-span-3"
                value={newPlatform.url}
                onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform-status" className="text-right">
                Status
              </Label>
              <Select 
                value={newPlatform.status} 
                onValueChange={(value) => setNewPlatform({...newPlatform, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPlatformOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlatform}>
              Add Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Platform Dialog */}
      <Dialog open={isEditPlatformOpen} onOpenChange={setIsEditPlatformOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-platform-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-platform-name"
                placeholder="Platform name"
                className="col-span-3"
                value={currentPlatform.name}
                onChange={(e) => setCurrentPlatform({...currentPlatform, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-platform-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-platform-url"
                placeholder="https://platform-url.com"
                className="col-span-3"
                value={currentPlatform.url}
                onChange={(e) => setCurrentPlatform({...currentPlatform, url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-platform-status" className="text-right">
                Status
              </Label>
              <Select 
                value={currentPlatform.status} 
                onValueChange={(value) => setCurrentPlatform({...currentPlatform, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlatformOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedPlatform}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Platform Analytics: {currentPlatform.name}</DialogTitle>
            <DialogDescription>
              Traffic performance metrics for this platform
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/20 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-3">Traffic Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-muted-foreground text-sm">Daily Traffic</p>
                  <p className="text-2xl font-bold">12,453</p>
                  <p className="text-xs text-emerald-500">↑ 12% from last week</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-muted-foreground text-sm">Avg. Time (sec)</p>
                  <p className="text-2xl font-bold">42.3</p>
                  <p className="text-xs text-emerald-500">↑ 5% from last week</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-muted-foreground text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold">3.7%</p>
                  <p className="text-xs text-rose-500">↓ 1.2% from last week</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Performance History</h3>
              <div className="h-[180px] w-full bg-white rounded-md mb-4 flex items-center justify-center">
                <p className="text-muted-foreground">Analytics chart would appear here in a full implementation</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAnalyticsDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast.success("Report Download Started", {
                  description: `Analytics for ${currentPlatform.name} is downloading.`
                });
                
                // Create sample report data
                const reportData = {
                  name: currentPlatform.name,
                  url: currentPlatform.url,
                  status: currentPlatform.status,
                  stats: {
                    dailyTraffic: 12453,
                    avgTime: 42.3,
                    conversionRate: "3.7%"
                  }
                };
                
                // Create and download the file
                const blob = new Blob(
                  [JSON.stringify(reportData, null, 2)], 
                  { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${currentPlatform.name.toLowerCase().replace(/\s+/g, '-')}-report.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Platforms;
