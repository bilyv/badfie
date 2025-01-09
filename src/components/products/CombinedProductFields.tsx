import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { useEffect } from "react";

interface CombinedProductFieldsProps {
  form: UseFormReturn<any>;
  ingredients: Array<{ id: string; name: string; quantity: number; unit: string; costPrice: number }>;
  addIngredient: () => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, field: string, value: string | number) => void;
}

export const CombinedProductFields = ({
  form,
  ingredients,
  addIngredient,
  removeIngredient,
  updateIngredient,
}: CombinedProductFieldsProps) => {
  // Calculate total cost price
  const totalCostPrice = ingredients.reduce((sum, ing) => sum + (ing.costPrice * ing.quantity), 0);
  
  // Update selling price field when total cost changes
  useEffect(() => {
    const suggestedPrice = totalCostPrice * 1.3; // 30% markup
    form.setValue("sellingPrice", suggestedPrice.toFixed(2));
  }, [totalCostPrice, form]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Ingredients</Label>
        <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      
      {ingredients.map((ingredient) => (
        <div key={ingredient.id} className="grid grid-cols-12 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="col-span-12 md:col-span-3">
            <Label className="text-sm font-medium mb-2 block">Ingredient Name</Label>
            <Input
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <Label className="text-sm font-medium mb-2 block">Quantity</Label>
            <Input
              type="number"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <Label className="text-sm font-medium mb-2 block">Unit</Label>
            <Input
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
            />
          </div>
          <div className="col-span-10 md:col-span-3">
            <Label className="text-sm font-medium mb-2 block">Cost Price</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Cost Price"
              value={ingredient.costPrice}
              onChange={(e) => updateIngredient(ingredient.id, "costPrice", e.target.value)}
            />
          </div>
          <div className="col-span-2 flex items-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeIngredient(ingredient.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-muted/50 rounded-lg">
          <Label className="text-sm font-medium">Total Cost Price</Label>
          <p className="text-2xl font-bold mt-1">${totalCostPrice.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-primary/10 rounded-lg">
          <Label className="text-sm font-medium">Suggested Selling Price (30% markup)</Label>
          <p className="text-2xl font-bold mt-1">${(totalCostPrice * 1.3).toFixed(2)}</p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="sellingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Final Selling Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="Enter selling price" 
                {...field}
                className="text-lg font-semibold" 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};