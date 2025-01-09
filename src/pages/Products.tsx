import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddProductForm } from "@/components/products/AddProductForm";

const Products = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your product inventory</p>
      </div>
      
      <Tabs defaultValue="livestock" className="space-y-6">
        <Card className="border-b">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start h-14 p-2">
              <TabsTrigger 
                value="livestock" 
                className="relative h-10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors"
              >
                Products List
              </TabsTrigger>
              <TabsTrigger 
                value="add-product"
                className="relative h-10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors"
              >
                Add Product
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Card>

        <TabsContent value="livestock" className="space-y-4">
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