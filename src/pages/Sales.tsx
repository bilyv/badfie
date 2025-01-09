import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { useState } from "react";
import { FilePlus, ListPlus } from "lucide-react";
import { ProductType } from "@/lib/types";

const Sales = () => {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("individual");

  const handleOpenProductForm = (type: ProductType) => {
    setSelectedProductType(type);
    setIsProductFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sales
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your sales and customers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => handleOpenProductForm("individual")}
            className="w-full sm:w-auto bg-primary/90 hover:bg-primary transition-colors"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Individual Product
          </Button>
          <Button
            onClick={() => handleOpenProductForm("combined")}
            variant="secondary"
            className="w-full sm:w-auto bg-secondary/90 hover:bg-secondary transition-colors"
          >
            <ListPlus className="mr-2 h-4 w-4" />
            Combined Product
          </Button>
        </div>
      </div>

      <ProductFormDialog
        open={isProductFormOpen}
        onOpenChange={setIsProductFormOpen}
        productType={selectedProductType}
      />

      <Tabs defaultValue="manage" className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="manage" className="text-sm py-1.5">Manage Sales</TabsTrigger>
            <TabsTrigger value="add" className="text-sm py-1.5">Add Sale</TabsTrigger>
            <TabsTrigger value="customers" className="text-sm py-1.5">Customers</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="manage">
          <Card className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell className="hidden md:table-cell">Product A, Product B</TableCell>
                    <TableCell>$150.00</TableCell>
                    <TableCell className="hidden md:table-cell">Completed</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card className="p-4">
            <form className="space-y-4 max-w-lg mx-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" placeholder="Select customer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Input id="product" placeholder="Select product" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="0.01" />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Add Sale</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell className="hidden md:table-cell">john@example.com</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>$750.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;