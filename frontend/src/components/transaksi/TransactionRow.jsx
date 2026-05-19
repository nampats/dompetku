import React from 'react';

const typeConfig = {
  expense: {
    bgColor: 'bg-error/10',
    textColor: 'text-error',
    borderColor: 'border-error/20',
    amountPrefix: '- ',
    label: 'Pengeluaran',
  },
  income: {
    bgColor: 'bg-secondary/10',
    textColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    amountPrefix: '+ ',
    label: 'Pemasukan',
  },
  transfer: {
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    borderColor: 'border-primary/20',
    amountPrefix: '',
    label: 'Transfer',
  },
};

const TransactionRow = ({ type, date, icon, title, category, from, to, amount }) => {
  const config = typeConfig[type] || typeConfig.expense;
  const amountColor = type === 'transfer' ? 'text-on-surface' : config.textColor;

  const formatCurrency = (value) => `Rp ${Math.abs(value).toLocaleString('id-ID')}`;

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer">
      {/* Tanggal */}
      <div className="col-span-1 md:col-span-2 order-1 md:order-none flex justify-between md:block w-full">
        <span className="font-label-sm text-label-sm text-on-surface-variant md:hidden">Tanggal:</span>
        <span className="font-body-md text-body-md text-on-surface">{date}</span>
      </div>

      {/* Detail */}
      <div className="col-span-1 md:col-span-3 flex items-center gap-3 order-3 md:order-none">
        <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center ${config.textColor} border ${config.borderColor} flex-shrink-0`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <div className="font-label-md text-label-md text-on-surface truncate">{title}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant md:hidden">{config.label}</div>
        </div>
      </div>

      {/* Kategori */}
      <div className="col-span-1 md:col-span-2 order-4 md:order-none hidden md:block">
        <span className="inline-block px-2 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/20">
          {category}
        </span>
      </div>

      {/* Sumber / Tujuan */}
      <div className="col-span-1 md:col-span-2 order-5 md:order-none hidden md:block">
        <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <span>{from}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
          <span>{to}</span>
        </div>
      </div>

      {/* Nominal */}
      <div className={`col-span-1 md:col-span-3 text-right order-2 md:order-none font-headline-md text-headline-md md:font-body-lg md:text-body-lg ${amountColor}`}>
        {config.amountPrefix}{formatCurrency(amount)}
      </div>
    </div>
  );
};

export default TransactionRow;
