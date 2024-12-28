import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import MultiStore from "./pages/MultiStore";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Tax from "./pages/Tax";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import DocsStorage from "./pages/DocsStorage";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthError = async () => {
      try {
        // Clear any existing session data
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        toast({
          title: "Session Expired",
          description: "Please sign in again",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Error handling auth error:", error);
      }
    };

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          await handleAuthError();
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify the user exists
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("User verification error:", userError);
          await handleAuthError();
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session check error:", error);
        await handleAuthError();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          const { error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error("User verification error:", userError);
            await handleAuthError();
            return;
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth state change error:", error);
          await handleAuthError();
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  const { UpgradeDialog } = useUpgradeDialog();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <SidebarProvider>
                      <div className="flex min-h-screen w-full">
                        <AppSidebar />
                        <main className="flex-1">
                          <Navbar />
                          <div className="container py-6">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/multi-store" element={<MultiStore />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/sales" element={<Sales />} />
                              <Route path="/expenses" element={<Expenses />} />
                              <Route path="/tax" element={<Tax />} />
                              <Route path="/reports" element={<Reports />} />
                              <Route path="/users" element={<Users />} />
                              <Route path="/docs-storage" element={<DocsStorage />} />
                              <Route path="/settings" element={<Settings />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                      <UpgradeDialog />
                    </SidebarProvider>
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;