
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { ProductType } from "@/lib/types";

interface ProductDialogsProps {
  dialogOpen: boolean;
  adjustmentDialogOpen: boolean;
  requestDialogOpen: boolean;
  categoryDialogOpen: boolean;
  selectedProductType: ProductType;
  setDialogOpen: (open: boolean) => void;
  setAdjustmentDialogOpen: (open: boolean) => void;
  setRequestDialogOpen: (open: boolean) => void;
  setCategoryDialogOpen: (open: boolean) => void;
}

export const ProductDialogs = ({
  dialogOpen,
  adjustmentDialogOpen,
  requestDialogOpen,
  categoryDialogOpen,
  selectedProductType,
  setDialogOpen,
  setAdjustmentDialogOpen,
  setRequestDialogOpen,
  setCategoryDialogOpen,
}: ProductDialogsProps) => {
  return (
    <>
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productType={selectedProductType}
      />

      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment-product">Product Name</Label>
              <Input id="adjustment-product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input type="number" id="current-stock" disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-stock">New Stock Level</Label>
              <Input type="number" id="new-stock" min="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjustment-reason">Reason for Adjustment</Label>
              <Input id="adjustment-reason" placeholder="Enter reason" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Additional Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="request-product">Product Name</Label>
              <Input id="request-product" placeholder="Select product" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-quantity">Quantity Needed</Label>
              <Input type="number" id="request-quantity" min="1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-priority">Priority Level</Label>
              <Input id="request-priority" placeholder="High/Medium/Low" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-notes">Additional Notes</Label>
              <Input id="request-notes" placeholder="Enter any additional details" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input id="category-name" placeholder="Enter category name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">Description</Label>
              <Input id="category-description" placeholder="Enter category description" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
