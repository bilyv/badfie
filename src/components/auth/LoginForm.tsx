import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SocialLogin } from "./SocialLogin";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormProps = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
};

export const LoginForm = ({
  isLoading,
  setIsLoading,
  onGoogleLogin,
  onForgotPassword,
}: LoginFormProps) => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        // Handle specific error cases
        if (signInError.message === "Email not confirmed") {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: values.email,
          });

          if (resendError) {
            toast({
              title: "Error",
              description: "Failed to resend verification email. Please try again later.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Email Not Verified",
              description: "We've sent you a new verification email. Please check your inbox.",
              variant: "default",
            });
          }
        } else if (signInError.message === "Invalid login credentials") {
          toast({
            title: "Login Failed",
            description: "Incorrect email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: signInError.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        description: "Successfully logged in",
      });
    } catch (error: any) {
      console.error("Login error:", error);
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
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              variant="link"
              type="button"
              className="px-0"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <SocialLogin onGoogleLogin={onGoogleLogin} isLoading={isLoading} />
    </div>
  );
};