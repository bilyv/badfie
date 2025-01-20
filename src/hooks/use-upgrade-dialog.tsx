import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    features: [
      "Basic inventory management",
      "Single store",
      "Limited reports",
      "Email support",
    ],
  },
  {
    name: "Starter",
    price: "$80/month",
    features: [
      "Advanced inventory tracking",
      "Up to 2 stores",
      "Basic analytics",
      "Priority support",
      "Basic integrations",
    ],
  },
  {
    name: "Basic",
    price: "$150/month",
    features: [
      "All Starter features",
      "Up to 5 stores",
      "Advanced analytics",
      "24/7 support",
      "API access",
      "Custom branding",
    ],
  },
  {
    name: "Pro",
    price: "$300/month",
    features: [
      "All Basic features",
      "Unlimited stores",
      "Custom analytics",
      "Dedicated support",
      "Custom integrations",
      "White labeling",
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
      description: `Successfully subscribed to ${planName}.`,
    });
    closeUpgradeDialog();
  };

  const UpgradeDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 justify-center">
            <DollarSign className="h-6 w-6 text-primary" />
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 md:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-4 rounded-lg border p-6 hover:border-primary transition-all duration-300 hover:scale-105 bg-card/50"
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
                variant={plan.name === "Pro" ? "default" : "outline"}
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