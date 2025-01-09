import { UseFormReturn } from "react-hook-form";
import { ProductType } from "@/lib/types";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus } from "lucide-react";

interface ProductFormFieldsProps {
  form: UseFormReturn<any>;
  productType: ProductType;
  setProductType: (type: ProductType) => void;
  ingredients: Array<{ id: string; name: string; quantity: number; unit: string }>;
  addIngredient: () => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, field: string, value: string | number) => void;
}

export const ProductFormFields = ({
  form,
  productType,
  setProductType,
  ingredients,
  addIngredient,
  removeIngredient,
  updateIngredient,
}: ProductFormFieldsProps) => {
  return (
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

      <Button type="submit" className="w-full sm:w-auto">
        Add Product
      </Button>
    </div>
  );
};