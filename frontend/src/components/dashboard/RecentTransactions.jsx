import React from 'react';

import { Link } from 'react-router-dom';

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <section className="glass-card rounded-xl p-card-padding">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider">Transaksi Terakhir</h2>
        <Link to="/transaksi" className="font-label-md text-primary hover:underline">Lihat Semua</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-md">
          <thead>
            <tr className="border-b border-white/10 text-on-surface-variant font-label-md">
              <th className="pb-3 font-normal">Tanggal</th>
              <th className="pb-3 font-normal">Keterangan</th>
              <th className="pb-3 font-normal">Kategori</th>
              <th className="pb-3 font-normal text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-on-surface-variant text-sm">
                    {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 font-semibold text-on-surface">{tx.description || tx.categoryName || '-'}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${tx.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                      {tx.categoryName || (tx.type === 'income' ? 'Pendapatan' : 'Pengeluaran')}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-semibold ${tx.type === 'income' ? 'text-secondary' : 'text-error'}`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-on-surface-variant">Belum ada transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentTransactions;
