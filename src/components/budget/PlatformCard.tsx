
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Edit2, Save, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface PlatformProps {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  costPerVisit?: number;
  acceptanceRate?: number;
  cpm?: number;
  onUpdate: (id: string, updates: { name?: string; percentage?: number; costPerVisit?: number; acceptanceRate?: number; cpm?: number }) => void;
  onRemove: (id: string) => void;
  showAdvancedFields?: boolean;
}

export function PlatformCard({
  id,
  name,
  percentage,
  amount,
  color,
  costPerVisit = 0.0001,
  acceptanceRate = 0.4,
  cpm = 2,
  onUpdate,
  onRemove,
  showAdvancedFields = false
}: PlatformProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editCostPerVisit, setEditCostPerVisit] = useState(costPerVisit);
  const [editAcceptanceRate, setEditAcceptanceRate] = useState(acceptanceRate);
  const [editCpm, setEditCpm] = useState(cpm);
  
  const handleSliderChange = (value: number[]) => {
    onUpdate(id, { percentage: value[0] });
  };
  
  const handleDirectPercentageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onUpdate(id, { percentage: value });
    }
  };
  
  const handleSaveEdit = () => {
    onUpdate(id, { 
      name: editName,
      costPerVisit: editCostPerVisit,
      acceptanceRate: editAcceptanceRate,
      cpm: editCpm
    });
    setIsEditing(false);
  };
  
  return (
    <Card className={cn(
      "border transition-all duration-200",
      isEditing ? "border-primary/40 shadow-sm" : ""
    )}>
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${color}`}></div>
              <h3 className="text-sm font-medium">{name}</h3>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {isEditing ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0"
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-1 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor={`percentage-${id}`} className="text-xs">Allocation</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Input 
                  id={`percentage-${id}`}
                  type="number" 
                  min="0"
                  max="100"
                  step="5"
                  className="w-14 h-7 text-xs text-right"
                  value={Math.round(percentage)}
                  onChange={handleDirectPercentageInput}
                />
                <span className="ml-1 text-xs">%</span>
              </div>
              <span className="text-xs font-mono w-16 text-right">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>
          
          <Slider
            value={[percentage]}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="mt-2"
            aria-label={`${name} budget allocation`}
          />
        </div>
        
        {showAdvancedFields && isEditing && (
          <div className="space-y-3 border-t pt-3 mt-2">
            <div>
              <Label htmlFor={`cost-per-visit-${id}`} className="text-xs">Cost Per Visit ($)</Label>
              <Input
                id={`cost-per-visit-${id}`}
                type="number"
                min="0.0000001"
                step="0.0000001"
                value={editCostPerVisit}
                onChange={(e) => setEditCostPerVisit(Number(e.target.value))}
                className="h-7 text-xs mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor={`acceptance-rate-${id}`} className="text-xs">Acceptance Rate</Label>
              <div className="flex items-center">
                <Input
                  id={`acceptance-rate-${id}`}
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={editAcceptanceRate}
                  onChange={(e) => setEditAcceptanceRate(Number(e.target.value))}
                  className="h-7 text-xs mt-1"
                />
                <span className="text-xs ml-2">
                  ({(editAcceptanceRate * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`cpm-${id}`} className="text-xs">CPM Rate ($)</Label>
              <Input
                id={`cpm-${id}`}
                type="number"
                min="0.1"
                step="0.1"
                value={editCpm}
                onChange={(e) => setEditCpm(Number(e.target.value))}
                className="h-7 text-xs mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
