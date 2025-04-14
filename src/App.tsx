
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
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <Suspense fallback={<div>Loading...</div>}>
              <Index />
            </Suspense>
          } />
          <Route path="features" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Features />
            </Suspense>
          } />
          <Route path="dashboard" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="campaigns" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Campaigns />
            </Suspense>
          } />
          <Route path="platforms" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Platforms />
            </Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={<div>Loading...</div>}>
              <TrafficAnalytics />
            </Suspense>
          } />
          <Route path="budget-optimizer" element={
            <Suspense fallback={<div>Loading...</div>}>
              <BudgetOptimizer />
            </Suspense>
          } />
          <Route path="cpm-calculator" element={
            <Suspense fallback={<div>Loading...</div>}>
              <CpmCalculator />
            </Suspense>
          } />
          <Route path="automation" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Automation />
            </Suspense>
          } />
          <Route path="rdp-management" element={
            <Suspense fallback={<div>Loading...</div>}>
              <RdpManagement />
            </Suspense>
          } />
          <Route path="rdp-scaler" element={
            <Suspense fallback={<div>Loading...</div>}>
              <RdpScaler />
            </Suspense>
          } />
          <Route path="script-lab" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ScriptLab />
            </Suspense>
          } />
          <Route path="reporting" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Reporting />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Settings />
            </Suspense>
          } />
          <Route path="help-center" element={
            <Suspense fallback={<div>Loading...</div>}>
              <HelpCenter />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}

export default App;
