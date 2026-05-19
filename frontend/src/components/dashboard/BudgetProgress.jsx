import React, { useState, useEffect } from 'react';

const BudgetProgress = () => {
  const [budget, setBudget] = useState({ total: 0, used: 0, percentage: 0, remainingDays: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const [budgetRes, cfRes] = await Promise.all([
          fetch(`/api/budgets?month=${month}&year=${year}`),
          fetch(`/api/dashboard/cashflow?year=${year}`)
        ]);

        const [budgetJson, cfJson] = await Promise.all([
          budgetRes.json(), cfRes.json()
        ]);

        const totalBudget = budgetJson.data?.reduce((sum, b) => sum + parseFloat(b.amount), 0) || 0;
        const currentMonthCf = cfJson.data?.filter(d => parseInt(d.month) === month) || [];
        const usedBudget = parseFloat(currentMonthCf.find(d => d.type === 'expense')?.total || 0);

        const percentage = totalBudget > 0 ? Math.min(100, (usedBudget / totalBudget) * 100) : 0;
        
        const daysInMonth = new Date(year, month, 0).getDate();
        const remainingDays = daysInMonth - now.getDate();

        setBudget({
          total: totalBudget,
          used: usedBudget,
          percentage,
          remainingDays
        });
      } catch (err) {
        console.error('Failed to fetch budget progress:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, []);

  return (
    <div className="glass-card rounded-xl p-card-padding">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider">Anggaran Bulan Ini</h2>
        <span className="font-label-md text-primary bg-primary/10 px-3 py-1 rounded-full">Sisa {budget.remainingDays} Hari</span>
      </div>
      {isLoading ? (
        <div className="text-center text-on-surface-variant text-label-sm py-4">Memuat data...</div>
      ) : (
        <>
          <div className="mb-2 flex justify-between font-body-md">
            <span className="text-on-surface font-semibold">Rp {budget.used.toLocaleString('id-ID')} <span className="text-on-surface-variant font-normal text-sm">terpakai</span></span>
            <span className="text-on-surface-variant">dari Rp {budget.total.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-3 mb-2 overflow-hidden">
            <div className={`h-3 rounded-full ${budget.percentage > 100 ? 'bg-error' : 'bg-gradient-to-r from-secondary to-primary'}`} style={{ width: `${Math.min(100, budget.percentage)}%` }}></div>
          </div>
          <div className={`text-right font-label-sm ${budget.percentage > 100 ? 'text-error' : 'text-primary'}`}>
            {budget.percentage.toFixed(1)}% terpakai
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetProgress;
