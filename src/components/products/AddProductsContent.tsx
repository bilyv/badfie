
import { Package, PackagePlus, Settings, Plus, FolderPlus } from "lucide-react";
import { AddProductCard } from "./AddProductCard";
import { ProductType } from "@/lib/types";

interface AddProductsContentProps {
  onAddProduct: (type: ProductType) => void;
  onOpenAdjustment: () => void;
  onOpenRequest: () => void;
  onOpenCategory: () => void;
}

export const AddProductsContent = ({ 
  onAddProduct, 
  onOpenAdjustment, 
  onOpenRequest, 
  onOpenCategory 
}: AddProductsContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      <AddProductCard
        icon={Package}
        title="Individual Product"
        description="Add a single product with its own specifications"
        buttonText="Add Individual Product"
        onClick={() => onAddProduct("individual")}
      />

      <AddProductCard
        icon={PackagePlus}
        title="Combined Product"
        description="Create a product made up of multiple ingredients"
        buttonText="Add Combined Product"
        onClick={() => onAddProduct("combined")}
      />

      <AddProductCard
        icon={Settings}
        title="Stock Adjustment"
        description="Adjust stock levels when mistakenly configured"
        buttonText="Adjust Stock"
        onClick={onOpenAdjustment}
      />

      <AddProductCard
        icon={Plus}
        title="Request Stock"
        description="Request additional stock for existing products"
        buttonText="Request Stock"
        onClick={onOpenRequest}
      />

      <AddProductCard
        icon={FolderPlus}
        title="Create Category"
        description="Create new categories for products"
        buttonText="Add Category"
        onClick={onOpenCategory}
      />
    </div>
  );
};
