import React from 'react';

const TopBar = () => {
  return (
    <header className="w-full md:w-[calc(100%-288px)] md:ml-72 fixed top-0 right-0 z-40 bg-surface/40 backdrop-blur-[20px] border-b border-white/10 flex justify-between items-center px-container-padding-desktop py-stack-md">
      <div className="hidden md:flex gap-4">
        <a className="bg-primary text-on-primary rounded-full px-4 py-1 font-label-md text-label-md" href="#">Minggu Ini</a>
        <a className="text-on-surface-variant border border-outline-variant/30 rounded-full px-4 py-1 font-label-md text-label-md hover:bg-secondary-container/20 transition-all" href="#">Bulan Ini</a>
        <a className="text-on-surface-variant border border-outline-variant/30 rounded-full px-4 py-1 font-label-md text-label-md hover:bg-secondary-container/20 transition-all" href="#">3 Bulan</a>
        <a className="text-on-surface-variant border border-outline-variant/30 rounded-full px-4 py-1 font-label-md text-label-md hover:bg-secondary-container/20 transition-all" href="#">Tahun Ini</a>
      </div>
      <div className="md:hidden">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">DompetKu</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">contrast</span>
        </button>
        <img 
          alt="Ahmad Profile" 
          className="w-8 h-8 rounded-full object-cover md:hidden" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgYbibMfAj-U_O81iB4yQ4ZJixAOTrRs_fEIuoH6P70YOCf0Mramo6iXKGCZf5ZgWZN45C583eVqgTkWnlW9YiR8Oa7p6zbAVhaZBbNVxWvrvaH8espcyun3W3BgT850_s6IUXzo0iOxIDE3PfD3FLsrU3daB_Sg1-kEM2MlKP0vz6Uua6vmXBv7NKLozoljG5lmBubpTCecxfm3f-f4E4EIDL7r1pSb35k7le3ohYy2clptvHFBM_bDH3mV35annQ75czIt-lcJK5" 
        />
      </div>
    </header>
  );
};

export default TopBar;
