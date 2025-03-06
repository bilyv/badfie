
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface TemplateProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export const ProductTemplates = ({ products }: { products: any[] }) => {
  const [selectedProducts, setSelectedProducts] = useState<TemplateProduct[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const addProductToTemplate = (product: any) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      toast.error("Product already added to template");
      return;
    }
    
    setSelectedProducts([...selectedProducts, {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price || 0
    }]);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity } : p
    ));
  };

  const calculateTotalCost = () => {
    return selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to the template");
      return;
    }
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      toast.error("Please enter a valid selling price");
      return;
    }

    const template = {
      name: templateName,
      description: templateDescription,
      sellingPrice: parseFloat(sellingPrice),
      products: selectedProducts,
    };

    console.log("Saving template:", template);
    toast.success("Template saved successfully");

    // Reset form
    setTemplateName("");
    setTemplateDescription("");
    setSellingPrice("");
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Input
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selling-price">Selling Price ($)</Label>
            <Input
              id="selling-price"
              type="number"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Available Products</h3>
          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {products.map((product) => (
              <Button
                key={product.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addProductToTemplate(product)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {product.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Selected Products</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {selectedProducts.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total Cost:
                  </TableCell>
                  <TableCell className="font-medium">
                    ${calculateTotalCost().toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {selectedProducts.length > 0 && (
          <Button onClick={handleSaveTemplate} className="w-full">
            <Package className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        )}
      </div>
    </div>
  );
};
