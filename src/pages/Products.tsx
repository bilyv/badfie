import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, Settings, Plus, FolderPlus } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductListView } from "@/components/products/ProductListView";
import { ProductGridView } from "@/components/products/ProductGridView";
import { StockViewSwitch } from "@/components/products/StockViewSwitch";
import { Search } from "lucide-react";

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
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    price: 1299.99,
    description: "High-performance laptop for business professionals"
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
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    price: 299.99,
    description: "Comfortable ergonomic chair for long work hours"
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
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    price: 199.99,
    description: "Premium wireless headphones with noise cancellation"
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
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    price: 499.99,
    description: "Professional 4K monitor for content creators"
  },
];

type StockViewType = 'real-time' | 'movement' | 'damaged' | 'expiry';
type LayoutType = 'list' | 'grid';

const Products = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType>("individual");
  const [stockView, setStockView] = useState<StockViewType>('real-time');
  const [layout, setLayout] = useState<LayoutType>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  const filteredProducts = sampleProducts.filter(product => 
    searchQuery ? (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
  );

  const renderStockTable = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 w-full md:w-[300px]"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearching(false);
                    setSearchQuery('');
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSearching(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Card className="p-4 md:p-6">
        <Tabs defaultValue="live-stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-4">
            <TabsTrigger 
              value="live-stock"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Live Stock
            </TabsTrigger>
            <TabsTrigger 
              value="add-products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Add Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-stock" className="space-y-4">
            <StockViewSwitch
              layout={layout}
              onLayoutChange={setLayout}
              onViewChange={setStockView}
            />
            <div className="rounded-md border overflow-x-auto">
              {renderStockTable()}
            </div>
          </TabsContent>

          <TabsContent value="add-products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Stock Adjustment</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust stock levels when mistakenly configured
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

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Request Stock</h3>
                    <p className="text-sm text-muted-foreground">
                      Request additional stock for existing products
                    </p>
                  </div>
                  <Button
                    onClick={() => setRequestDialogOpen(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Request Stock
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FolderPlus className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Create Category</h3>
                    <p className="text-sm text-muted-foreground">
                      Create new categories for products
                    </p>
                  </div>
                  <Button
                    onClick={() => setCategoryDialogOpen(true)}
                    className="w-full"
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Add Category
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

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Additional Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="request-product">Product Name</Label>
              <Input id="request-product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-quantity">Quantity Needed</Label>
              <Input type="number" id="request-quantity" min="1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-priority">Priority Level</Label>
              <Input id="request-priority" placeholder="High/Medium/Low" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-notes">Additional Notes</Label>
              <Input id="request-notes" placeholder="Enter any additional details" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input id="category-name" placeholder="Enter category name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">Description</Label>
              <Input id="category-description" placeholder="Enter category description" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
