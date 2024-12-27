import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Show pricing plans dialog for new users
        const isNewUser = event === "SIGNED_IN";
        if (isNewUser) {
          setShowPricingPlans(true);
        }
        navigate("/");
      }
    });

    // Check if we're in password reset mode
    if (searchParams.get("reset") === "true") {
      setShowForgotPassword(true);
    }

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Package className="h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to reset your password
            </p>
          </div>

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
        <div className="flex flex-col items-center space-y-2 text-center">
          <Package className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome to Inventory</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register Business</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onGoogleLogin={handleGoogleLogin}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onGoogleLogin={handleGoogleLogin}
              />
            </TabsContent>
          </Tabs>
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