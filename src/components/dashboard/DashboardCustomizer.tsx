
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown, Check, Layers, MoveHorizontal } from 'lucide-react';

interface DashboardWidgetConfig {
  id: string;
  name: string;
  visible: boolean;
  position: number;
}

interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (widgets: DashboardWidgetConfig[]) => void;
  initialWidgets: DashboardWidgetConfig[];
}

export function DashboardCustomizer({ isOpen, onClose, onSave, initialWidgets }: DashboardCustomizerProps) {
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(initialWidgets);
  const { toast } = useToast();

  const handleToggleWidget = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible } 
          : widget
      )
    );
  };

  const handleSave = () => {
    onSave(widgets);
    toast({
      title: "Dashboard Updated",
      description: "Your dashboard layout has been saved.",
      duration: 3000,
    });
    onClose();
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const currentIndex = widgets.findIndex(w => w.id === widgetId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === widgets.length - 1)
    ) {
      return;
    }

    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newWidgets[currentIndex].position, newWidgets[targetIndex].position] = 
    [newWidgets[targetIndex].position, newWidgets[currentIndex].position];
    
    newWidgets.sort((a, b) => a.position - b.position);
    
    setWidgets(newWidgets);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
          <DialogDescription>
            Show or hide widgets and rearrange their order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Dashboard Widgets</h3>
          </div>
          
          <div className="space-y-3">
            {widgets.map(widget => (
              <div key={widget.id} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={`widget-${widget.id}`} className="cursor-pointer">
                    {widget.name}
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => moveWidget(widget.id, 'up')}
                      disabled={widget.position === 0}
                    >
                      <ArrowUpDown className="h-4 w-4 rotate-90" />
                      <span className="sr-only">Move up</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => moveWidget(widget.id, 'down')}
                      disabled={widget.position === widgets.length - 1}
                    >
                      <ArrowUpDown className="h-4 w-4 -rotate-90" />
                      <span className="sr-only">Move down</span>
                    </Button>
                  </div>
                  
                  <Switch 
                    id={`widget-${widget.id}`} 
                    checked={widget.visible} 
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
