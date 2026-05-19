import React, { useState, useEffect } from 'react';

const TopExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopExpenses = async () => {
      try {
        const res = await fetch('/api/dashboard/top-expenses');
        const json = await res.json();
        if (json.success && json.data) {
          const total = json.data.reduce((sum, item) => sum + parseFloat(item.total), 0) || 1;
          const formatted = json.data.map(item => ({
            id: item.categoryId,
            name: item.categoryName || 'Lainnya',
            icon: item.categoryIcon || 'shopping_bag',
            amount: parseFloat(item.total),
            percentage: Math.round((parseFloat(item.total) / total) * 100),
            colorClass: item.categoryColor ? `text-[${item.categoryColor}]` : 'text-primary'
          }));
          setExpenses(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch top expenses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopExpenses();
  }, []);

  return (
    <div className="glass-card rounded-xl p-card-padding">
      <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-6">Pengeluaran Tertinggi</h2>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center text-on-surface-variant text-label-sm py-4">Memuat data...</div>
        ) : expenses.length > 0 ? (
          expenses.map((exp, i) => (
            <div key={exp.id || i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center ${exp.colorClass}`}>
                  <span className="material-symbols-outlined">{exp.icon}</span>
                </div>
                <div>
                  <div className="font-body-md text-on-surface font-semibold">{exp.name}</div>
                  <div className="font-label-sm text-on-surface-variant">{exp.percentage}% total</div>
                </div>
              </div>
              <div className="font-body-md text-error font-semibold">-Rp {exp.amount.toLocaleString('id-ID')}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-on-surface-variant text-label-sm py-4">Belum ada pengeluaran bulan ini.</div>
        )}
      </div>
    </div>
  );
};

export default TopExpenses;
