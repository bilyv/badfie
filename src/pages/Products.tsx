import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, Link2, Badge, Clock, ShoppingCart, Store as StoreIcon, Package2, Paintbrush } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";

const sampleProducts = [
  {
    id: 1,
    name: "Premium Enterprise Laptop",
    sku: "LAP-PRO-2024",
    inStock: 45,
    category: "Electronics",
    lastUpdated: "2024-02-15",
    status: "In Stock",
    reorderPoint: 20,
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    sku: "CHR-ERG-001",
    inStock: 12,
    category: "Furniture",
    lastUpdated: "2024-02-14",
    status: "Low Stock",
    reorderPoint: 15,
  },
  {
    id: 3,
    name: "Wireless Noise-Canceling Headphones",
    sku: "AUD-WNC-003",
    inStock: 78,
    category: "Audio",
    lastUpdated: "2024-02-13",
    status: "In Stock",
    reorderPoint: 25,
  },
  {
    id: 4,
    name: "4K Ultra HD Monitor",
    sku: "MON-4K-002",
    inStock: 8,
    category: "Electronics",
    lastUpdated: "2024-02-12",
    status: "Critical Stock",
    reorderPoint: 10,
  },
];

// Define the integrations array
const integrations = [
  {
    name: "Shopify",
    description: "Connect your Shopify store to sync products and orders",
    icon: ShoppingCart,
  },
  {
    name: "WooCommerce",
    description: "Integrate with WooCommerce to manage your inventory",
    icon: StoreIcon,
  },
  {
    name: "Amazon",
    description: "Connect to Amazon Marketplace for seamless selling",
    icon: Package2,
  },
  {
    name: "Etsy",
    description: "Sync your Etsy shop with our inventory system",
    icon: Paintbrush,
  },
];

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("individual");

  const handleAddProduct = (type: ProductType) => {
    setSelectedProductType(type);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Low Stock":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Critical Stock":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
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
        <Tabs defaultValue="live-stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="live-stock">Live Stock</TabsTrigger>
            <TabsTrigger value="add-products">Add Products</TabsTrigger>
          </TabsList>

          <TabsContent value="live-stock" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">In Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{product.inStock}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{product.lastUpdated}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
