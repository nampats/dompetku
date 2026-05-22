import React, { useState, useEffect } from 'react';
import DebtCard from '../components/utang-piutang/DebtCard';
import DebtForm from '../components/utang-piutang/DebtForm';
import { useApiClient } from '../hooks/useApiClient';

const UtangPiutang = () => {
  const [activeTab, setActiveTab] = useState('utang');
  const [debtRecords, setDebtRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { apiFetch } = useApiClient();
  const [summary, setSummary] = useState({
    totalUtang: 0,
    totalPiutang: 0,
    posisiBersih: 0
  });

  const fetchDebts = async () => {
    setIsLoading(true);
    try {
      const json = await apiFetch('/api/debts');
      
      if (json.success && json.data) {
        let tUtang = 0;
        let tPiutang = 0;

        const formatted = json.data.map((debt) => {
          const total = parseFloat(debt.totalAmount) || 0;
          const paid = parseFloat(debt.paidAmount) || 0;
          const currentAmount = total - paid;
          const percentage = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
          
          if (debt.type === 'utang') {
            tUtang += currentAmount;
          } else {
            tPiutang += currentAmount;
          }

          // Status Badges
          let badge = '';
          let badgeStyle = '';
          let actionLabel = debt.type === 'utang' ? 'Bayar Sekarang' : 'Kirim Tagihan';
          let actionColor = debt.type === 'utang' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary';
          let actionIcon = debt.type === 'utang' ? 'more_vert' : 'chat';
          
          if (debt.status === 'paid') {
            badge = 'Lunas';
            badgeStyle = 'bg-secondary/20 text-secondary border border-secondary/20';
            actionLabel = 'Lihat Riwayat';
            actionIcon = 'history';
            actionColor = 'bg-surface-container-highest text-on-surface';
          } else if (debt.status === 'overdue') {
            badge = 'Jatuh Tempo';
            badgeStyle = 'bg-error/20 text-error border border-error/40';
            actionLabel = debt.type === 'utang' ? 'Bayar Segera' : 'Tagih Keras';
            actionColor = 'bg-error text-on-error';
          } else {
            badge = 'Lancar';
            badgeStyle = debt.type === 'utang' 
              ? 'bg-primary/20 text-primary border border-primary/20' 
              : 'bg-secondary/20 text-secondary border border-secondary/20';
          }

          return {
            id: debt.id,
            type: debt.type,
            icon: debt.icon || (debt.type === 'utang' ? 'money_off' : 'attach_money'),
            iconColor: debt.type === 'utang' ? 'text-primary' : 'text-secondary',
            title: debt.title,
            category: debt.category || 'General',
            badge,
            badgeStyle,
            badgePulse: debt.status === 'overdue',
            progressLabel: debt.type === 'utang' ? 'Progress Pembayaran' : 'Progress Penagihan',
            percentage,
            progressColor: debt.type === 'utang' ? 'bg-primary' : 'bg-secondary',
            amountLabel: debt.type === 'utang' ? 'Sisa Hutang' : 'Belum Dibayar',
            currentAmount: `Rp ${currentAmount.toLocaleString('id-ID')}`,
            totalAmount: `Rp ${total.toLocaleString('id-ID')}`,
            amountColor: debt.type === 'utang' ? 'text-primary' : 'text-secondary',
            dueLabel: 'Jatuh Tempo',
            dueValue: debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
            dueColor: debt.status === 'overdue' ? 'text-error' : '',
            actionLabel,
            actionColor,
            actionIcon,
            hoverBorder: debt.type === 'utang' ? 'hover:border-primary/40' : 'hover:border-secondary/40',
            borderClass: debt.status === 'overdue' ? 'border-error/40' : '',
          };
        });

        setDebtRecords(formatted);
        setSummary({
          totalUtang: tUtang,
          totalPiutang: tPiutang,
          posisiBersih: tPiutang - tUtang
        });
      }
    } catch (err) {
      console.error('Failed to fetch debts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);



  const filteredRecords =
    activeTab === 'semua'
      ? debtRecords
      : debtRecords.filter((r) => r.type === activeTab);

  return (
    <div className="space-y-stack-lg">
      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-md">
        {/* Total Utang */}
        <div className="glass-panel p-card-padding rounded-[24px] shadow-[0_0_20px_rgba(108,92,231,0.15)] border-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary">arrow_upward</span>
            </div>
            <span className="text-label-sm text-on-surface-variant px-2 py-1 bg-white/5 rounded-lg">Total Utang</span>
          </div>
          <h3 className="text-label-sm text-on-surface-variant font-medium mb-1 uppercase tracking-wider">Anda Berhutang</h3>
          <p className="font-headline-lg text-headline-lg text-primary">Rp {summary.totalUtang.toLocaleString('id-ID')}</p>
          <p className="text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="text-error flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
            </span>{' '}
            vs bulan lalu
          </p>
        </div>

        {/* Posisi Bersih */}
        <div className="relative flex flex-col items-center justify-center glass-panel p-card-padding rounded-[24px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          <div className="relative z-10 text-center">
            <p className="text-label-sm text-on-surface-variant mb-2 uppercase tracking-widest">Posisi Bersih</p>
            <h2 className="font-display text-display text-white">
              {summary.posisiBersih < 0 ? '-' : ''}Rp {Math.abs(summary.posisiBersih).toLocaleString('id-ID')}
            </h2>
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full text-label-md font-bold ${summary.posisiBersih >= 0 ? 'bg-secondary-container/20 text-secondary-container' : 'bg-error-container/20 text-error'}`}>
              <span className="material-symbols-outlined text-[18px]">
                {summary.posisiBersih >= 0 ? 'verified_user' : 'warning'}
              </span>
              {summary.posisiBersih >= 0 ? 'Saldo Surplus' : 'Defisit'}
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary blur-[60px] opacity-20"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary blur-[60px] opacity-20"></div>
        </div>

        {/* Total Piutang */}
        <div className="glass-panel p-card-padding rounded-[24px] shadow-[0_0_20px_rgba(0,206,201,0.15)] border-secondary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <span className="material-symbols-outlined text-secondary">arrow_downward</span>
            </div>
            <span className="text-label-sm text-on-surface-variant px-2 py-1 bg-white/5 rounded-lg">Total Piutang</span>
          </div>
          <h3 className="text-label-sm text-on-surface-variant font-medium mb-1 uppercase tracking-wider">Hutang Orang Lain</h3>
          <p className="font-headline-lg text-headline-lg text-secondary">Rp {summary.totalPiutang.toLocaleString('id-ID')}</p>
          <p className="text-label-sm text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="text-secondary flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 5%
            </span>{' '}
            vs bulan lalu
          </p>
        </div>
      </div>

      {/* Actions & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-surface-container rounded-2xl border border-white/5">
          <button
            className={`px-6 py-2 font-bold rounded-xl transition-all active:scale-95 ${
              activeTab === 'utang'
                ? 'bg-primary-container text-on-primary-container shadow-lg'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            onClick={() => setActiveTab('utang')}
          >
            Daftar Utang
          </button>
          <button
            className={`px-6 py-2 font-bold rounded-xl transition-all active:scale-95 ${
              activeTab === 'piutang'
                ? 'bg-secondary-container text-on-secondary-container shadow-lg'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
            onClick={() => setActiveTab('piutang')}
          >
            Daftar Piutang
          </button>
        </div>

        {/* Search + Filter + Add */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-3 pl-12 pr-4 text-body-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              placeholder="Cari nama atau kategori..."
              type="text"
            />
          </div>
          <button className="glass-panel px-4 py-3 rounded-2xl text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">filter_list</span>
            <span className="hidden md:inline">Filter</span>
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Tambah Catatan</span>
          </button>
        </div>
      </div>

      {/* Debt Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-stack-md">
        {showForm && <DebtForm onClose={() => setShowForm(false)} onSuccess={fetchDebts} />}
        {isLoading ? (
          <div className="col-span-full glass-panel rounded-[28px] p-12 text-center text-on-surface-variant">
            Memuat data utang piutang...
          </div>
        ) : (
          <>
            {filteredRecords.map((record) => (
              <DebtCard key={record.id} {...record} />
            ))}

            {filteredRecords.length === 0 && (
              <div className="col-span-full glass-panel rounded-[28px] p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4">inbox</span>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                  Tidak ada catatan {activeTab === 'utang' ? 'utang' : 'piutang'} saat ini.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UtangPiutang;
