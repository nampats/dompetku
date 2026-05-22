import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <div className="ambient-glow top-[-100px] left-[-100px]"></div>
      <div className="ambient-glow bottom-1/4 right-[-50px] bg-[radial-gradient(circle,rgba(70,234,229,0.1)_0%,rgba(19,18,27,0)_70%)]"></div>

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <TopBar isCollapsed={isCollapsed} />

      <main className={`pt-28 px-container-padding-mobile md:px-container-padding-desktop pb-24 md:pb-12 max-w-[1440px] mx-auto transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
