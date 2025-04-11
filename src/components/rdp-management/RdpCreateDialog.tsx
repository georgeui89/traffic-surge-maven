
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
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RdpCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRdp?: (rdpData: any) => void;
}

// Define validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dedicatedIp: z.string().min(1, "Dedicated IP is required"),
  provider: z.string().min(1, "Provider is required"),
  cpuCores: z.coerce.number().min(1, "CPU cores must be at least 1"),
  memory: z.coerce.number().min(1, "Memory must be at least 1 GB"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  costPeriod: z.enum(["monthly", "daily"]),
});

type FormValues = z.infer<typeof formSchema>;

export function RdpCreateDialog({ open, onOpenChange, onCreateRdp }: RdpCreateDialogProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<{
    id: string;
    name: string;
    weight: number;
  }[]>([]);
  
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const { toast } = useToast();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dedicatedIp: "",
      provider: "",
      cpuCores: 4,
      memory: 8,
      cost: 10.99,
      costPeriod: "monthly",
    }
  });
  
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
  
  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }
    
    if (onCreateRdp) {
      // Add the platform information to the form data
      const rdpData = {
        ...values,
        platforms: selectedPlatforms,
        status: 'offline', // New RDPs start as offline
        visits: 0,
        revenue: 0,
      };
      
      console.log("Submitting RDP data:", rdpData);
      onCreateRdp(rdpData);
      
      // Reset form and selected platforms
      form.reset();
      setSelectedPlatforms([]);
    } else {
      toast({
        title: "RDP Created",
        description: `${values.name} has been created successfully with ${selectedPlatforms.length} platforms`,
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
        <DialogHeader>
          <DialogTitle>Create New RDP</DialogTitle>
          <DialogDescription>
            Configure your new RDP instance and assign platforms
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., RDP-01, Contabo-DE" 
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dedicatedIp"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Dedicated IP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 192.168.1.1" 
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Provider</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Digital Ocean, Contabo" 
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpuCores"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">CPU Cores</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Memory (GB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="col-span-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costPeriod"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Cost Period</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-3 col-start-2" />
                </FormItem>
              )}
            />
            
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
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create RDP</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
