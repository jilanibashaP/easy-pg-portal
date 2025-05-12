
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Resources from "./pages/Resources";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import BottomNav from "./components/navigation/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="container max-w-3xl mx-auto px-4 pt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
