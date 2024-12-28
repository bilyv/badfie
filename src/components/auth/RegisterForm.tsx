import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SocialLogin } from "./SocialLogin";
import { checkEmailExists, checkUsernameExists } from "./validation";
import { RegisterFormFields } from "./RegisterFormFields";
import { registerSchema, type RegisterFormData } from "./validation/registerSchema";

type RegisterFormProps = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onGoogleLogin: () => void;
};

export const RegisterForm = ({
  isLoading,
  setIsLoading,
  onGoogleLogin,
}: RegisterFormProps) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (values: RegisterFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // First check if username exists
      const usernameExists = await checkUsernameExists(values.username);
      if (usernameExists) {
        toast({
          title: "Error",
          description: "Username already exists",
          variant: "destructive",
        });
        return;
      }

      // Then check if email exists
      const emailExists = await checkEmailExists(values.email);
      if (emailExists) {
        toast({
          title: "Error",
          description: "Email already exists",
          variant: "destructive",
        });
        return;
      }

      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            business_name: values.businessName,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        
        if (authError.message?.includes("rate_limit") || authError.status === 429) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Get the current session after signup
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // Wait for session to be established (max 3 attempts)
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: retrySession } = await supabase.auth.getSession();
          if (retrySession.session) {
            break;
          }
        }
      }

      // Create profile using the established session
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          username: values.username,
          email: values.email,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Failed to create profile");
      }

      // Create business
      const { error: businessError } = await supabase
        .from("businesses")
        .insert({
          name: values.businessName,
          owner_id: authData.user.id,
        });

      if (businessError) {
        console.error("Business creation error:", businessError);
        throw new Error("Failed to create business");
      }

      toast({
        title: "Success",
        description: "Registration successful! Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
          <RegisterFormFields form={form} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <SocialLogin onGoogleLogin={onGoogleLogin} isLoading={isLoading} />
    </div>
  );
};