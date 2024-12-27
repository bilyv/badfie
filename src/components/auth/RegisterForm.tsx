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

      // Create auth user
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

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          username: values.username,
          email: values.email,
        });

      if (profileError) throw profileError;

      // Create business
      const { error: businessError } = await supabase
        .from("businesses")
        .insert({
          name: values.businessName,
          owner_id: authData.user.id,
        });

      if (businessError) throw businessError;

      toast({
        title: "Success",
        description: "Registration successful! Please check your email to verify your account.",
      });
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