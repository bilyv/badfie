import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFormsContainer } from "@/components/auth/AuthFormsContainer";
import { Card } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Simulate Google login
      localStorage.setItem('isLoggedIn', 'true');
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <AuthHeader 
            title="Reset Password"
            description="Enter your email to reset your password"
          />

          <Card className="p-6">
            <ForgotPasswordForm />
          </Card>

          <Button
            variant="link"
            className="w-full"
            onClick={() => setShowForgotPassword(false)}
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader 
          title="Welcome to Inventory"
          description="Sign in to your account to continue"
        />

        <AuthFormsContainer 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onGoogleLogin={handleGoogleLogin}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      </div>

      <PricingPlansDialog 
        open={showPricingPlans} 
        onOpenChange={setShowPricingPlans}
      />
    </div>
  );
};

export default Auth;