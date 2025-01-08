import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFormsContainer } from "@/components/auth/AuthFormsContainer";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const isNewUser = event === "SIGNED_IN";
        if (isNewUser) {
          setShowPricingPlans(true);
          setTimeout(() => {
            setShowPricingPlans(false);
            navigate("/");
          }, 8000);
        } else {
          navigate("/");
        }
      }
    });

    if (searchParams.get("reset") === "true") {
      setShowForgotPassword(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  if (!authChecked) {
    return <LoadingSpinner />;
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
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