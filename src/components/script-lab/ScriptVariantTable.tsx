
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Edit, Trash2, Copy, Star } from "lucide-react";

const variantData = [
  {
    id: "1",
    name: "Default Variant",
    ctr: 4.3,
    acceptanceRate: 43,
    isActive: true,
  },
  {
    id: "2",
    name: "50ms Delay Variant",
    ctr: 3.9,
    acceptanceRate: 38,
    isActive: false,
  },
  {
    id: "3",
    name: "Device Detection",
    ctr: 5.1,
    acceptanceRate: 53,
    isActive: false,
  },
];

const ScriptVariantTable = () => {
  return (
    <div className="overflow-hidden rounded-md border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Name</TableHead>
            <TableHead className="text-center">CTR</TableHead>
            <TableHead className="text-center">Accept</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variantData.map((variant) => (
            <TableRow key={variant.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{variant.name}</TableCell>
              <TableCell className="text-center">{variant.ctr}%</TableCell>
              <TableCell className="text-center">{variant.acceptanceRate}%</TableCell>
              <TableCell className="text-center">
                <StatusBadge 
                  variant={variant.isActive ? "success" : "muted"}
                  withDot={true}
                  label={variant.isActive ? "Active" : "Inactive"}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {variant.isActive ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-success">
                      <Star className="h-4 w-4 fill-current" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScriptVariantTable;
