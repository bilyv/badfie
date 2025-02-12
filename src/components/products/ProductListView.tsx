
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-full overflow-auto">
      <ScrollArea className="rounded-md border h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="min-w-[200px]">Item Name</TableHead>
              <TableHead className="text-center w-[100px]">Stock</TableHead>
              <TableHead className="text-center min-w-[120px]">Status</TableHead>
              <TableHead className="hidden md:table-cell min-w-[120px]">SKU</TableHead>
              <TableHead className="hidden md:table-cell min-w-[120px]">Category</TableHead>
              <TableHead className="hidden lg:table-cell text-center min-w-[180px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="max-w-[200px] truncate">{product.name}</div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{product.inStock}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-sm">{product.sku}</TableCell>
                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{product.lastUpdated}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
