import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    features: [
      "Basic inventory management",
      "Single store",
      "Limited reports",
      "Email support",
    ],
  },
  {
    name: "Business",
    price: "$150",
    features: [
      "Advanced inventory tracking",
      "Up to 3 stores",
      "Detailed analytics",
      "Priority support",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    price: "$300",
    features: [
      "Enterprise-grade features",
      "Unlimited stores",
      "Advanced analytics",
      "24/7 support",
      "API access",
      "Custom integrations",
    ],
  },
];

interface PricingPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingPlansDialog({ open, onOpenChange }: PricingPlansDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: "Plan Selected",
      description: `You have selected the ${planName} plan.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center">
            Select the plan that best fits your business needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-4 rounded-lg border p-6 hover:border-primary transition-colors"
            >
              <div>
                <h4 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {plan.name}
                </h4>
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
                onClick={() => handleSelectPlan(plan.name)}
                className="w-full mt-4"
                variant={plan.name === "Enterprise" ? "default" : "outline"}
              >
                Select {plan.name} Plan
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}