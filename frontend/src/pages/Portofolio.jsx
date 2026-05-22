import React, { useState, useEffect } from 'react';
import StockRow from '../components/portofolio/StockRow';
import StockForm from '../components/portofolio/StockForm';
import { useApiClient } from '../hooks/useApiClient';
import { useAuth } from '../context/AuthContext';

const Portofolio = () => {
  const { user } = useAuth();
  const [stockData, setStockData] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalValue: 0,
    totalPL: 0,
    plPercent: 0,
  });
  const { apiFetch } = useApiClient();

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const json = await apiFetch('/api/portfolio');
      if (json.success && json.data) {
          let totalCurrentValue = 0;
          let totalBuyValue = 0;

          const formatted = json.data.map((item) => {
            const avgBuy = parseFloat(item.avgBuyPrice) || 0;
            const currentPrice = parseFloat(item.currentPrice) || 0;
            const lot = item.lot || 0;
            
            const modal = avgBuy * lot * 100;
            const current = currentPrice * lot * 100;
            const plValue = current - modal;
            const plPercent = modal > 0 ? (plValue / modal) * 100 : 0;

            totalCurrentValue += current;
            totalBuyValue += modal;

            return {
              ticker: item.ticker,
              name: item.name,
              sector: item.sector || '-',
              avgBuy,
              currentPrice,
              lot,
              plValue,
              plPercent,
            };
          });

          const totalPL = totalCurrentValue - totalBuyValue;
          const plPercent = totalBuyValue > 0 ? (totalPL / totalBuyValue) * 100 : 0;

          setStockData(formatted);
          setSummary({
            totalValue: totalCurrentValue,
            totalPL,
            plPercent,
          });
        }
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);
  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Header Mobile */}
      <div className="md:hidden flex justify-between items-center pt-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">Portofolio</h1>
        <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30 flex items-center justify-center font-bold text-primary">
          {user?.image ? (
            <img
              alt={`Foto Profil ${user.name}`}
              className="w-full h-full object-cover"
              src={user.image}
            />
          ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : 'U'
          )}
        </div>
      </div>

      {/* Total Portofolio Card */}
      <section className="glass-panel rounded-xl p-card-padding flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-2">
            Total Portofolio
          </p>
          <h2 className="font-display text-display text-on-surface">
            Rp {summary.totalValue.toLocaleString('id-ID')}
          </h2>
        </div>
        <div className="text-right">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-2">
            Unrealized P/L
          </p>
          <div className={`flex items-center gap-2 justify-end ${summary.totalPL >= 0 ? 'text-secondary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-sm">
              {summary.totalPL >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span className="font-headline-md text-headline-md">
              {summary.totalPL >= 0 ? '+' : ''}Rp {summary.totalPL.toLocaleString('id-ID')}
            </span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm mt-1 ${
            summary.plPercent >= 0 
              ? 'bg-secondary/10 text-secondary' 
              : 'bg-error/10 text-error'
          }`}>
            {summary.plPercent > 0 ? '+' : ''}{summary.plPercent.toFixed(1)}%
          </div>
        </div>
      </section>

      {/* Stock Table */}
      <section className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="p-card-padding border-b border-white/10 flex justify-between items-center">
          <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Aset Saham</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-sm text-label-sm">
              Ekuitas
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-on-surface-variant font-label-md text-label-md opacity-80">
                <th className="p-4 font-medium">Ticker</th>
                <th className="p-4 font-medium text-right">Avg Buy</th>
                <th className="p-4 font-medium text-right">Harga Now</th>
                <th className="p-4 font-medium text-right">Lot</th>
                <th className="p-4 font-medium text-right">P/L (%)</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-on-surface-variant">Memuat data portofolio...</td>
                </tr>
              ) : stockData.length > 0 ? (
                stockData.map((stock) => (
                  <StockRow key={stock.ticker} {...stock} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-on-surface-variant">Belum ada aset saham.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-card-padding border-t border-white/10 flex justify-center mt-auto">
          <button onClick={() => setShowStockForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-primary to-inverse-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md font-bold shadow-lg hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(198,191,255,0.4)]">
            <span className="material-symbols-outlined">add</span>
            Tambah Saham
          </button>
        </div>
      </section>

      {showStockForm && (
        <StockForm 
          onClose={() => setShowStockForm(false)} 
          onSuccess={() => {
            setShowStockForm(false);
            fetchPortfolio();
          }} 
        />
      )}
    </div>
  );
};

export default Portofolio;
