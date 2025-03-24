
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import { MainLayout } from "@/components/layout/MainLayout";
import PageTransition from "@/components/layout/PageTransition";
import { ParticleBackground } from "@/components/ui/particle-background";

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
import CpmCalculator from "./pages/CpmCalculator";
import RdpScaler from "./pages/RdpScaler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-background">
          <MainLayout>
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
              <Route path="/cpm-calculator" element={<PageTransition><CpmCalculator /></PageTransition>} />
              <Route path="/rdp-scaler" element={<PageTransition><RdpScaler /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </MainLayout>
        </div>
        <ParticleBackground />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
