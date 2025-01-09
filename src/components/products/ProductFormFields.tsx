import { UseFormReturn } from "react-hook-form";
import { ProductType } from "@/lib/types";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus, Image as ImageIcon } from "lucide-react";

interface ProductFormFieldsProps {
  form: UseFormReturn<any>;
  productType: ProductType;
  setProductType: (type: ProductType) => void;
  ingredients: Array<{ id: string; name: string; quantity: number; unit: string; costPrice: number }>;
  addIngredient: () => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, field: string, value: string | number) => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview?: string;
}

export const ProductFormFields = ({
  form,
  productType,
  setProductType,
  ingredients,
  addIngredient,
  removeIngredient,
  updateIngredient,
  onImageUpload,
  imagePreview,
}: ProductFormFieldsProps) => {
  return (
    <div className="space-y-6">
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
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter product description" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <Label>Product Image</Label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <div className="relative w-32 h-32">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="max-w-[250px]"
          />
        </div>
      </div>

      {productType === "individual" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter quantity" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter cost price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter selling price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ) : (
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
              <div className="col-span-3">
                <Input
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost Price"
                  value={ingredient.costPrice}
                  onChange={(e) => updateIngredient(ingredient.id, "costPrice", e.target.value)}
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

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter selling price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}

      <Button type="submit" className="w-full sm:w-auto">
        Add Product
      </Button>
    </div>
  );
};