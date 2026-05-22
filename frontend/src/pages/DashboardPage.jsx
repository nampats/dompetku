import React, { useState, useEffect } from 'react';
import WealthCard from '../components/dashboard/WealthCard';
import AssetDistribution from '../components/dashboard/AssetDistribution';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import TopExpenses from '../components/dashboard/TopExpenses';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import FinancialTargets from '../components/dashboard/FinancialTargets';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { useApiClient } from '../hooks/useApiClient';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [cashflow, setCashflow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');
  const { apiFetch } = useApiClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const year = new Date().getFullYear();
        const [sumJson, cfJson, txJson] = await Promise.all([
          apiFetch('/api/dashboard/summary'),
          apiFetch(`/api/dashboard/cashflow?year=${year}`),
          apiFetch('/api/transactions?limit=5')
        ]);

        if (sumJson.success) setSummary(sumJson.data);
        if (cfJson.success) setCashflow(cfJson.data);
        if (txJson.success) setTransactions(txJson.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-12 text-center text-on-surface-variant">Memuat data dashboard...</div>;
  }

  return (
    <>
      <div className="flex gap-4 mb-stack-md overflow-x-auto pb-2">
        {['Minggu Ini', 'Bulan Ini', '3 Bulan', 'Tahun Ini'].map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-1.5 font-label-md text-label-md whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-primary text-on-primary shadow-sm hover:shadow-primary/30' 
                : 'text-on-surface-variant border border-outline-variant/30 hover:bg-secondary-container/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <WealthCard summary={summary} />
        <AssetDistribution summary={summary} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <IncomeExpenseChart cashflow={cashflow} />
        <TopExpenses />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg">
        <BudgetProgress />
        <FinancialTargets summary={summary} />
      </section>

      <RecentTransactions transactions={transactions} />
    </>
  );
};

export default DashboardPage;
