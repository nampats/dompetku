import React from 'react';
import { useNavigate } from 'react-router-dom';

const WealthCard = ({ summary }) => {
  const navigate = useNavigate();
  const netPosition = parseFloat(summary?.netPosition || 0);

  return (
    <div className="glass-card rounded-xl p-card-padding lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
      <div>
        <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-2">Total Kekayaan Bersih</h2>
        <div className="font-display text-display text-on-surface mb-2">
          {netPosition < 0 ? '-' : ''}Rp {Math.abs(netPosition).toLocaleString('id-ID')}
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-secondary/20 text-secondary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center">
            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
            +0.0%
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">dari bulan lalu</span>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={() => navigate('/transaksi')} className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md font-bold flex items-center">
          <span className="material-symbols-outlined mr-2">add</span> Tambah Saldo
        </button>
        <button className="glass-card border-primary text-primary px-6 py-2 rounded-lg font-label-md text-label-md font-bold">
          Transfer
        </button>
      </div>
    </div>
  );
};

export default WealthCard;
