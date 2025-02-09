
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, Calendar, AlertTriangle, Settings } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    icon: ShoppingBag,
  },
  {
    name: "WooCommerce",
    description: "Integrate with WooCommerce to manage your inventory",
    icon: Store,
  },
  {
    name: "Amazon",
    description: "Connect to Amazon Marketplace for seamless selling",
    icon: Box,
  },
  {
    name: "Etsy",
    description: "Sync your Etsy shop with our inventory system",
    icon: Palette,
  },
];

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expiryDialogOpen, setExpiryDialogOpen] = useState(false);
  const [damageDialogOpen, setDamageDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
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
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="live-stock">Live Stock</TabsTrigger>
            <TabsTrigger value="add-products">Add Products</TabsTrigger>
          </TabsList>

          <TabsContent value="live-stock" className="space-y-4">
            <div className="overflow-x-auto rounded-md border">
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
                          {product.lastUpdated}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="add-products" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
                    className="w-full"
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
                    className="w-full"
                  >
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Add Combined Product
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Set Expiry</h3>
                    <p className="text-sm text-muted-foreground">
                      Set expiration dates for your products
                    </p>
                  </div>
                  <Button
                    onClick={() => setExpiryDialogOpen(true)}
                    className="w-full"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Set Expiry Date
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Damage Products</h3>
                    <p className="text-sm text-muted-foreground">
                      Report damaged or defective items
                    </p>
                  </div>
                  <Button
                    onClick={() => setDamageDialogOpen(true)}
                    className="w-full"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Damage
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Stock Adjustment</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust stock levels and quantities
                    </p>
                  </div>
                  <Button
                    onClick={() => setAdjustmentDialogOpen(true)}
                    className="w-full"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Adjust Stock
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

      <Dialog open={expiryDialogOpen} onOpenChange={setExpiryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Product Expiry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product Name</Label>
              <Input id="product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input type="date" id="expiry-date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={damageDialogOpen} onOpenChange={setDamageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Damaged Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="damage-product">Product Name</Label>
              <Input id="damage-product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="damage-quantity">Quantity Damaged</Label>
              <Input type="number" id="damage-quantity" min="1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="damage-reason">Reason</Label>
              <Input id="damage-reason" placeholder="Enter damage reason" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment-product">Product Name</Label>
              <Input id="adjustment-product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input type="number" id="current-stock" disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-stock">New Stock Level</Label>
              <Input type="number" id="new-stock" min="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjustment-reason">Reason for Adjustment</Label>
              <Input id="adjustment-reason" placeholder="Enter reason" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
