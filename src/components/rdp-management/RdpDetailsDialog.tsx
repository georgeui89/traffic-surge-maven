
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Server, Globe, BarChart2, DollarSign, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RdpDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rdp: any | null;
}

export function RdpDetailsDialog({ open, onOpenChange, rdp }: RdpDetailsDialogProps) {
  if (!rdp) return null;

  // Simulation of platform distribution data
  const platformData = [
    { name: '9Hits', value: 60, color: '#16a34a' },
    { name: 'Otohits', value: 40, color: '#eab308' },
  ];

  // Simulation of RDP resource metrics
  const cpuUsage = 68;
  const memoryUsage = 72;
  const diskUsage = 45;
  const uptimeHours = 186; // ~7.75 days

  const rdpRoi = rdp.revenue > 0 && rdp.cost > 0 
    ? ((rdp.revenue - rdp.cost) / rdp.cost) * 100 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {rdp.name}
            <Badge variant={rdp.status === 'online' ? 'success' : 'destructive'} className="ml-2">
              {rdp.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed performance metrics and platform distribution
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(rdp.revenue)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Cost: {formatCurrency(rdp.cost)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{rdpRoi.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Target: 25%</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Traffic Distribution</CardTitle>
                <CardDescription>Traffic allocation across platforms</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="platforms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">9Hits</CardTitle>
                <CardDescription>Traffic and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Visits</span>
                    <span className="text-lg font-semibold">{formatNumber(rdp.visits * 0.6)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-lg font-semibold">{formatCurrency(rdp.revenue * 0.6)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="text-lg font-semibold text-success">{(rdpRoi * 1.15).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Acceptance Rate</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Otohits</CardTitle>
                <CardDescription>Traffic and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Visits</span>
                    <span className="text-lg font-semibold">{formatNumber(rdp.visits * 0.4)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-lg font-semibold">{formatCurrency(rdp.revenue * 0.4)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="text-lg font-semibold text-warning">{(rdpRoi * 0.85).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Acceptance Rate</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current</span>
                      <span className="font-medium">{cpuUsage}%</span>
                    </div>
                    <Progress value={cpuUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current</span>
                      <span className="font-medium">{memoryUsage}%</span>
                    </div>
                    <Progress value={memoryUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current</span>
                      <span className="font-medium">{diskUsage}%</span>
                    </div>
                    <Progress value={diskUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">{uptimeHours} hours</div>
                  <p className="text-xs text-muted-foreground">~{Math.floor(uptimeHours/24)} days, {uptimeHours % 24} hours</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="text-sm font-medium">182.154.32.{rdp.id}</div>
                  
                  <div className="text-sm text-muted-foreground">CPU</div>
                  <div className="text-sm font-medium">4 vCPU</div>
                  
                  <div className="text-sm text-muted-foreground">Memory</div>
                  <div className="text-sm font-medium">8 GB RAM</div>
                  
                  <div className="text-sm text-muted-foreground">OS</div>
                  <div className="text-sm font-medium">Windows Server 2019</div>
                  
                  <div className="text-sm text-muted-foreground">Provider</div>
                  <div className="text-sm font-medium">Digital Ocean</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
