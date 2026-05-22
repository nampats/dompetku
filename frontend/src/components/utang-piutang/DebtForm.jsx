import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import Modal from '../ui/Modal';

const DebtForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'utang',
    title: '',
    counterparty: '',
    totalAmount: '',
    dueDate: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', variant: 'error' });
  const { apiFetch } = useApiClient();

  const inputClass =
    'w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none placeholder:text-on-surface-variant/50';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    const val = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.totalAmount || !formData.counterparty) {
      setAlertModal({ isOpen: true, title: 'Validasi', message: 'Judul, Pihak Terkait, dan Nominal wajib diisi', variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const json = await apiFetch('/api/debts', {
        method: 'POST',
        body: {
          ...formData,
          dueDate: formData.dueDate || undefined,
        }
      });
      
      if (json.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setAlertModal({ isOpen: true, title: 'Gagal', message: json.message || 'Gagal menyimpan catatan', variant: 'error' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setAlertModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan catatan.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface border border-outline-variant/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
          <h2 className="font-headline-md text-headline-md text-on-surface">Catatan Baru</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex p-1 bg-surface-container-highest rounded-lg border border-outline-variant/20">
            <label className="flex-1 text-center cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="type"
                value="utang"
                checked={formData.type === 'utang'}
                onChange={handleChange}
              />
              <div className={`py-2 rounded-md font-label-md text-label-md transition-all ${formData.type === 'utang' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}>
                Utang (Saya Pinjam)
              </div>
            </label>
            <label className="flex-1 text-center cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="type"
                value="piutang"
                checked={formData.type === 'piutang'}
                onChange={handleChange}
              />
              <div className={`py-2 rounded-md font-label-md text-label-md transition-all ${formData.type === 'piutang' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant'}`}>
                Piutang (Orang Pinjam)
              </div>
            </label>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Judul Catatan</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Contoh: Pinjaman beli motor, Bayar makan" 
              type="text" 
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Pihak Terkait (Nama / Institusi)</label>
            <input 
              name="counterparty" 
              value={formData.counterparty} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Contoh: Budi, Bank BCA" 
              type="text" 
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Nominal Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">Rp</span>
              <input 
                name="totalAmount" 
                value={formData.totalAmount ? new Intl.NumberFormat('id-ID').format(formData.totalAmount) : ''} 
                onChange={handleAmountChange} 
                className={`${inputClass} pl-10`} 
                placeholder="0" 
                type="text" 
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Jatuh Tempo (Opsional)</label>
            <input 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange} 
              className={`${inputClass} [color-scheme:dark]`} 
              type="date" 
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Catatan Tambahan (Opsional)</label>
            <textarea 
              name="note" 
              value={formData.note} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Detail tambahan..." 
              rows="2"
            />
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
              className={`px-6 py-2 rounded-lg font-label-md text-label-md text-surface-container-lowest transition-colors shadow-lg shadow-primary/20 ${formData.type === 'utang' ? 'bg-primary hover:bg-primary-fixed-dim' : 'bg-secondary hover:bg-secondary-fixed-dim'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default DebtForm;
