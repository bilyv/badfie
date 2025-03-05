import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus, Settings, Plus, FolderPlus, Search } from "lucide-react";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { ProductType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductListView } from "@/components/products/ProductListView";
import { ProductGridView } from "@/components/products/ProductGridView";
import { StockViewSwitch } from "@/components/products/StockViewSwitch";
import { ProductTemplates } from "@/components/products/ProductTemplates";

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

const stockMovementData = [
  { 
    id: 1, 
    name: "Premium Enterprise Laptop", 
    type: "Outbound", 
    quantity: -5, 
    date: "2024-02-15", 
    reference: "ORD-001",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  { 
    id: 2, 
    name: "Ergonomic Office Chair", 
    type: "Inbound", 
    quantity: 10, 
    date: "2024-02-14", 
    reference: "PO-002",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  { 
    id: 3, 
    name: "Wireless Noise-Canceling Headphones", 
    type: "Transfer", 
    quantity: -2, 
    date: "2024-02-13", 
    reference: "TRF-003",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  }
];

const damagedStockData = [
  { 
    id: 1, 
    name: "4K Ultra HD Monitor", 
    damageType: "Screen Damage", 
    quantity: 2, 
    reportDate: "2024-02-12", 
    status: "Pending Review",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  { 
    id: 2, 
    name: "Premium Enterprise Laptop", 
    damageType: "Hardware Failure", 
    quantity: 1, 
    reportDate: "2024-02-11", 
    status: "Approved",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  }
];

const expiryStockData = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    batchNumber: "BTH-2024-001", 
    expiryDate: "2025-02-15", 
    quantity: 25, 
    status: "Valid",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  { 
    id: 2, 
    name: "Premium Enterprise Laptop", 
    batchNumber: "LAP-2023-005", 
    expiryDate: "2024-04-20", 
    quantity: 3, 
    status: "Near Expiry",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  }
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
  const [searchQuery, setSearchQuery] = useState('');

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
    searchQuery === '' || 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                <TableHead>Image</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovementData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.type}</TableCell>
                  <TableCell className="text-center font-medium">
                    <span className={item.quantity < 0 ? "text-red-500" : "text-green-500"}>
                      {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.date}</TableCell>
                  <TableCell className="hidden lg:table-cell">{item.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'damaged':
        return (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Image</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="hidden sm:table-cell">Damage Type</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="hidden md:table-cell">Report Date</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {damagedStockData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.damageType}</TableCell>
                  <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.reportDate}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Approved" 
                        ? "text-green-600 bg-green-100" 
                        : "text-yellow-600 bg-yellow-100"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'expiry':
        return (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Image</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="hidden sm:table-cell">Batch Number</TableHead>
                <TableHead className="hidden md:table-cell">Expiry Date</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiryStockData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-sm">{item.batchNumber}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.expiryDate}</TableCell>
                  <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Valid" 
                        ? "text-green-600 bg-green-100" 
                        : "text-yellow-600 bg-yellow-100"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
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
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="live-stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="live-stock">Live Stock</TabsTrigger>
            <TabsTrigger value="add-products">Add Products</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="live-stock" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[300px]"
                />
              </div>
              <StockViewSwitch
                layout={layout}
                onLayoutChange={setLayout}
                onViewChange={setStockView}
              />
            </div>
            <div className="rounded-md border">
              {renderStockTable()}
            </div>
          </TabsContent>

          <TabsContent value="add-products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

          <TabsContent value="templates" className="space-y-4">
            <ProductTemplates products={sampleProducts} />
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
