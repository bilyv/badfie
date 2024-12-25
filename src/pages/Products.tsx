import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const Products = () => {
  const [activeTab, setActiveTab] = useState("livestock");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="livestock" className="text-sm py-1.5">Livestock</TabsTrigger>
            <TabsTrigger value="add-product" className="text-sm py-1.5">Add Product</TabsTrigger>
            <TabsTrigger value="expire-details" className="text-sm py-1.5">Expire Details</TabsTrigger>
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
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product A</TableCell>
                    <TableCell className="hidden md:table-cell">Electronics</TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>$299.99</TableCell>
                    <TableCell className="hidden md:table-cell">In Stock</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add-product">
          <Card className="p-4">
            <form className="space-y-4 max-w-lg mx-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input placeholder="Select category" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input type="number" placeholder="Enter price" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Stock</label>
                  <Input type="number" placeholder="Enter initial stock" />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Add Product</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="expire-details">
          <Card className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product Name</TableHead>
                    <TableHead className="hidden md:table-cell">Batch Number</TableHead>
                    <TableHead>Manufacturing Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product A</TableCell>
                    <TableCell className="hidden md:table-cell">BATCH001</TableCell>
                    <TableCell>2024-01-01</TableCell>
                    <TableCell>2025-01-01</TableCell>
                    <TableCell className="hidden md:table-cell">Valid</TableCell>
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

export default Products;