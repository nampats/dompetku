import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AccountLinkedItem = ({ colorClass, bgClass, bankCode, bankName, maskedAccount }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/10 bg-surface/30 hover:bg-surface-container transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center ${colorClass} border border-current/30 font-bold`}>
          {bankCode}
        </div>
        <div>
          <p className="font-body-md text-body-md text-on-surface font-medium">{bankName}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{maskedAccount || 'Belum diatur'}</p>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 border border-outline-variant/30 hover:bg-white/10 text-on-surface font-label-sm text-label-sm px-4 py-1.5 rounded-full">
        Kelola
      </button>
    </div>
  );
};

const Profil = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, accountsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/accounts')
        ]);
        const profileJson = await profileRes.json();
        const accountsJson = await accountsRes.json();

        // Menggabungkan data user dari auth context (primary) dengan data dari api (secondary)
        if (profileJson.success) setProfile({ ...profileJson.data, ...user });
        if (accountsJson.success) setAccounts(accountsJson.data);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 w-full">
      <div className="mb-8">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Profil Pengguna</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola informasi personal dan keamanan akun Anda.</p>
      </div>

      {isLoading ? (
        <div className="text-center text-on-surface-variant py-8">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          
          {/* 1. Header Profil (Spans 2 cols on desktop) */}
          <div className="md:col-span-2 bg-surface-container/40 backdrop-blur-[20px] border border-white/10 rounded-xl p-card-padding relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-6 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-primary-container/30 shrink-0 relative shadow-[0_0_20px_rgba(108,92,231,0.2)]">
              {profile?.image ? (
                <img 
                  alt="Profil" 
                  className="w-full h-full object-cover" 
                  src={profile.image}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-[48px]">person</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{profile?.name || 'Pengguna'}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{profile?.email || '-'}</p>
                </div>
                <button className="bg-white/5 border border-outline-variant/30 hover:bg-white/10 text-on-surface font-label-md text-label-md px-5 py-2.5 rounded-full transition-all flex items-center gap-2 w-fit">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profil
                </button>
              </div>
            </div>
          </div>

          {/* 2. Statistik Cepat (Spans 1 col on desktop) */}
          <div className="md:col-span-1 bg-surface-container/40 backdrop-blur-[20px] border border-white/10 rounded-xl p-card-padding flex flex-col justify-between gap-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Informasi Akun</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary border border-outline-variant/10">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80">Bergabung Sejak</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/10">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80">Total Akun</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium">{accounts.length} Terhubung</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Daftar Akun Keuangan (Spans 2 cols on desktop) */}
          <div className="md:col-span-2 bg-surface-container/40 backdrop-blur-[20px] border border-white/10 rounded-xl p-card-padding">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">Akun Keuangan Terhubung</h3>
              <button className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Tambah
              </button>
            </div>
            
            <div className="space-y-3">
              {accounts.length > 0 ? accounts.map((acc) => (
                <AccountLinkedItem 
                  key={acc.id}
                  bgClass={acc.type === 'e_wallet' ? 'bg-[#00AED6]/20' : 'bg-[#00529C]/20'}
                  colorClass={acc.type === 'e_wallet' ? 'text-[#00AED6]' : 'text-[#00529C]'}
                  bankCode={acc.bankCode || (acc.type === 'e_wallet' ? 'E-WL' : 'BNK')}
                  bankName={acc.name}
                  maskedAccount={acc.maskedAccountNumber}
                />
              )) : (
                <p className="text-on-surface-variant text-label-sm py-4 italic">Belum ada akun terhubung.</p>
              )}
            </div>
          </div>

          {/* 4. Keamanan Cepat (Spans 1 col on desktop) */}
          <div className="md:col-span-1 bg-surface-container/40 backdrop-blur-[20px] border border-error-container/20 rounded-xl p-card-padding flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-error">lock</span>
              <h3 className="font-body-lg text-body-lg font-semibold">Keamanan</h3>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-6 opacity-80">
              Lindungi akun Anda dengan memperbarui kredensial secara berkala.
            </p>
            <div className="space-y-3 mt-auto">
              <button className="w-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-on-surface font-label-md text-label-md py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">dialpad</span>
                Ubah PIN
              </button>
              <button className="w-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-on-surface font-label-md text-label-md py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">password</span>
                Ubah Password
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Profil;
