
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { platforms } from "@/utils/mockData";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RdpCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRdp?: (rdpData: any) => void;
}

export function RdpCreateDialog({ open, onOpenChange, onCreateRdp }: RdpCreateDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    provider: "digitalocean",
    cpuCores: "4",
    memory: "8",
    cost: "5",
  });
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<{
    id: string;
    name: string;
    weight: number;
  }[]>([]);
  
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddPlatform = () => {
    if (!selectedPlatformId) return;
    
    const platformToAdd = platforms.find(p => p.id === selectedPlatformId);
    if (!platformToAdd) return;
    
    // Check if already added
    if (selectedPlatforms.some(p => p.id === selectedPlatformId)) {
      toast({
        title: "Platform already added",
        description: "This platform is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    // Add platform with default weight
    setSelectedPlatforms([
      ...selectedPlatforms,
      { id: platformToAdd.id, name: platformToAdd.name, weight: 50 }
    ]);
    
    setSelectedPlatformId("");
  };
  
  const handleRemovePlatform = (platformId: string) => {
    setSelectedPlatforms(selectedPlatforms.filter(p => p.id !== platformId));
  };
  
  const handleWeightChange = (platformId: string, weight: number) => {
    setSelectedPlatforms(selectedPlatforms.map(p => 
      p.id === platformId ? { ...p, weight } : p
    ));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form data
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the RDP",
        variant: "destructive",
      });
      return;
    }
    
    if (onCreateRdp) {
      // Call the parent component's callback with the form data
      onCreateRdp({
        ...formData,
        platforms: selectedPlatforms
      });
      
      // Reset the form
      setFormData({
        name: "",
        provider: "digitalocean",
        cpuCores: "4",
        memory: "8",
        cost: "5",
      });
      setSelectedPlatforms([]);
    } else {
      toast({
        title: "RDP Created",
        description: `${formData.name} has been created successfully with ${selectedPlatforms.length} platforms`,
      });
      onOpenChange(false);
    }
  };
  
  // Calculate available platforms for selection
  const availablePlatforms = platforms.filter(p => 
    !selectedPlatforms.some(sp => sp.id === p.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New RDP</DialogTitle>
            <DialogDescription>
              Configure your new RDP instance and platform allocation
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="E.g., RDP-01"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => handleSelectChange("provider", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digitalocean">Digital Ocean</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="gcp">Google Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpuCores" className="text-right">
                CPU Cores
              </Label>
              <Select
                value={formData.cpuCores}
                onValueChange={(value) => handleSelectChange("cpuCores", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select CPU cores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 vCPU</SelectItem>
                  <SelectItem value="4">4 vCPU</SelectItem>
                  <SelectItem value="8">8 vCPU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memory" className="text-right">
                Memory
              </Label>
              <Select
                value={formData.memory}
                onValueChange={(value) => handleSelectChange("memory", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select memory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 GB</SelectItem>
                  <SelectItem value="8">8 GB</SelectItem>
                  <SelectItem value="16">16 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Cost ($/day)
              </Label>
              <Input
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                type="number"
                min="0"
                step="0.01"
                className="col-span-3"
              />
            </div>
            
            <div className="border-t my-4"></div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Platforms</Label>
              <div className="col-span-3 flex gap-2">
                <Select
                  value={selectedPlatformId}
                  onValueChange={setSelectedPlatformId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No more platforms available
                      </SelectItem>
                    ) : (
                      availablePlatforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={handleAddPlatform}
                  disabled={!selectedPlatformId}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {selectedPlatforms.length > 0 && (
              <div className="col-span-4 mt-2 space-y-4">
                <div className="text-sm font-medium ml-[120px]">Platform Distribution</div>
                {selectedPlatforms.map(platform => (
                  <div key={platform.id} className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Badge className="mr-2">{platform.weight}%</Badge>
                    </div>
                    <div className="col-span-2 flex items-center gap-4">
                      <Slider 
                        value={[platform.weight]} 
                        min={10} 
                        max={100} 
                        step={5}
                        onValueChange={(value) => handleWeightChange(platform.id, value[0])}
                      />
                      <span className="text-sm whitespace-nowrap">{platform.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePlatform(platform.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create RDP</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
