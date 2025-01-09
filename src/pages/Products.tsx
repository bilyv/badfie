import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ProductType } from "@/lib/types";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Products = () => {
  const [activeTab, setActiveTab] = useState("livestock");
  const [productType, setProductType] = useState<ProductType>("individual");
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; quantity: number; unit: string }>>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      quantity: "",
    },
  });

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", quantity: 0, unit: "units" },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const updateIngredient = (id: string, field: string, value: string | number) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const onSubmit = (data: any) => {
    const productData = {
      ...data,
      type: productType,
      ...(productType === "combined" && { ingredients }),
    };

    toast({
      title: "Product Added",
      description: `${productData.name} has been added successfully.`,
    });
    
    console.log("Product Data:", productData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="livestock" className="text-sm py-1.5">Products List</TabsTrigger>
            <TabsTrigger value="add-product" className="text-sm py-1.5">Add Product</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="livestock">
          <Card className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product A</TableCell>
                    <TableCell className="hidden md:table-cell">Electronics</TableCell>
                    <TableCell>Individual</TableCell>
                    <TableCell>$299.99</TableCell>
                    <TableCell className="hidden md:table-cell">In Stock</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add-product">
          <Card className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Product Type</Label>
                  <RadioGroup
                    defaultValue="individual"
                    className="grid grid-cols-2 gap-4 mt-2"
                    onValueChange={(value: ProductType) => setProductType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="combined" id="combined" />
                      <Label htmlFor="combined">Combined Product</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Select category" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter price" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {productType === "individual" && (
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Stock</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter initial stock" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {productType === "combined" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base">Ingredients</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ingredient
                      </Button>
                    </div>
                    
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                          <Input
                            placeholder="Ingredient name"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder="Unit (e.g., grams)"
                            value={ingredient.unit}
                            onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(ingredient.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Add Product
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;