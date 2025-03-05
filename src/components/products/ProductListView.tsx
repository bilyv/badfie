
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Info, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: number;
  name: string;
  sku: string;
  inStock: number;
  category: string;
  lastUpdated: string;
  status: string;
  image: string;
  price?: number;
  description?: string;
  reorderPoint?: number;
}

interface ProductListViewProps {
  products: Product[];
  getStatusColor: (status: string) => string;
}

export const ProductListView = ({ products, getStatusColor }: ProductListViewProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  const handleStartEdit = (product: Product) => {
    setEditedProduct({ ...product });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Here you would implement the actual save logic to your backend
    console.log("Saving edits:", editedProduct);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProduct({});
  };

  const handleEditChange = (field: keyof Product, value: any) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {/* Always visible on all screen sizes */}
            <TableHead>Image</TableHead>
            
            {/* Always visible on all screen sizes */}
            <TableHead className="w-[250px]">Item Name</TableHead>
            
            {/* Hidden on small screens, visible on sm breakpoint and up */}
            <TableHead className="hidden sm:table-cell">SKU</TableHead>
            
            {/* Hidden on small screens, visible on md breakpoint and up */}
            <TableHead className="hidden md:table-cell">Category</TableHead>
            
            {/* Always visible (per user request) */}
            <TableHead className="text-center">In Stock</TableHead>
            
            {/* Hidden on small screens, visible on lg breakpoint and up */}
            <TableHead className="hidden lg:table-cell text-center">Status</TableHead>
            
            {/* Hidden on small screens, visible on xl breakpoint and up */}
            <TableHead className="hidden xl:table-cell text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {/* Always visible */}
              <TableCell>
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              
              {/* Always visible */}
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="font-medium text-left hover:text-primary hover:underline transition-colors">
                      {product.name}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-5" align="start">
                    {!isEditing ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm flex-1">
                            <div>
                              <span className="font-medium text-muted-foreground">SKU:</span>
                              <p>{product.sku}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Category:</span>
                              <p>{product.category}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">In Stock:</span>
                              <p>{product.inStock}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Status:</span>
                              <p className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                {product.status}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Price:</span>
                              <p>${product.price?.toFixed(2) || "N/A"}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Reorder Point:</span>
                              <p>{product.reorderPoint || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        
                        {product.description && (
                          <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Description:</span>
                            <p className="mt-1">{product.description}</p>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3" />
                          <span>Last updated: {product.lastUpdated}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <Input 
                            value={editedProduct.name || ''} 
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="font-semibold text-lg"
                          />
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-600"
                              onClick={handleSaveEdit}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm flex-1">
                            <div>
                              <span className="font-medium text-muted-foreground">SKU:</span>
                              <Input 
                                value={editedProduct.sku || ''} 
                                onChange={(e) => handleEditChange('sku', e.target.value)}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Category:</span>
                              <Input 
                                value={editedProduct.category || ''} 
                                onChange={(e) => handleEditChange('category', e.target.value)}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">In Stock:</span>
                              <Input 
                                type="number"
                                value={editedProduct.inStock || 0} 
                                onChange={(e) => handleEditChange('inStock', parseInt(e.target.value))}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Status:</span>
                              <Input 
                                value={editedProduct.status || ''} 
                                onChange={(e) => handleEditChange('status', e.target.value)}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Price:</span>
                              <Input 
                                type="number"
                                value={editedProduct.price || 0} 
                                onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Reorder Point:</span>
                              <Input 
                                type="number"
                                value={editedProduct.reorderPoint || 0} 
                                onChange={(e) => handleEditChange('reorderPoint', parseInt(e.target.value))}
                                className="h-8 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <span className="font-medium text-muted-foreground">Description:</span>
                          <Textarea 
                            value={editedProduct.description || ''} 
                            onChange={(e) => handleEditChange('description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </TableCell>
              
              {/* Hidden on small screens, visible on sm breakpoint and up */}
              <TableCell className="hidden sm:table-cell font-mono text-sm">{product.sku}</TableCell>
              
              {/* Hidden on small screens, visible on md breakpoint and up */}
              <TableCell className="hidden md:table-cell">{product.category}</TableCell>
              
              {/* Always visible (per user request) */}
              <TableCell className="text-center">
                <span className="font-medium">{product.inStock}</span>
              </TableCell>
              
              {/* Hidden on small screens, visible on lg breakpoint and up */}
              <TableCell className="hidden lg:table-cell text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </TableCell>
              
              {/* Hidden on small screens, visible on xl breakpoint and up */}
              <TableCell className="hidden xl:table-cell text-right">
                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{product.lastUpdated}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};
