import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddProductForm } from "@/components/products/AddProductForm";

const Products = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory</p>
      </div>
      
      <Tabs defaultValue="livestock" className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="livestock" className="text-sm py-1.5">Products List</TabsTrigger>
            <TabsTrigger value="add-product" className="text-sm py-1.5">Add Product</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="livestock">
          <Card className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product A</TableCell>
                    <TableCell className="hidden md:table-cell">Electronics</TableCell>
                    <TableCell>Individual</TableCell>
                    <TableCell>$299.99</TableCell>
                    <TableCell className="hidden md:table-cell">In Stock</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add-product">
          <Card className="p-6">
            <AddProductForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;