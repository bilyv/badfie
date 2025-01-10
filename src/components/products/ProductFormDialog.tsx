import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IndividualProductFields } from "./IndividualProductFields";
import { CombinedProductFields } from "./CombinedProductFields";
import { ProductType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType: ProductType;
}

export const ProductFormDialog = ({ open, onOpenChange, productType }: ProductFormDialogProps) => {
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; quantity: number; unit: string; costPrice: number }>>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      quantity: "",
      costPrice: "",
      sellingPrice: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", quantity: 0, unit: "units", costPrice: 0 },
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
      imageUrl: imagePreview,
      ...(productType === "combined" && { ingredients }),
    };

    toast({
      title: "Product Added",
      description: `${productData.name} has been added successfully.`,
    });
    
    console.log("Product Data:", productData);
    onOpenChange(false);
    form.reset();
    setImagePreview("");
    setIngredients([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add {productType === "individual" ? "Individual" : "Combined"} Product
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {productType === "individual" ? (
              <IndividualProductFields
                form={form}
                onImageUpload={handleImageUpload}
                imagePreview={imagePreview}
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};