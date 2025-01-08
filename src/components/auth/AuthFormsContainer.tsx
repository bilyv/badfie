import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthFormsContainerProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
}

export const AuthFormsContainer = ({
  isLoading,
  setIsLoading,
  onGoogleLogin,
  onForgotPassword,
}: AuthFormsContainerProps) => {
  return (
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
            onGoogleLogin={onGoogleLogin}
            onForgotPassword={onForgotPassword}
          />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onGoogleLogin={onGoogleLogin}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};