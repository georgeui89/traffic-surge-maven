
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HelmetProvider } from 'react-helmet-async';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Platforms = lazy(() => import('./pages/Platforms'));
const TrafficAnalytics = lazy(() => import('./pages/TrafficAnalytics'));
const BudgetOptimizer = lazy(() => import('./pages/BudgetOptimizer'));
const CpmCalculator = lazy(() => import('./pages/CpmCalculator'));
const Automation = lazy(() => import('./pages/Automation'));
const RdpManagement = lazy(() => import('./pages/RdpManagement'));
const RdpScaler = lazy(() => import('./pages/RdpScaler'));
const ScriptLab = lazy(() => import('./pages/ScriptLab'));
const Reporting = lazy(() => import('./pages/Reporting'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Index = lazy(() => import('./pages/Index'));
const Features = lazy(() => import('./pages/Features'));

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route index element={<Index />} />
                <Route path="features" element={<Features />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="platforms" element={<Platforms />} />
                <Route path="analytics" element={<TrafficAnalytics />} />
                <Route path="budget-optimizer" element={<BudgetOptimizer />} />
                <Route path="cpm-calculator" element={<CpmCalculator />} />
                <Route path="automation" element={<Automation />} />
                <Route path="rdp-management" element={<RdpManagement />} />
                <Route path="rdp-scaler" element={<RdpScaler />} />
                <Route path="script-lab" element={<ScriptLab />} />
                <Route path="reporting" element={<Reporting />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help-center" element={<HelpCenter />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        } />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
