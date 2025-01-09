import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ProductFormFields } from "./ProductFormFields";
import { ProductType } from "@/lib/types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const AddProductForm = () => {
  const [productType, setProductType] = useState<ProductType>("individual");
  const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; quantity: number; unit: string }>>([]);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductFormFields 
          form={form}
          productType={productType}
          setProductType={setProductType}
          ingredients={ingredients}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
          updateIngredient={updateIngredient}
        />
      </form>
    </Form>
  );
};