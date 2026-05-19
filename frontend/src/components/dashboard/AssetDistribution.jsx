import React from 'react';

const AssetDistribution = ({ summary }) => {
  const cash = parseFloat(summary?.totalAccountBalance || 0);
  const portfolio = parseFloat(summary?.totalPortfolioValue || 0);
  const total = cash + portfolio || 1; // avoid division by zero

  const cashPercent = Math.round((cash / total) * 100);
  const portPercent = Math.round((portfolio / total) * 100);

  return (
    <div className="glass-card rounded-xl p-card-padding flex flex-col">
      <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-4">Distribusi Aset</h2>
      <div className="flex-grow flex items-center justify-center relative">
        <div 
          className="w-32 h-32 rounded-full border-[12px] border-surface-container relative" 
          style={{ borderTopColor: '#c6bfff', borderRightColor: '#c6bfff', borderBottomColor: '#46eae5', borderLeftColor: '#46eae5', transform: 'rotate(-45deg)' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary">account_balance</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-label-md font-label-md">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Kas & Bank</div>
          <span>{cashPercent}%</span>
        </div>
        <div className="flex justify-between items-center text-label-md font-label-md">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span> Portofolio (Saham)</div>
          <span>{portPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default AssetDistribution;
