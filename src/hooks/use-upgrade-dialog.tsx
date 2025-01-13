import { useState } from "react";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";

export function useUpgradeDialog() {
  const [open, setOpen] = useState(false);

  const openUpgradeDialog = () => setOpen(true);
  const closeUpgradeDialog = () => setOpen(false);

  const UpgradeDialog = () => (
    <PricingPlansDialog open={open} onOpenChange={setOpen} />
  );

  return {
    openUpgradeDialog,
    closeUpgradeDialog,
    UpgradeDialog,
  };
}