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
import { useState } from "react";

const signUpSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormProps = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onGoogleLogin: () => void;
};

export const RegisterForm = ({ isLoading, setIsLoading, onGoogleLogin }: RegisterFormProps) => {
  const [signUpCooldown, setSignUpCooldown] = useState(0);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      businessName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    if (signUpCooldown > 0) {
      toast({
        title: "Please wait",
        description: `Please wait ${signUpCooldown} seconds before trying again`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if email exists
      const { data: emailExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();

      if (emailExists) {
        toast({
          title: "Error",
          description: "Email is already registered",
          variant: "destructive",
        });
        return;
      }

      // Check if username exists
      const { data: usernameExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', values.username)
        .single();

      if (usernameExists) {
        toast({
          title: "Error",
          description: "Username is already taken",
          variant: "destructive",
        });
        return;
      }

      // First, sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (signUpError) {
        if (signUpError.message.includes("rate limit")) {
          setSignUpCooldown(60);
          toast({
            title: "Too Many Requests",
            description: "Please wait a minute before trying again",
            variant: "destructive",
          });
        } else {
          throw signUpError;
        }
        return;
      }

      if (!authData.session) {
        toast({
          title: "Verification Needed",
          description: "Please check your email to verify your account",
        });
        setSignUpCooldown(60);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            username: values.username,
          }
        ]);

      if (profileError) {
        console.error("Profile Creation Error:", profileError);
        throw profileError;
      }

      // Create business
      const { error: businessError } = await supabase
        .from("businesses")
        .insert([
          {
            name: values.businessName,
            owner_id: authData.user.id,
          },
        ]);

      if (businessError) {
        console.error("Business Creation Error:", businessError);
        throw businessError;
      }

      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email for verification.",
      });
    } catch (error: any) {
      console.error("Full Sign Up Error:", error);
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
        <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
                  <Input type="password" placeholder="Choose a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || signUpCooldown > 0}
          >
            {signUpCooldown > 0 
              ? `Wait ${signUpCooldown}s` 
              : (isLoading ? "Loading..." : "Create Account")
            }
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={onGoogleLogin}
      >
        Sign up with Google
      </Button>
    </div>
  );
};