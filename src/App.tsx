
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useState } from "react";
import Index from "./pages/Index";
import MultiStore from "./pages/MultiStore";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Tax from "./pages/Tax";
import Reminders from "./pages/Reminders";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import DocsStorage from "./pages/DocsStorage";
import AIAdviser from "./pages/AIAdviser";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Connect from "./pages/Connect";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout = () => {
  const [mode, setMode] = useState<"product" | "service">("product");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar mode={mode} />
        <main className="flex-1">
          <Navbar />
          <div className="container py-6">
            <AnimatedBackground />
            <Routes>
              <Route path="/" element={<Index mode={mode} setMode={setMode} />} />
              <Route path="/multi-store" element={<MultiStore />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/tax" element={<Tax />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/docs-storage" element={<DocsStorage />} />
              <Route path="/ai-adviser" element={<AIAdviser />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <SkeletonLoader>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={<Layout />} />
              </Routes>
              <Toaster />
              <Sonner />
            </SkeletonLoader>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
