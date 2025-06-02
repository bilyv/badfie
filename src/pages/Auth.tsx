import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate auth check with local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate("/");
    }
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', 'user@example.com');

      toast({
        description: "Successfully logged in",
      });

      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Package className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome to DigitalStock</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPricingPlans(true)}
              className="w-full"
            >
              View Pricing Plans
            </Button>
          </div>
        </Card>
      </div>

      <PricingPlansDialog
        open={showPricingPlans}
        onOpenChange={setShowPricingPlans}
      />
    </div>
  );
};

export default Auth;