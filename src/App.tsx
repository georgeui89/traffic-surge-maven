
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import PageTransition from "@/components/layout/PageTransition";

// Pages
import Dashboard from "./pages/Dashboard";
import Platforms from "./pages/Platforms";
import RdpManagement from "./pages/RdpManagement";
import Campaigns from "./pages/Campaigns";
import Automation from "./pages/Automation";
import Reporting from "./pages/Reporting";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TrafficAnalytics from "./pages/TrafficAnalytics";
import BudgetOptimizer from "./pages/BudgetOptimizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/platforms" element={<PageTransition><Platforms /></PageTransition>} />
                <Route path="/rdp-management" element={<PageTransition><RdpManagement /></PageTransition>} />
                <Route path="/campaigns" element={<PageTransition><Campaigns /></PageTransition>} />
                <Route path="/automation" element={<PageTransition><Automation /></PageTransition>} />
                <Route path="/reporting" element={<PageTransition><Reporting /></PageTransition>} />
                <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
                <Route path="/traffic-analytics" element={<PageTransition><TrafficAnalytics /></PageTransition>} />
                <Route path="/budget-optimizer" element={<PageTransition><BudgetOptimizer /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
