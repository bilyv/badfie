
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the data structure for table rows
export interface TableItem {
  id: number | string;
  image?: string;
  name: string;
  sku?: string;
  category?: string;
  inStock?: number;
  status?: string;
  lastUpdated?: string;
}

interface ResponsiveTableProps {
  data: TableItem[];
  // Optional function to determine status color based on status string
  getStatusColor?: (status: string) => string;
  // Optional custom class names for specific table parts
  className?: string;
  tableClassName?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  getStatusColor = (status) => {
    // Default status color logic if not provided
    switch (status) {
      case "In Stock":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Low Stock":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Critical Stock":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  },
  className,
  tableClassName,
}) => {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {/* Always visible column */}
            <TableHead>Image</TableHead>
            
            {/* Always visible column */}
            <TableHead className="w-[250px]">Item Name</TableHead>
            
            {/* Hidden on small screens, visible on sm and up */}
            <TableHead className="hidden sm:table-cell">SKU</TableHead>
            
            {/* Always visible column */}
            <TableHead>Category</TableHead>
            
            {/* Hidden on small screens, visible on md and up */}
            <TableHead className="hidden md:table-cell text-center">In Stock</TableHead>
            
            {/* Hidden on small screens, visible on lg and up */}
            <TableHead className="hidden lg:table-cell text-center">Status</TableHead>
            
            {/* Hidden on small screens, visible on xl and up */}
            <TableHead className="hidden xl:table-cell text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {/* Always visible column */}
              <TableCell>
                {item.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </TableCell>
              
              {/* Always visible column */}
              <TableCell className="font-medium">{item.name}</TableCell>
              
              {/* Hidden on small screens, visible on sm and up */}
              <TableCell className="hidden sm:table-cell font-mono text-sm">
                {item.sku}
              </TableCell>
              
              {/* Always visible column */}
              <TableCell>{item.category}</TableCell>
              
              {/* Hidden on small screens, visible on md and up */}
              <TableCell className="hidden md:table-cell text-center">
                {item.inStock !== undefined && (
                  <span className="font-medium">{item.inStock}</span>
                )}
              </TableCell>
              
              {/* Hidden on small screens, visible on lg and up */}
              <TableCell className="hidden lg:table-cell text-center">
                {item.status && (
                  <Badge
                    className={getStatusColor(item.status)}
                    variant="outline"
                  >
                    {item.status}
                  </Badge>
                )}
              </TableCell>
              
              {/* Hidden on small screens, visible on xl and up */}
              <TableCell className="hidden xl:table-cell text-right">
                {item.lastUpdated && (
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{item.lastUpdated}</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
