import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProductForm } from "./AddProductForm";
import { ProductType } from "@/lib/types";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType: ProductType;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  productType,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Add {productType === "individual" ? "Individual" : "Combined"} Product
          </DialogTitle>
        </DialogHeader>
        <AddProductForm />
      </DialogContent>
    </Dialog>
  );
}