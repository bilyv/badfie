import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { PricingPlansDialog } from "@/components/PricingPlansDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, User, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [workerPassword, setWorkerPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate("/");
    }
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userEmail', data.data.user.email);

        toast({
          description: "Admin login successful",
        });

        navigate("/");
      } else {
        toast({
          description: data.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkerLogin = async () => {
    if (!workerEmail || !workerPassword) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/worker/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: workerEmail,
          password: workerPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userType', 'worker');
        localStorage.setItem('userEmail', data.data.user.email);

        toast({
          description: "Worker login successful",
        });

        navigate("/");
      } else {
        toast({
          description: data.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Package className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome to DigitalStock</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="worker" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Worker
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleAdminLogin}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </TabsContent>

            <TabsContent value="worker" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="worker-email">Email</Label>
                <Input
                  id="worker-email"
                  type="email"
                  placeholder="worker@example.com"
                  value={workerEmail}
                  onChange={(e) => setWorkerEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worker-password">Password</Label>
                <Input
                  id="worker-password"
                  type="password"
                  placeholder="Enter your password"
                  value={workerPassword}
                  onChange={(e) => setWorkerPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleWorkerLogin}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Worker"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPricingPlans(true)}
              className="w-full"
            >
              View Pricing Plans
            </Button>
          </div>
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