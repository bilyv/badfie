import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { SocialLogin } from "./SocialLogin";
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
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for development
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', values.email);
      localStorage.setItem('username', values.username);
      localStorage.setItem('businessName', values.businessName);

      toast({
        title: "Success",
        description: "Registration successful! You can now log in.",
      });
      
      // Redirect to login page
      window.location.href = '/auth?mode=login';
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
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