
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
          <TableHead>Image</TableHead>
          <TableHead className="w-[250px]">Item Name</TableHead>
          <TableHead className="hidden md:table-cell">SKU</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead className="text-center">In Stock</TableHead>
          <TableHead className="hidden md:table-cell text-center">Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="hidden md:table-cell font-mono text-sm">{product.sku}</TableCell>
            <TableCell className="hidden md:table-cell">{product.category}</TableCell>
            <TableCell className="text-center">
              <span className="font-medium">{product.inStock}</span>
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </TableCell>
            <TableCell className="hidden md:table-cell text-right">
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
