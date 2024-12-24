import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function useUpgradeDialog() {
  const [open, setOpen] = useState(false);

  const openUpgradeDialog = () => setOpen(true);
  const closeUpgradeDialog = () => setOpen(false);

  const UpgradeDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">{plan.price}</p>
                  <ul className="mt-2 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={() => alert(`Selected ${plan.name} plan`)}>
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    openUpgradeDialog,
    closeUpgradeDialog,
    UpgradeDialog,
  };
}

const plans = [
  {
    name: "Pro",
    price: "$29/month",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    price: "$99/month",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];