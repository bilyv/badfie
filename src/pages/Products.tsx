
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { ProductType } from "@/lib/types";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductDialogs } from "@/components/products/ProductDialogs";
import { StockContent } from "@/components/products/StockContent";
import { AddProductsContent } from "@/components/products/AddProductsContent";
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
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        if (!searchQuery) {
          setSearchQuery("");
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery]);

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

  return (
    <div className="space-y-6">
      <ProductHeader
        isSearching={isSearching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsSearching={setIsSearching}
        searchRef={searchRef}
      />
      
      <Card className="p-4 md:p-6">
        <Tabs defaultValue="live-stock" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-4">
            <TabsTrigger 
              value="live-stock"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Live Stock
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="add-products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Add Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-stock" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <StockViewSwitch
                layout={layout}
                onLayoutChange={setLayout}
                onViewChange={setStockView}
              />
            </div>
            <div className="rounded-md border overflow-x-auto">
              <StockContent 
                stockView={stockView}
                layout={layout}
                filteredProducts={filteredProducts}
                getStatusColor={getStatusColor}
              />
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <ProductTemplates products={sampleProducts} />
          </TabsContent>

          <TabsContent value="add-products" className="space-y-6">
            <AddProductsContent
              onAddProduct={handleAddProduct}
              onOpenAdjustment={() => setAdjustmentDialogOpen(true)}
              onOpenRequest={() => setRequestDialogOpen(true)}
              onOpenCategory={() => setCategoryDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <ProductDialogs
        dialogOpen={dialogOpen}
        adjustmentDialogOpen={adjustmentDialogOpen}
        requestDialogOpen={requestDialogOpen}
        categoryDialogOpen={categoryDialogOpen}
        selectedProductType={selectedProductType}
        setDialogOpen={setDialogOpen}
        setAdjustmentDialogOpen={setAdjustmentDialogOpen}
        setRequestDialogOpen={setRequestDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
      />
    </div>
  );
};

export default Products;
