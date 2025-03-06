import { Check } from "lucide-react";
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
      "All Business features",
      "Unlimited stores",
      "Advanced analytics",
      "24/7 support",
      "API access",
      "Custom integrations",
    ],
  },
];

export default function Subscription() {
  const handleSubscribe = (planName: string) => {
    toast({
      title: "Subscription Started",
      description: `You've selected the ${planName} plan. Our team will contact you shortly.`,
    });
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the plan that best fits your business needs
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="relative flex flex-col p-6 bg-card/50 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>
              {plan.name !== "Free Trial" && <span className="text-sm text-muted-foreground">/month</span>}
            </div>
            
            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handleSubscribe(plan.name)}
              variant={plan.name === "Enterprise" ? "default" : "outline"}
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}