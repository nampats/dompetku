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

// Helper component for public routes
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null; // or a loading spinner
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

// Helper component for root redirect
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />;
};
};

export default App;
