
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductListView } from "@/components/products/ProductListView";
import { ProductGridView } from "@/components/products/ProductGridView";

interface StockContentProps {
  stockView: 'real-time' | 'movement' | 'damaged' | 'expiry';
  layout: 'list' | 'grid';
  filteredProducts: any[];
  getStatusColor: (status: string) => string;
}

export const StockContent = ({ stockView, layout, filteredProducts, getStatusColor }: StockContentProps) => {
  switch (stockView) {
    case 'real-time':
      return (
        <div className="animate-fade-in">
          {layout === 'list' ? (
            <ProductListView products={filteredProducts} getStatusColor={getStatusColor} />
          ) : (
            <ProductGridView products={filteredProducts} getStatusColor={getStatusColor} />
          )}
        </div>
      );
    case 'movement':
      return (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Item Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Premium Enterprise Laptop</TableCell>
              <TableCell>Outbound</TableCell>
              <TableCell className="text-center">-5</TableCell>
              <TableCell>2024-02-15</TableCell>
              <TableCell>ORD-001</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    case 'damaged':
      return (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Item Name</TableHead>
              <TableHead>Damage Type</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Report Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>4K Ultra HD Monitor</TableCell>
              <TableCell>Screen Damage</TableCell>
              <TableCell className="text-center">2</TableCell>
              <TableCell>2024-02-12</TableCell>
              <TableCell>Pending Review</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    case 'expiry':
      return (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Item Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Wireless Headphones</TableCell>
              <TableCell>BTH-2024-001</TableCell>
              <TableCell>2025-02-15</TableCell>
              <TableCell className="text-center">25</TableCell>
              <TableCell>Valid</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
  }
};
