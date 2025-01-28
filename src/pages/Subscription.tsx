import { Card } from "@/components/ui/card";
import { Check, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      "All Pro features",
      "Unlimited stores",
      "Advanced analytics",
      "24/7 support",
      "API access",
      "Custom integrations",
    ],
  },
];

export default function Subscription() {
  const handleSelectPlan = (planName: string) => {
    toast({
      title: "Plan Selected",
      description: `You have selected the ${planName} plan.`,
    });
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h1>
      <p className="text-muted-foreground text-center mb-8">
        Select the plan that best fits your business needs
      </p>
      
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className="flex flex-col gap-4 p-6 hover:border-primary transition-all duration-300 hover:scale-105"
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
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}