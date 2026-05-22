import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import Modal from '../ui/Modal';

const StockForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ticker: '',
    name: '',
    sector: '',
    avgBuyPrice: '',
    currentPrice: '',
    lot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', variant: 'error' });
  const { apiFetch } = useApiClient();

  const inputClass =
    'w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none placeholder:text-on-surface-variant/50 uppercase';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'ticker' ? value.toUpperCase() : value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const val = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ticker || !formData.avgBuyPrice || !formData.lot) {
      setAlertModal({ isOpen: true, title: 'Validasi', message: 'Ticker, Harga Beli, dan Lot wajib diisi', variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const json = await apiFetch('/api/portfolio', {
        method: 'POST',
        body: {
          ...formData,
          name: formData.name || formData.ticker,
          currentPrice: formData.currentPrice || formData.avgBuyPrice,
          lot: parseInt(formData.lot)
        }
      });
      
      if (json.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setAlertModal({ isOpen: true, title: 'Gagal', message: json.message || 'Gagal menyimpan saham', variant: 'error' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setAlertModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan saham.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface border border-outline-variant/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
          <h2 className="font-headline-md text-headline-md text-on-surface">Tambah Saham</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Ticker</label>
              <input 
                name="ticker" 
                value={formData.ticker} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="BBCA" 
                type="text" 
                maxLength="4"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Lot</label>
              <input 
                name="lot" 
                value={formData.lot} 
                onChange={handleNumberChange} 
                className={inputClass.replace('uppercase', '')} 
                placeholder="10" 
                type="text" 
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Nama Perusahaan (Opsional)</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={inputClass.replace('uppercase', '')} 
              placeholder="Bank Central Asia Tbk" 
              type="text" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Harga Beli Rata-rata</label>
              <input 
                name="avgBuyPrice" 
                value={formData.avgBuyPrice ? new Intl.NumberFormat('id-ID').format(formData.avgBuyPrice) : ''} 
                onChange={handleNumberChange} 
                className={inputClass.replace('uppercase', '')} 
                placeholder="0" 
                type="text" 
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Harga Saat Ini</label>
              <input 
                name="currentPrice" 
                value={formData.currentPrice ? new Intl.NumberFormat('id-ID').format(formData.currentPrice) : ''} 
                onChange={handleNumberChange} 
                className={inputClass.replace('uppercase', '')} 
                placeholder="0" 
                type="text" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg font-label-md text-label-md text-primary border border-primary hover:bg-primary/10 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-label-md text-label-md text-surface-container-lowest bg-primary hover:bg-primary-fixed-dim transition-colors shadow-lg shadow-primary/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        variant={alertModal.variant}
      >
        {alertModal.message}
      </Modal>
    </div>
  );
};

export default StockForm;
