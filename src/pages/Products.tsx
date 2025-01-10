import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Package, PackagePlus } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("individual");

  const handleAddProduct = (type: ProductType) => {
    setSelectedProductType(type);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleAddProduct("individual")}
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Package className="mr-2 h-4 w-4" />
            Add Individual Product
          </Button>
          <Button
            onClick={() => handleAddProduct("combined")}
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Combined Product
          </Button>
        </div>
      </div>
      
      <Card className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Product Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">Product A</TableCell>
                <TableCell className="hidden md:table-cell">Electronics</TableCell>
                <TableCell>Individual</TableCell>
                <TableCell>$299.99</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productType={selectedProductType}
      />
    </div>
  );
};

export default Products;