import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
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
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout = () => {
  const { UpgradeDialog } = useUpgradeDialog();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <Navbar />
          <div className="container py-6">
            <Routes>
              <Route path="" element={<Index />} />
              <Route path="multi-store" element={<MultiStore />} />
              <Route path="products" element={<Products />} />
              <Route path="services" element={<Services />} />
              <Route path="sales" element={<Sales />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="tax" element={<Tax />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
              <Route path="docs-storage" element={<DocsStorage />} />
              <Route path="ai-adviser" element={<AIAdviser />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </div>
        </main>
      </div>
      <UpgradeDialog />
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={<Layout />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;