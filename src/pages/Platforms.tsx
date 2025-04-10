
import { useState } from 'react';
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
import { platforms } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Platforms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast: uiToast } = useToast();
  const [isAddPlatformOpen, setIsAddPlatformOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState({ name: '', url: '', status: 'inactive' });

  const filteredPlatforms = platforms.filter(platform => 
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlatform = () => {
    setIsAddPlatformOpen(true);
  };

  const handleSavePlatform = () => {
    if (!newPlatform.name || !newPlatform.url) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields"
      });
      return;
    }

    // In a real app, this would be an API call
    // platforms.push({...newPlatform, id: Date.now().toString()});
    
    toast.success("Platform Added", {
      description: `${newPlatform.name} was successfully added`
    });
    
    setIsAddPlatformOpen(false);
    setNewPlatform({ name: '', url: '', status: 'inactive' });
  };

  const handleEditPlatform = (platformId: string) => {
    toast.info("Edit Platform", {
      description: `Opening edit form for platform ID: ${platformId}`
    });
    // In a real app, this would open an edit dialog
  };

  const handleViewAnalytics = (platformId: string) => {
    toast.info("View Analytics", {
      description: `Navigating to analytics for platform ID: ${platformId}`
    });
    // In a real app, this would navigate to analytics page
  };

  const handleDisconnect = (platformId: string) => {
    toast.warning("Disconnect Platform", {
      description: `Are you sure you want to disconnect this platform? This action would require confirmation in a production app.`
    });
    // In a real app, this would open a confirmation dialog
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
            {filteredPlatforms.map(platform => (
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
                      <DropdownMenuItem onClick={() => handleEditPlatform(platform.id)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewAnalytics(platform.id)} className="cursor-pointer">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDisconnect(platform.id)}
                        className="text-destructive cursor-pointer"
                      >
                        <Link2Off className="mr-2 h-4 w-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
};

export default Platforms;
