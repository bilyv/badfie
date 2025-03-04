
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
  id: number;
  name: string;
  sku: string;
  inStock: number;
  category: string;
  price?: number;
  image: string;
}

interface Template {
  id: string;
  name: string;
  products: {
    productId: number;
    quantity: number;
  }[];
  sellingPrice: number;
  description: string;
}

interface ProductTemplatesProps {
  products: Product[];
}

export const ProductTemplates = ({ products }: ProductTemplatesProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templatePrice, setTemplatePrice] = useState(0);
  const [templateDescription, setTemplateDescription] = useState("");
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Reset form when toggling editing mode
  useEffect(() => {
    if (!isEditing) {
      setSelectedProducts([]);
      setTemplateName("");
      setTemplatePrice(0);
      setTemplateDescription("");
      setQuantities({});
      setEditingTemplateId(null);
    }
  }, [isEditing]);

  // Calculate total cost based on selected products and quantities
  const calculateTotalCost = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find(p => p.id === productId);
      const quantity = quantities[productId] || 1;
      return total + ((product?.price || 0) * quantity);
    }, 0);
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        // Remove product and its quantity
        const newQuantities = { ...quantities };
        delete newQuantities[productId];
        setQuantities(newQuantities);
        return prev.filter(id => id !== productId);
      } else {
        // Add product with default quantity 1
        setQuantities(prev => ({ ...prev, [productId]: 1 }));
        return [...prev, productId];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) quantity = 1;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleSaveTemplate = () => {
    if (!templateName || selectedProducts.length === 0 || templatePrice <= 0) {
      // You could add proper validation and error messaging here
      return;
    }

    const newTemplate: Template = {
      id: editingTemplateId || `template-${Date.now()}`,
      name: templateName,
      products: selectedProducts.map(productId => ({
        productId,
        quantity: quantities[productId] || 1
      })),
      sellingPrice: templatePrice,
      description: templateDescription
    };

    if (editingTemplateId) {
      setTemplates(prev => prev.map(t => t.id === editingTemplateId ? newTemplate : t));
    } else {
      setTemplates(prev => [...prev, newTemplate]);
    }

    // Reset form
    setSelectedProducts([]);
    setTemplateName("");
    setTemplatePrice(0);
    setTemplateDescription("");
    setQuantities({});
    setIsEditing(false);
    setEditingTemplateId(null);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplatePrice(template.sellingPrice);
    setTemplateDescription(template.description);
    
    const newSelectedProducts = template.products.map(p => p.productId);
    setSelectedProducts(newSelectedProducts);
    
    const newQuantities: { [key: number]: number } = {};
    template.products.forEach(p => {
      newQuantities[p.productId] = p.quantity;
    });
    setQuantities(newQuantities);
    
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const totalCost = calculateTotalCost();
  const suggestedPrice = totalCost * 1.3; // 30% markup

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-semibold">Product Templates</h2>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant={isEditing ? "secondary" : "default"}
        >
          {isEditing ? "Cancel" : "Create New Template"}
        </Button>
      </div>

      {isEditing && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input 
                  id="template-name" 
                  value={templateName} 
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="template-price">Selling Price</Label>
                <Input 
                  id="template-price" 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={templatePrice} 
                  onChange={(e) => setTemplatePrice(Number(e.target.value))}
                  placeholder="Enter selling price"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="template-description">Description</Label>
                <Input 
                  id="template-description" 
                  value={templateDescription} 
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Select Products</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4 mt-1">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={selectedProducts.includes(product.id) ? quantities[product.id] || 1 : 1}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                            disabled={!selectedProducts.includes(product.id)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          ${selectedProducts.includes(product.id) 
                            ? ((product.price || 0) * (quantities[product.id] || 1)).toFixed(2) 
                            : (0).toFixed(2)
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Total Cost Price</Label>
                <p className="text-2xl font-bold mt-1">${totalCost.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <Label className="text-sm font-medium">Suggested Selling Price (30% markup)</Label>
                <p className="text-2xl font-bold mt-1">${suggestedPrice.toFixed(2)}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => setTemplatePrice(suggestedPrice)}
                >
                  Use suggested price
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="mr-2 h-4 w-4" />
                {editingTemplateId ? 'Update Template' : 'Save Template'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="rounded-md border">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first product template</p>
            <Button onClick={() => setIsEditing(true)}>Create Template</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Template Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden sm:table-cell">Products</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {template.description}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {template.products.length} product{template.products.length !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>${template.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive" 
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
