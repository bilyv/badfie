
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  inStock: number;
  category: string;
  lastUpdated: string;
  status: string;
  image: string;
}

interface ProductListViewProps {
  products: Product[];
  getStatusColor: (status: string) => string;
}

export const ProductListView = ({ products, getStatusColor }: ProductListViewProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          {/* Always visible on all screen sizes */}
          <TableHead>Image</TableHead>
          
          {/* Always visible on all screen sizes */}
          <TableHead className="w-[250px]">Item Name</TableHead>
          
          {/* Hidden on small screens, visible on sm breakpoint and up */}
          <TableHead className="hidden sm:table-cell">SKU</TableHead>
          
          {/* Hidden on small screens, visible on md breakpoint and up */}
          <TableHead className="hidden md:table-cell">Category</TableHead>
          
          {/* Always visible (per user request) */}
          <TableHead className="text-center">In Stock</TableHead>
          
          {/* Hidden on small screens, visible on lg breakpoint and up */}
          <TableHead className="hidden lg:table-cell text-center">Status</TableHead>
          
          {/* Hidden on small screens, visible on xl breakpoint and up */}
          <TableHead className="hidden xl:table-cell text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            {/* Always visible */}
            <TableCell>
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </TableCell>
            
            {/* Always visible */}
            <TableCell className="font-medium">{product.name}</TableCell>
            
            {/* Hidden on small screens, visible on sm breakpoint and up */}
            <TableCell className="hidden sm:table-cell font-mono text-sm">{product.sku}</TableCell>
            
            {/* Hidden on small screens, visible on md breakpoint and up */}
            <TableCell className="hidden md:table-cell">{product.category}</TableCell>
            
            {/* Always visible (per user request) */}
            <TableCell className="text-center">
              <span className="font-medium">{product.inStock}</span>
            </TableCell>
            
            {/* Hidden on small screens, visible on lg breakpoint and up */}
            <TableCell className="hidden lg:table-cell text-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </TableCell>
            
            {/* Hidden on small screens, visible on xl breakpoint and up */}
            <TableCell className="hidden xl:table-cell text-right">
              <div className="flex items-center justify-end gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{product.lastUpdated}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
