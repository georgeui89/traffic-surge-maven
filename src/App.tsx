
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

// Pages
import Dashboard from "./pages/Dashboard";
import Platforms from "./pages/Platforms";
import RdpManagement from "./pages/RdpManagement";
import Campaigns from "./pages/Campaigns";
import Automation from "./pages/Automation";
import Reporting from "./pages/Reporting";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
                <Route path="/" element={<Dashboard />} />
                <Route path="/platforms" element={<Platforms />} />
                <Route path="/rdp-management" element={<RdpManagement />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/automation" element={<Automation />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
