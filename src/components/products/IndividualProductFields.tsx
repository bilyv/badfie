import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";

interface IndividualProductFieldsProps {
  form: UseFormReturn<any>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
}

export const IndividualProductFields = ({
  form,
  onImageUpload,
  imagePreview,
}: IndividualProductFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Product Name</FormLabel>
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
              <FormLabel className="text-sm font-medium">Category</FormLabel>
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
            <FormLabel className="text-sm font-medium">Description</FormLabel>
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
        <Label className="text-sm font-medium">Product Image</Label>
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

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Initial Stock</FormLabel>
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
              <FormLabel className="text-sm font-medium">Cost Price</FormLabel>
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
              <FormLabel className="text-sm font-medium">Selling Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Enter selling price" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};