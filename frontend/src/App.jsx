import React from 'react';
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
        {/* Public routes — no auth required */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
