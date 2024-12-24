import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Products = () => {
  const [activeTab, setActiveTab] = useState("livestock");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="expire-details">Expire Details</TabsTrigger>
        </TabsList>

        <TabsContent value="livestock">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Product A</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>150</TableCell>
                  <TableCell>$299.99</TableCell>
                  <TableCell>In Stock</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="add-product">
          <Card className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input placeholder="Select category" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input type="number" placeholder="Enter price" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial Stock</label>
                <Input type="number" placeholder="Enter initial stock" />
              </div>
              <Button>Add Product</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="expire-details">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Manufacturing Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Product A</TableCell>
                  <TableCell>BATCH001</TableCell>
                  <TableCell>2024-01-01</TableCell>
                  <TableCell>2025-01-01</TableCell>
                  <TableCell>Valid</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;