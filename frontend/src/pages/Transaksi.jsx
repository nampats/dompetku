import React, { useState, useEffect } from 'react';
import TransactionRow from '../components/transaksi/TransactionRow';
import TransactionForm from '../components/transaksi/TransactionForm';
import { useApiClient } from '../hooks/useApiClient';

const Transaksi = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apiFetch } = useApiClient();

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const json = await apiFetch('/api/transactions');
      
      if (json.success && json.data) {
        const formattedData = json.data.map((tx) => ({
          id: tx.id,
          type: tx.type,
          date: new Date(tx.date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          icon: tx.categoryIcon || (tx.type === 'income' ? 'south_west' : tx.type === 'expense' ? 'north_east' : 'swap_horiz'),
          title: tx.description,
          category: tx.categoryName || 'Uncategorized',
          from: tx.fromAccountId ? 'Akun Sumber' : '-',
          to: tx.toAccountId ? 'Akun Tujuan' : '-',
          amount: parseFloat(tx.amount) || 0,
        }));
        setTransactions(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredData = transactions.filter(tx => {
    const query = searchQuery.toLowerCase();
    return (
      tx.title.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query) ||
      tx.amount.toString().includes(query) ||
      tx.date.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-stack-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Riwayat Transaksi
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kelola dan pantau arus kas Anda.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-surface-container-lowest px-6 py-3 rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(198,191,255,0.3)]"
          onClick={() => setShowForm(!showForm)}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Transaksi
        </button>
      </div>

      {/* Expandable Form */}
      {showForm && <TransactionForm onClose={() => setShowForm(false)} onSuccess={fetchTransactions} />}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel rounded-xl p-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
            search
          </span>
          <input
            className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-on-surface-variant/50 transition-all"
            placeholder="Cari transaksi..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant/30 px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-bright transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Semua Tipe
          </button>
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant/30 px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-bright transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">category</span>
            Semua Kategori
          </button>
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant/30 px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-bright transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            Bulan Ini
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/10">
        {/* Header Row (Desktop only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-outline-variant/10 bg-surface-container-lowest/30 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          <div className="col-span-2">Tanggal</div>
          <div className="col-span-3">Detail Transaksi</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-2">Sumber / Tujuan</div>
          <div className="col-span-3 text-right">Nominal</div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-outline-variant/10">
          {isLoading ? (
            <div className="p-8 text-center text-on-surface-variant font-body-md">
              Memuat data transaksi...
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((tx) => (
              <TransactionRow key={tx.id} {...tx} />
            ))
          ) : (
            <div className="p-8 text-center text-on-surface-variant font-body-md">
              Tidak ada transaksi yang cocok dengan pencarian.
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="p-4 border-t border-outline-variant/10 flex justify-center">
          <button className="text-primary font-label-md text-label-md hover:underline decoration-primary underline-offset-4 transition-all">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transaksi;
