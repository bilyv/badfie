import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

type AuthView = "login" | "register" | "reset-password";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you'd handle form submission
    toast({
      title: "Success",
      description: view === "reset-password" 
        ? "Password reset instructions sent to your email" 
        : `${view === "login" ? "Logged in" : "Account created"} successfully`,
    });
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">
            {view === "login" 
              ? "Welcome back" 
              : view === "register" 
              ? "Create an account" 
              : "Reset password"}
          </h1>
          <p className="text-muted-foreground">
            {view === "login" 
              ? "Enter your credentials to access your account" 
              : view === "register" 
              ? "Choose your account type and fill in your details" 
              : "Enter your email to receive reset instructions"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "register" && (
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                defaultValue={accountType}
                onValueChange={(value) => setAccountType(value as "personal" | "business")}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="personal" />
                  <Label htmlFor="personal">Personal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {view === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
          )}

          {view !== "reset-password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </>
          )}

          {view === "reset-password" && (
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" placeholder="john@example.com" required />
            </div>
          )}

          <Button type="submit" className="w-full">
            {view === "login" 
              ? "Sign in" 
              : view === "register" 
              ? "Create account" 
              : "Send reset instructions"}
          </Button>
        </form>

        <div className="flex flex-col space-y-2 text-center text-sm">
          {view === "login" ? (
            <>
              <Button
                variant="link"
                onClick={() => setView("reset-password")}
                className="text-muted-foreground"
              >
                Forgot your password?
              </Button>
              <span>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setView("register")}
                  className="text-primary"
                >
                  Sign up
                </Button>
              </span>
            </>
          ) : view === "register" ? (
            <span>
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => setView("login")}
                className="text-primary"
              >
                Sign in
              </Button>
            </span>
          ) : (
            <Button
              variant="link"
              onClick={() => setView("login")}
              className="text-primary"
            >
              Back to login
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;