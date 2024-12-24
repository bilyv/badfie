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

export function useUpgradeDialog() {
  const [open, setOpen] = useState(false);

  const openUpgradeDialog = () => setOpen(true);
  const closeUpgradeDialog = () => setOpen(false);

  const handleUpgrade = (planName: string) => {
    // Here you would implement the actual upgrade logic
    console.log(`Selected ${planName} plan`);
    closeUpgradeDialog();
  };

  const UpgradeDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-4 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">{plan.price}</p>
                </div>
                <Button onClick={() => handleUpgrade(plan.name)}>
                  Select Plan
                </Button>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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