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
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Pro",
    price: "$29/month",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Multiple users",
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
      "Advanced security",
      "Custom reporting",
    ],
  },
];

export function useUpgradeDialog() {
  const [open, setOpen] = useState(false);

  const openUpgradeDialog = () => setOpen(true);
  const closeUpgradeDialog = () => setOpen(false);

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Subscription Updated",
      description: `Successfully subscribed to ${planName} plan.`,
    });
    closeUpgradeDialog();
  };

  const UpgradeDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your business needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-4 rounded-lg border p-6 hover:border-primary transition-colors"
            >
              <div>
                <h4 className="text-xl font-semibold">{plan.name}</h4>
                <p className="text-2xl font-bold mt-2">{plan.price}</p>
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleUpgrade(plan.name)}
                className="w-full mt-4"
                variant={plan.name === "Enterprise" ? "default" : "outline"}
              >
                Get Started
              </Button>
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