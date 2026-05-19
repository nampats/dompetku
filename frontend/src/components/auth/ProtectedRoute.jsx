import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        {/* Premium loading spinner */}
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
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
