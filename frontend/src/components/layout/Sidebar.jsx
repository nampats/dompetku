import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/transaksi', icon: 'receipt_long', label: 'Transaksi' },
  { to: '/mutasi', icon: 'history', label: 'Mutasi' },
  { to: '/portofolio', icon: 'account_balance_wallet', label: 'Portofolio' },
  { to: '/target-dana', icon: 'track_changes', label: 'Target Dana' },
  { to: '/utang-piutang', icon: 'payments', label: 'Utang/Piutang' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/landing');
  };

  return (
    <>
    <nav className={`hidden md:flex h-screen fixed left-0 top-0 bg-surface/80 dark:bg-surface/80 backdrop-blur-[20px] border-r border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex-col p-stack-md z-50 transition-all duration-300 ${isCollapsed ? 'w-20 items-center' : 'w-72'}`}>
      <div className={`mb-stack-lg w-full flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <NavLink to="/dashboard" className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              DompetKu
            </NavLink>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined">
              {isCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>
        <NavLink to="/profil" className={`flex items-center gap-3 mt-6 p-3 glass-card rounded-xl hover:ring-1 hover:ring-primary/30 transition-all ${isCollapsed ? 'justify-center p-2' : ''}`}>
          {user?.image ? (
            <img 
              alt={`Foto Profil ${user.name}`}
              className="w-10 h-10 rounded-full object-cover" 
              src={user.image} 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="font-body-md text-on-surface font-semibold truncate">{user?.name || 'User'}</p>
            </div>
          )}
        </NavLink>
      </div>
      <ul className={`flex flex-col gap-2 flex-grow w-full ${isCollapsed ? 'items-center' : ''}`}>
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `transition-colors duration-300 rounded-xl flex items-center ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3'} ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                }`
              }
              title={isCollapsed ? label : undefined}
            >
              <span className={`material-symbols-outlined ${isCollapsed ? '' : 'mr-3'}`}>{icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={`mt-auto pt-4 border-t border-white/10 w-full ${isCollapsed ? 'flex flex-col items-center' : ''}`}>

        <ul className={`flex flex-col gap-2 w-full ${isCollapsed ? 'items-center' : ''}`}>
          <li>
            <NavLink 
              to="/pengaturan" 
              className={({ isActive }) =>
                `transition-colors duration-300 rounded-xl flex items-center ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3'} ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                }`
              }
              title={isCollapsed ? "Pengaturan" : undefined}
            >
              <span className={`material-symbols-outlined ${isCollapsed ? '' : 'mr-3'} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              {!isCollapsed && "Pengaturan"}
            </NavLink>
          </li>
          <li>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className={`w-full text-on-surface-variant flex items-center transition-colors hover:bg-error/10 hover:text-error rounded-xl ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-2'}`}
              title={isCollapsed ? "Keluar" : undefined}
            >
              <span className={`material-symbols-outlined ${isCollapsed ? '' : 'mr-3'} text-sm`}>logout</span>
              {!isCollapsed && "Keluar"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    
    <Modal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      title="Konfirmasi Keluar"
      variant="confirm"
      onConfirm={handleLogout}
      confirmText="Ya, Keluar"
    >
      Apakah Anda yakin ingin keluar dari aplikasi DompetKu? Sesi Anda akan diakhiri.
    </Modal>
    </>
  );
};

export default Sidebar;
