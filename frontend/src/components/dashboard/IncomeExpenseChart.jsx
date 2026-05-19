import React from 'react';

const IncomeExpenseChart = ({ cashflow }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  // Create an array of 12 months with default 0
  const data = Array(12).fill().map((_, i) => ({ month: months[i], income: 0, expense: 0 }));

  let maxVal = 1;
  if (cashflow && cashflow.length > 0) {
    cashflow.forEach((item) => {
      const mIdx = parseInt(item.month) - 1;
      if (item.type === 'income') data[mIdx].income = parseFloat(item.total);
      if (item.type === 'expense') data[mIdx].expense = parseFloat(item.total);
    });
    maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense))) || 1;
  }

  // Only show up to current month or minimum 4 months
  const currentMonth = new Date().getMonth();
  const displayMonths = Math.max(4, currentMonth + 1);
  const chartData = data.slice(0, displayMonths);

  return (
    <div className="glass-card rounded-xl p-card-padding lg:col-span-2 flex flex-col min-h-[300px]">
      <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-6">Pemasukan vs Pengeluaran</h2>
      <div className="flex-grow flex items-end gap-2 sm:gap-4 px-2 sm:px-4 pb-4 border-b border-white/10">
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
            <div className="w-full max-w-[2rem] bg-secondary rounded-t-sm transition-all" style={{ height: `${(d.income / maxVal) * 100}%`, minHeight: d.income > 0 ? '4px' : '0' }}></div>
            <div className="w-full max-w-[2rem] bg-error rounded-t-sm transition-all" style={{ height: `${(d.expense / maxVal) * 100}%`, minHeight: d.expense > 0 ? '4px' : '0' }}></div>
            <span className="text-label-sm text-on-surface-variant">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-4 font-label-md text-label-md">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-secondary"></span> Pemasukan</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-error"></span> Pengeluaran</div>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
