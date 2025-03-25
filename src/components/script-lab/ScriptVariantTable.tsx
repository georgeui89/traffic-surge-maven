
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash, ArrowUp, ArrowDown, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Mock data for script variants
const variants = [
  {
    id: 1,
    name: 'Basic Redirect (Default)',
    type: 'basic',
    delay: 30,
    active: true,
    status: 'active',
    ctr: 18.5,
    cpm: 4.20,
    acceptanceRate: 92,
    impressions: 54320,
    lastTested: '2 hours ago'
  },
  {
    id: 2,
    name: 'Mobile Optimized',
    type: 'advanced',
    delay: 20,
    active: true,
    status: 'testing',
    ctr: 22.7,
    cpm: 5.15,
    acceptanceRate: 87,
    impressions: 32180,
    lastTested: '6 hours ago'
  },
  {
    id: 3,
    name: 'Extended Delay',
    type: 'basic',
    delay: 40,
    active: false,
    status: 'paused',
    ctr: 15.2,
    cpm: 3.85,
    acceptanceRate: 94,
    impressions: 18760,
    lastTested: '1 day ago'
  },
  {
    id: 4,
    name: 'Geo-Targeted',
    type: 'custom',
    delay: 25,
    active: false,
    status: 'error',
    ctr: 0,
    cpm: 0,
    acceptanceRate: 0,
    impressions: 0,
    lastTested: 'Never'
  }
];

export const ScriptVariantTable: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Script Variant</TableHead>
              <TableHead className="w-[10%]">Delay</TableHead>
              <TableHead className="w-[10%]">CTR</TableHead>
              <TableHead className="w-[10%]">CPM</TableHead>
              <TableHead className="w-[15%]">Acceptance</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[20%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    {variant.name}
                    <span className="text-xs text-muted-foreground">
                      {variant.impressions.toLocaleString()} impressions
                    </span>
                  </div>
                </TableCell>
                <TableCell>{variant.delay}ms</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {variant.ctr}%
                    {variant.id === 2 && (
                      <ArrowUp className="h-4 w-4 text-success" />
                    )}
                    {variant.id === 3 && (
                      <ArrowDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </TableCell>
                <TableCell>${variant.cpm.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{variant.acceptanceRate}%</span>
                    </div>
                    <Progress value={variant.acceptanceRate} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  {variant.status === 'active' && (
                    <Badge className="bg-success">
                      <CheckCircle className="h-3 w-3 mr-1" /> Active
                    </Badge>
                  )}
                  {variant.status === 'testing' && (
                    <Badge variant="secondary">
                      <Play className="h-3 w-3 mr-1" /> Testing
                    </Badge>
                  )}
                  {variant.status === 'paused' && (
                    <Badge variant="outline">Paused</Badge>
                  )}
                  {variant.status === 'error' && (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" /> Error
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Duplicate">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete">
                      <Trash className="h-4 w-4" />
                    </Button>
                    {variant.status !== 'testing' && (
                      <Button variant="ghost" size="icon" title="Test">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
