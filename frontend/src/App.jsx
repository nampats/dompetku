import React from 'react';
import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Portofolio from './pages/Portofolio';
import Transaksi from './pages/Transaksi';
import MutasiKas from './pages/MutasiKas';
import TargetDana from './pages/TargetDana';
import UtangPiutang from './pages/UtangPiutang';
import Profil from './pages/Profil';
import Pengaturan from './pages/Pengaturan';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — redirect to dashboard if already authenticated */}
        <Route path="/landing" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected routes — auth required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Routes wrapped in MainLayout (Sidebar + TopBar) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portofolio" element={<Portofolio />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/mutasi" element={<MutasiKas />} />
            <Route path="/target-dana" element={<TargetDana />} />
            <Route path="/utang-piutang" element={<UtangPiutang />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
          </Route>
        </Route>

        {/* Default redirect based on auth status is handled at the root / path */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="bg-background min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 backdrop-blur-[10px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
          </div>
        </div>
      </div>
      <p className="font-label-md text-label-md text-on-surface-variant animate-pulse">
        Memuat sesi Anda...
      </p>
    </div>
  </div>
);

// Helper component for public routes
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

// Helper component for root redirect
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />;
};

export default App;
