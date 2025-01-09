import { UseFormReturn } from "react-hook-form";
import { ProductType } from "@/lib/types";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { IndividualProductFields } from "./IndividualProductFields";
import { CombinedProductFields } from "./CombinedProductFields";

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
    <div className="space-y-8">
      <div>
        <Label className="text-base font-medium">Product Type</Label>
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

      {productType === "individual" ? (
        <IndividualProductFields
          form={form}
          onImageUpload={onImageUpload!}
          imagePreview={imagePreview!}
        />
      ) : (
        <CombinedProductFields
          form={form}
          ingredients={ingredients}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
          updateIngredient={updateIngredient}
        />
      )}

      <Button type="submit" className="w-full sm:w-auto">
        Add Product
      </Button>
    </div>
  );
};