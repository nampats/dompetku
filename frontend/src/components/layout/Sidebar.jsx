import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/transaksi', icon: 'receipt_long', label: 'Transaksi' },
  { to: '/mutasi', icon: 'history', label: 'Mutasi' },
  { to: '/portofolio', icon: 'account_balance_wallet', label: 'Portofolio' },
  { to: '/target-dana', icon: 'track_changes', label: 'Target Dana' },
  { to: '/utang-piutang', icon: 'payments', label: 'Utang/Piutang' },
];

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <nav className="hidden md:flex h-screen w-72 fixed left-0 top-0 bg-surface/80 dark:bg-surface/80 backdrop-blur-[20px] border-r border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex-col p-stack-md z-50">
      <div className="mb-stack-lg">
        <h1 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          DompetKu
        </h1>
        <NavLink to="/profil" className="flex items-center gap-3 mt-6 p-3 glass-card rounded-xl hover:ring-1 hover:ring-primary/30 transition-all">
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
          <div>
            <p className="font-body-md text-on-surface font-semibold">{user?.name || 'User'}</p>
          </div>
        </NavLink>
      </div>
      <ul className="flex flex-col gap-2 flex-grow">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'bg-primary/10 text-primary rounded-xl flex items-center px-4 py-3 font-bold'
                  : 'text-on-surface-variant flex items-center px-4 py-3 transition-colors hover:bg-white/5 hover:text-primary duration-300 rounded-xl'
              }
            >
              <span className="material-symbols-outlined mr-3">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4 border-t border-white/10">

        <ul className="flex flex-col gap-2">
          <li>
            <NavLink 
              to="/pengaturan" 
              className={({ isActive }) =>
                isActive
                  ? 'bg-primary/10 text-primary rounded-xl flex items-center px-4 py-3 font-bold'
                  : 'text-on-surface-variant flex items-center px-4 py-3 transition-colors hover:bg-white/5 hover:text-primary duration-300 rounded-xl'
              }
            >
              <span className="material-symbols-outlined mr-3 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              Pengaturan
            </NavLink>
          </li>
          <li>
            <NavLink to="/landing" className="text-on-surface-variant flex items-center px-4 py-2 transition-colors hover:bg-white/5 hover:text-error">
              <span className="material-symbols-outlined mr-3 text-sm">logout</span>
              Keluar
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
