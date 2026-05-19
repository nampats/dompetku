import React from 'react';

const StockRow = ({ ticker, name, sector, avgBuy, currentPrice, lot, plValue, plPercent }) => {
  const isProfit = plValue >= 0;
  const colorClass = isProfit ? 'text-secondary' : 'text-error';
  const badgeBg = isProfit ? 'bg-secondary/10' : 'bg-error/10';
  const sign = isProfit ? '+' : '';

  const formatCurrency = (value) =>
    `Rp ${Math.abs(value).toLocaleString('id-ID')}`;

  return (
    <tr className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center font-bold text-primary text-label-sm">
            {ticker}
          </div>
          <div>
            <div className="font-semibold text-on-surface">{name}</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">{sector}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-right text-on-surface-variant">{formatCurrency(avgBuy)}</td>
      <td className="p-4 text-right text-on-surface">{formatCurrency(currentPrice)}</td>
      <td className="p-4 text-right text-on-surface-variant">{lot}</td>
      <td className={`p-4 text-right ${colorClass}`}>
        <div className="flex items-center justify-end gap-1">
          <span>{sign}{formatCurrency(plValue)}</span>
          <span className={`font-label-sm text-label-sm ${badgeBg} px-2 py-0.5 rounded-full`}>
            ({sign}{plPercent}%)
          </span>
        </div>
      </td>
    </tr>
  );
};

export default StockRow;
