import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, Link2 } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";

const integrations = [
  {
    name: "Shopify",
    description: "Connect your Shopify store to sync products and orders",
    icon: "🛍️",
  },
  {
    name: "WooCommerce",
    description: "Integrate with WooCommerce to manage your inventory",
    icon: "🛒",
  },
  {
    name: "Amazon",
    description: "Connect to Amazon Marketplace for seamless selling",
    icon: "📦",
  },
  {
    name: "Etsy",
    description: "Sync your Etsy shop with our inventory system",
    icon: "🎨",
  },
];

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("individual");
  const [products] = useState([]);

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
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="add-products">Add Products</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Product Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No products found. Add some products to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="add-products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Individual Product</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a single product with its own specifications
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAddProduct("individual")}
                    className="w-full sm:w-auto"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Add Individual Product
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <PackagePlus className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Combined Product</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a product made up of multiple ingredients
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAddProduct("combined")}
                    className="w-full sm:w-auto"
                  >
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Add Combined Product
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Link2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Connect Store</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect and sync with your e-commerce platforms
                    </p>
                  </div>
                  <Button
                    onClick={() => setConnectDialogOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect Store
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productType={selectedProductType}
      />

      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Connect to E-commerce Platforms</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 mt-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl mb-2">{integration.icon}</div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                  <Button variant="outline" className="shrink-0">
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;