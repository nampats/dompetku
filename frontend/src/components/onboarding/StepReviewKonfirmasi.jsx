import React, { useState } from 'react';
import AccountItem from './AccountItem';
import { useApiClient } from '../../hooks/useApiClient';
import Modal from '../ui/Modal';

const StepReviewKonfirmasi = ({ prevStep, profile, accounts }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const { apiFetch } = useApiClient();

  const totalSaldo = accounts.reduce((sum, acc) => {
    const val = parseFloat(acc.balance.replace(/[^0-9]/g, '')) || 0;
    return sum + val;
  }, 0);

  const handleConfirmation = async () => {
    setIsConfirming(true);
    
    try {
      // 1. Update Profile (PATCH)
      if (profile.displayName) {
        await apiFetch('/api/profile', {
          method: 'PATCH',
          body: { name: profile.displayName }
        });
      }

      // 2. Create Accounts and Initial Transactions
      const validAccounts = accounts.filter(a => a.name);
      for (const acc of validAccounts) {
        const typeMap = {
          'Rekening Tabungan': 'bank',
          'Gaji & Operasional': 'bank',
          'E-Wallet': 'e_wallet'
        };
        const balance = acc.balance.replace(/[^0-9]/g, '');
        const amount = balance || '0';
        
        const newAccount = await apiFetch('/api/accounts', {
          method: 'POST',
          body: {
            name: acc.name,
            type: typeMap[acc.type] || 'bank',
            initialBalance: amount
          }
        });

        // Create initial transaction if balance > 0
        if (parseFloat(amount) > 0 && newAccount?.data?.id) {
          await apiFetch('/api/transactions', {
            method: 'POST',
            body: {
              type: 'income',
              toAccountId: newAccount.data.id,
              amount: amount,
              description: 'Saldo Awal',
              date: new Date().toISOString()
            }
          });
        }
      }

      setIsConfirming(false);
      setIsSuccess(true);
      
      // Navigate to dashboard after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Failed to submit onboarding data:', err);
      setIsConfirming(false);
      setErrorModal({ isOpen: true, message: err.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.' });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-4 w-full">
      <div className="w-full max-w-[520px] flex flex-col gap-stack-lg">
        {/* Onboarding Header */}
        <header className="text-center space-y-stack-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            Hampir Selesai!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px] mx-auto">
            Periksa kembali data Anda sebelum mulai mengelola keuangan.
          </p>
        </header>

        {/* Review Canvas */}
        <div className="glass-panel rounded-[24px] p-card-padding shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col gap-stack-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
          <div className="absolute inset-0 shimmer pointer-events-none"></div>
          
          {/* Profile Summary Section */}
          <section className="space-y-stack-md relative z-10">
            <div className="flex items-center gap-stack-md">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 p-1 flex-shrink-0">
                {profile.avatarPreview ? (
                  <img src={profile.avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary-container/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[28px]">person</span>
                  </div>
                )}
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                  Nama Tampilan
                </span>
                <h2 className="font-headline-md text-headline-md text-primary" id="display-name">
                  {profile.displayName || 'Pengguna Tanpa Nama'}
                </h2>
              </div>
            </div>
          </section>
          
          <hr className="border-outline-variant/20 relative z-10" />
          
          {/* Accounts Summary Section */}
          <section className="space-y-stack-md relative z-10">
            <div className="flex justify-between items-end">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                Akun Terdaftar
              </span>
              <button onClick={prevStep} className="text-primary font-label-md text-label-md hover:underline transition-all">
                Ubah
              </button>
            </div>
            <div className="grid gap-stack-sm">
              {accounts.filter(a => a.name).map((account, idx) => (
                <AccountItem 
                  key={idx} 
                  icon={account.type === 'E-Wallet' ? 'account_balance_wallet' : 'account_balance'} 
                  iconBg={account.type === 'E-Wallet' ? 'bg-tertiary/20' : 'bg-primary/20'} 
                  iconColor={account.type === 'E-Wallet' ? 'text-tertiary' : 'text-primary'} 
                  name={account.name} 
                  type={account.type} 
                  balance={`Rp ${account.balance || '0'}`} 
                />
              ))}
              {accounts.filter(a => a.name).length === 0 && (
                <p className="text-on-surface-variant text-label-sm italic">Belum ada akun yang valid.</p>
              )}
            </div>
          </section>
          
          {/* Total Calculation */}
          <div className="bg-primary/10 p-stack-md rounded-xl border border-primary/20 flex justify-between items-center relative z-10">
            <span className="font-label-md text-label-md text-on-primary-container">Total Saldo Awal</span>
            <span className="font-headline-md text-headline-md text-primary">Rp {totalSaldo.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Action Buttons specific to Step 3 */}
        <footer className="flex flex-col gap-stack-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <button 
            onClick={handleConfirmation}
            disabled={isConfirming || isSuccess}
            className={`w-full py-4 rounded-full font-headline-md text-label-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group
              ${isSuccess 
                ? 'bg-gradient-to-r from-secondary to-secondary-container text-on-secondary shadow-secondary/30' 
                : 'bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container hover:shadow-primary/30 hover:scale-[1.02] active:scale-95'
              }
              ${isConfirming ? 'opacity-80 cursor-not-allowed' : ''}
            `}
          >
            {isConfirming ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menyiapkan Dashboard...</span>
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Selamat Datang!</span>
              </>
            ) : (
              <>
                Konfirmasi &amp; Mulai
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </>
            )}
          </button>
          
          {!isSuccess && (
            <button 
              onClick={prevStep}
              className="w-full py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all"
            >
              Kembali ke Langkah 2
            </button>
          )}
        </footer>
      </div>
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="Gagal Menyimpan"
        variant="error"
      >
        {errorModal.message}
      </Modal>
    </div>
  );
};

export default StepReviewKonfirmasi;
