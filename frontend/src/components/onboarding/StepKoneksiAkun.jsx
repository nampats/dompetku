import React, { useState } from 'react';

const AccountInputItem = ({ index, account, setAccounts }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    setAccounts((prev) => {
      const newAccs = [...prev];
      newAccs[index].balance = val ? new Intl.NumberFormat('id-ID').format(val) : '';
      return newAccs;
    });
  };

  const handleNameChange = (e) => {
    setAccounts((prev) => {
      const newAccs = [...prev];
      newAccs[index].name = e.target.value;
      return newAccs;
    });
  };

  const handleTypeChange = (e) => {
    setAccounts((prev) => {
      const newAccs = [...prev];
      newAccs[index].type = e.target.value;
      return newAccs;
    });
  };

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between p-stack-md bg-surface-container-low rounded-2xl border transition-colors group ${
        isFocused ? 'border-primary/40 shadow-lg' : 'border-white/5 hover:border-primary/30'
      }`}
    >
      <div className="flex items-center gap-stack-md mb-4 md:mb-0 w-full md:w-1/2">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[28px]">{account.type === 'E-Wallet' ? 'account_balance_wallet' : 'account_balance'}</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 pr-4">
          <input 
            type="text" 
            placeholder="Nama Bank / E-Wallet (mis. BCA)"
            value={account.name}
            onChange={handleNameChange}
            className="font-label-md text-label-md text-on-surface bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-1"
          />
          <select 
            value={account.type}
            onChange={handleTypeChange}
            className="font-label-sm text-label-sm text-on-surface-variant bg-transparent border-none focus:outline-none cursor-pointer"
          >
            <option value="Rekening Tabungan">Rekening Tabungan</option>
            <option value="Gaji & Operasional">Gaji & Operasional</option>
            <option value="E-Wallet">E-Wallet</option>
          </select>
        </div>
      </div>
      <div className="relative flex-1 md:max-w-[200px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-label-md text-on-surface-variant">Rp</span>
        <input
          type="text"
          value={account.balance}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0"
          className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl py-3 pl-10 pr-4 text-label-md text-on-surface focus:outline-none focus:border-primary transition-all text-right focus:shadow-[0_0_0_2px_rgba(198,191,255,0.2)]"
        />
      </div>
    </div>
  );
};

const StepKoneksiAkun = ({ accounts, setAccounts }) => {
  const addAccount = () => {
    setAccounts(prev => [...prev, { id: Date.now(), name: '', type: 'Rekening Tabungan', balance: '' }]);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-4 w-full">
      <div className="w-full max-w-[640px]">
        <div className="glass-panel rounded-3xl p-card-padding md:p-stack-lg space-y-stack-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/10">
          
          {/* Header Section */}
          <header className="space-y-unit">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Tambah Akun Keuangan
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Masukkan akun bank atau dompet digital Anda beserta saldo awalnya untuk mulai melacak arus kas.
            </p>
          </header>

          {/* Account List */}
          <div className="space-y-stack-md">
            <div className="space-y-stack-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant/70 uppercase">
                Akun Terdaftar
              </span>
              <div className="grid gap-stack-sm">
                
                {accounts.map((acc, index) => (
                  <AccountInputItem 
                    key={acc.id}
                    index={index}
                    account={acc}
                    setAccounts={setAccounts}
                  />
                ))}

                {/* Add New Account Button */}
                <button
                  type="button"
                  onClick={addAccount}
                  className="flex items-center justify-center gap-unit p-stack-md border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all group"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="font-label-md text-label-md">Tambah Akun Lainnya</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security/Trust Badge */}
          <div className="mt-stack-lg flex items-center justify-center gap-stack-sm text-on-surface-variant/40">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">
              Enkripsi Data 256-bit Terjamin
            </span>
          </div>

        </div>
        
        {/* Footer Meta */}
        <p className="text-center mt-stack-lg font-label-sm text-label-sm text-on-surface-variant/60">
          Langkah 2 dari 3: Pengaturan Saldo Awal
        </p>
      </div>
    </div>
  );
};

export default StepKoneksiAkun;
