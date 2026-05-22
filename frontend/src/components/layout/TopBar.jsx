import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ isCollapsed }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Handle outside click for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      // In this specific setup with hardcoded colors in index.css for body, 
      // full light mode requires more extensive CSS variables. 
      // We will toggle a class so it can be expanded later.
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className={`w-full fixed top-0 right-0 z-40 bg-surface/40 backdrop-blur-[20px] border-b border-white/10 flex justify-between items-center px-container-padding-desktop py-stack-md transition-all duration-300 md:w-[calc(100%-${isCollapsed ? '80px' : '288px'})] md:ml-[${isCollapsed ? '80px' : '288px'}]`}>
      <div className="hidden md:flex gap-4">
        {/* Waktu filter dipindahkan ke DashboardPage.jsx */}
      </div>
      <div className="md:hidden">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">DompetKu</h1>
      </div>
      <div className="flex items-center gap-4 ml-auto relative">
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative p-1 rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined">notifications</span>
            {/* Notification Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                <h4 className="font-headline-md text-on-surface">Notifikasi</h4>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">1 Baru</span>
              </div>
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications_paused</span>
                </div>
                <p className="font-body-md text-on-surface-variant">Belum ada notifikasi transaksi baru hari ini.</p>
              </div>
              <div className="p-3 border-t border-outline-variant/10 text-center bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer">
                <span className="text-primary font-label-sm text-label-sm">Tandai semua dibaca</span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={toggleTheme} 
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/5"
          title="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        {user?.image ? (
          <img 
            alt={`Profil ${user.name}`} 
            className="w-8 h-8 rounded-full object-cover md:hidden" 
            src={user.image} 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-container md:hidden flex items-center justify-center text-primary font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
