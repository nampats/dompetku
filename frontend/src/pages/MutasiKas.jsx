import React, { useState, useEffect } from 'react';
import RankingItem from '../components/mutasi/RankingItem';
import CategoryRow from '../components/mutasi/CategoryRow';

const MutasiKas = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, lastIncome: 0, lastExpense: 0, totalBudget: 0, usedBudget: 0 });
  const [rankingData, setRankingData] = useState([]);
  const [chartBars, setChartBars] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1-12
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;

        const [cfRes, topExRes, budgetRes, prevCfRes] = await Promise.all([
          fetch(`/api/dashboard/cashflow?year=${year}`),
          fetch(`/api/dashboard/top-expenses?month=${month}&year=${year}`),
          fetch(`/api/budgets?month=${month}&year=${year}`),
          fetch(`/api/dashboard/cashflow?year=${prevYear}`)
        ]);

        const [cfJson, topExJson, budgetJson, prevCfJson] = await Promise.all([
          cfRes.json(), topExRes.json(), budgetRes.json(), prevCfRes.json()
        ]);

        // 1. Process Summary
        const currentMonthCf = cfJson.data?.filter((d) => parseInt(d.month) === month) || [];
        const prevMonthCf = prevCfJson.data?.filter((d) => parseInt(d.month) === prevMonth) || [];
        
        const income = currentMonthCf.find((d) => d.type === 'income')?.total || 0;
        const expense = currentMonthCf.find((d) => d.type === 'expense')?.total || 0;
        const lastIncome = prevMonthCf.find((d) => d.type === 'income')?.total || 0;
        const lastExpense = prevMonthCf.find((d) => d.type === 'expense')?.total || 0;

        const totalBudget = budgetJson.data?.reduce((sum, b) => sum + parseFloat(b.amount), 0) || 0;

        setSummary({
          income: parseFloat(income),
          expense: parseFloat(expense),
          lastIncome: parseFloat(lastIncome),
          lastExpense: parseFloat(lastExpense),
          totalBudget,
          usedBudget: parseFloat(expense),
        });

        // 2. Process Ranking (Top Expenses)
        let totalEx = topExJson.data?.reduce((s, item) => s + parseFloat(item.total), 0) || 1;
        if (totalEx === 0) totalEx = 1;
        
        const ranking = (topExJson.data || []).map((item, idx) => ({
          rank: idx + 1,
          label: item.categoryName || 'Lainnya',
          amount: `Rp ${parseFloat(item.total).toLocaleString('id-ID')}`,
          percentage: Math.round((parseFloat(item.total) / totalEx) * 100),
          opacity: 100 - (idx * 15) > 20 ? 100 - (idx * 15) : 20,
        }));
        setRankingData(ranking);

        // 3. Process Categories & Chart Bars (Budget vs Actual)
        const categoriesMap = new Map();
        
        (budgetJson.data || []).forEach((b) => {
          categoriesMap.set(b.categoryId, {
            id: b.categoryId,
            label: b.categoryName,
            icon: b.categoryIcon || 'category',
            iconColor: 'text-primary',
            iconBg: 'bg-primary-container/20',
            budget: parseFloat(b.amount),
            actual: 0
          });
        });

        (topExJson.data || []).forEach((ex) => {
          if (categoriesMap.has(ex.categoryId)) {
            categoriesMap.get(ex.categoryId).actual = parseFloat(ex.total);
          } else {
            categoriesMap.set(ex.categoryId, {
              id: ex.categoryId,
              label: ex.categoryName || 'Lainnya',
              icon: ex.categoryIcon || 'category',
              iconColor: 'text-outline',
              iconBg: 'bg-outline-variant/20',
              budget: 0,
              actual: parseFloat(ex.total)
            });
          }
        });

        const catDataArray = Array.from(categoriesMap.values()).map((cat) => {
          const diff = cat.budget - cat.actual;
          return {
            ...cat,
            budget: `Rp ${cat.budget.toLocaleString('id-ID')}`,
            actual: `Rp ${cat.actual.toLocaleString('id-ID')}`,
            diff: `${diff >= 0 ? '+' : '-'} Rp ${Math.abs(diff).toLocaleString('id-ID')}`,
            diffColor: diff >= 0 ? 'text-secondary' : 'text-error',
            status: diff >= 0 ? 'Hemat' : 'Overbudget',
            statusStyle: diff >= 0 ? 'bg-secondary/20 text-secondary' : 'bg-error text-on-error',
            rowBg: diff < 0 ? 'bg-error/5 hover:bg-error/10' : ''
          };
        });

        setCategoryData(catDataArray);

        // Chart Bars (limit to top 6)
        const bars = catDataArray.slice(0, 6).map((cat) => {
          const maxVal = Math.max(parseFloat(cat.budget.replace(/[^0-9]/g,'')), parseFloat(cat.actual.replace(/[^0-9]/g,''))) || 1;
          const actualVal = parseFloat(cat.actual.replace(/[^0-9]/g,'')) || 0;
          const budgetVal = parseFloat(cat.budget.replace(/[^0-9]/g,'')) || 0;
          return {
            label: cat.label.substring(0, 7),
            budgetHeight: `${(budgetVal / maxVal) * 100}%`,
            actualHeight: `${(actualVal / maxVal) * 100}%`,
            glow: actualVal > budgetVal
          };
        });
        setChartBars(bars);

      } catch(err) {
        console.error('Failed to fetch mutasi data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-on-surface-variant font-body-lg">Memuat data mutasi kas...</p>
      </div>
    );
  }

  const incomeChange = summary.lastIncome > 0 ? ((summary.income - summary.lastIncome) / summary.lastIncome) * 100 : 0;
  const expenseChange = summary.lastExpense > 0 ? ((summary.expense - summary.lastExpense) / summary.lastExpense) * 100 : 0;
  const sisaAnggaran = summary.totalBudget - summary.usedBudget;
  const budgetPercentage = summary.totalBudget > 0 ? Math.min(100, (summary.usedBudget / summary.totalBudget) * 100) : 0;

  return (
    <div className="space-y-stack-lg">
      {/* Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Total Pemasukan */}
        <div className="glass-panel p-card-padding rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors"></div>
          <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest mb-2">Total Pemasukan</p>
          <div className="flex items-end gap-2">
            <h3 className="font-headline-lg text-headline-lg">Rp {summary.income.toLocaleString('id-ID')}</h3>
            <div className={`flex items-center mb-1 ${incomeChange >= 0 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-sm">{incomeChange >= 0 ? 'trending_up' : 'trending_down'}</span>
              <span className="text-label-sm ml-1">{incomeChange > 0 ? '+' : ''}{incomeChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-base">arrow_downward</span>
            </div>
            <p className="text-label-sm text-on-surface-variant">Bulan lalu: Rp {summary.lastIncome.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="glass-panel p-card-padding rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-3xl group-hover:bg-error/20 transition-colors"></div>
          <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest mb-2">Total Pengeluaran</p>
          <div className="flex items-end gap-2">
            <h3 className="font-headline-lg text-headline-lg">Rp {summary.expense.toLocaleString('id-ID')}</h3>
            <div className={`flex items-center mb-1 ${expenseChange <= 0 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-sm">{expenseChange >= 0 ? 'trending_up' : 'trending_down'}</span>
              <span className="text-label-sm ml-1">{expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-base">arrow_upward</span>
            </div>
            <p className="text-label-sm text-on-surface-variant">Bulan lalu: Rp {summary.lastExpense.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Sisa Anggaran */}
        <div className="glass-panel p-card-padding rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
          <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest mb-2">Sisa Anggaran</p>
          <div className="flex items-end gap-2">
            <h3 className={`font-headline-lg text-headline-lg ${sisaAnggaran < 0 ? 'text-error' : ''}`}>
              {sisaAnggaran < 0 ? '-' : ''}Rp {Math.abs(sisaAnggaran).toLocaleString('id-ID')}
            </h3>
            <span className="text-label-sm text-on-surface-variant mb-1">dari Rp {summary.totalBudget.toLocaleString('id-ID')}</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${budgetPercentage > 100 ? 'bg-error' : 'bg-gradient-to-r from-primary to-secondary'}`} style={{ width: `${Math.min(100, budgetPercentage)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant/60">
              <span>Terpakai: {budgetPercentage.toFixed(1)}%</span>
              <span>Sisa: {Math.max(0, 100 - budgetPercentage).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chart & Ranking Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Cashflow Chart */}
        <div className="lg:col-span-2 glass-panel p-card-padding rounded-3xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md">Anggaran vs Realisasi</h4>
              <p className="text-label-sm text-on-surface-variant">Perbandingan pengeluaran berdasarkan kategori utama</p>
            </div>
            <div className="flex items-center gap-4 text-label-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/20"></span>
                <span>Anggaran</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span>Realisasi</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 min-h-[300px] flex items-end justify-between px-4 pb-8 relative">
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-8 pointer-events-none">
              <div className="w-full border-t border-white/5"></div>
              <div className="w-full border-t border-white/5"></div>
              <div className="w-full border-t border-white/5"></div>
              <div className="w-full border-t border-white/5"></div>
            </div>

            {/* Bars */}
            {chartBars.map((bar) => (
              <div key={bar.label} className="relative flex flex-col items-center group w-16">
                <div className="flex items-end gap-1 mb-2 h-48">
                  <div className="w-4 bg-white/10 rounded-t-sm" style={{ height: bar.budgetHeight }}></div>
                  <div
                    className={`w-4 bg-primary rounded-t-sm ${bar.glow ? 'shadow-[0_-4px_10px_rgba(198,191,255,0.3)]' : ''}`}
                    style={{ height: bar.actualHeight }}
                  ></div>
                </div>
                <span className="text-label-sm text-on-surface-variant">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Spending Ranking */}
        <div className="glass-panel p-card-padding rounded-3xl">
          <h4 className="font-headline-md text-headline-md mb-6">Peringkat Pengeluaran</h4>
          <div className="space-y-6">
            {rankingData.map((item) => (
              <RankingItem key={item.rank} {...item} />
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-outline-variant/20 rounded-xl text-label-sm hover:bg-white/5 transition-colors uppercase tracking-widest font-bold">
            Lihat Semua Kategori
          </button>
        </div>
      </section>

      {/* Detailed Breakdown Table */}
      <section className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-card-padding border-b border-white/5 flex justify-between items-center">
          <h4 className="font-headline-md text-headline-md">Rincian Per Kategori</h4>
          <button className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-base">download</span>
            <span className="text-label-md">Unduh Laporan</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-on-surface-variant/60 text-label-sm uppercase tracking-wider border-b border-white/5">
                <th className="px-card-padding py-4 font-semibold">Kategori</th>
                <th className="px-card-padding py-4 font-semibold">Anggaran</th>
                <th className="px-card-padding py-4 font-semibold">Realisasi</th>
                <th className="px-card-padding py-4 font-semibold">Selisih</th>
                <th className="px-card-padding py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-label-md divide-y divide-white/5">
              {categoryData.map((cat) => (
                <CategoryRow key={cat.label} {...cat} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MutasiKas;
