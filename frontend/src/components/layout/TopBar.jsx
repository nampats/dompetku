import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(true);

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
      alert("Mode gelap diaktifkan.");
    } else {
      document.documentElement.classList.remove('dark');
      alert("Mode terang belum didukung sepenuhnya di versi ini, CSS vars perlu dikonfigurasi.");
    }
  };

  const handleNotification = () => {
    alert("Tidak ada notifikasi baru.");
  };

  return (
    <header className="w-full md:w-[calc(100%-288px)] md:ml-72 fixed top-0 right-0 z-40 bg-surface/40 backdrop-blur-[20px] border-b border-white/10 flex justify-between items-center px-container-padding-desktop py-stack-md">
      <div className="hidden md:flex gap-4">
        {/* Waktu filter dipindahkan ke DashboardPage.jsx */}
      </div>
      <div className="md:hidden">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">DompetKu</h1>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button onClick={handleNotification} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button onClick={toggleTheme} className="text-on-surface-variant hover:text-primary transition-colors">
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
