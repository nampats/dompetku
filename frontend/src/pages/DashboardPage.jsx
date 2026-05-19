import React, { useState, useEffect } from 'react';
import WealthCard from '../components/dashboard/WealthCard';
import AssetDistribution from '../components/dashboard/AssetDistribution';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import TopExpenses from '../components/dashboard/TopExpenses';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import FinancialTargets from '../components/dashboard/FinancialTargets';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [cashflow, setCashflow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const year = new Date().getFullYear();
        const [sumRes, cfRes, txRes] = await Promise.all([
          fetch('/api/dashboard/summary'),
          fetch(`/api/dashboard/cashflow?year=${year}`),
          fetch('/api/transactions?limit=5')
        ]);

        const [sumJson, cfJson, txJson] = await Promise.all([
          sumRes.json(), cfRes.json(), txRes.json()
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
