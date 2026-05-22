import React, { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import Modal from '../ui/Modal';

const GoalForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: 'star',
    color: '#00CEC9' // default secondary color
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
    if (!formData.title || !formData.targetAmount) {
      setAlertModal({ isOpen: true, title: 'Validasi', message: 'Judul dan Target Nominal wajib diisi', variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const json = await apiFetch('/api/goals', {
        method: 'POST',
        body: {
          ...formData,
          deadline: formData.deadline || undefined,
          currentAmount: formData.currentAmount || undefined,
        }
      });
      
      if (json.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setAlertModal({ isOpen: true, title: 'Gagal', message: json.message || 'Gagal menyimpan target dana', variant: 'error' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setAlertModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan target dana.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = [
    '#6C5CE7', // Primary
    '#00CEC9', // Secondary
    '#FDCB6E', // Tertiary
    '#FF7675', // Error
    '#00B894', // Green
    '#0984E3', // Blue
  ];

  const icons = ['star', 'home', 'directions_car', 'school', 'flight', 'devices', 'favorite'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface border border-outline-variant/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
          <h2 className="font-headline-md text-headline-md text-on-surface">Target Dana Baru</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Judul Target</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Contoh: Dana Darurat, DP Rumah" 
              type="text" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Target Nominal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">Rp</span>
                <input 
                  name="targetAmount" 
                  value={formData.targetAmount ? new Intl.NumberFormat('id-ID').format(formData.targetAmount) : ''} 
                  onChange={handleAmountChange} 
                  className={`${inputClass} pl-10`} 
                  placeholder="0" 
                  type="text" 
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Saldo Awal (Opsional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">Rp</span>
                <input 
                  name="currentAmount" 
                  value={formData.currentAmount ? new Intl.NumberFormat('id-ID').format(formData.currentAmount) : ''} 
                  onChange={handleAmountChange} 
                  className={`${inputClass} pl-10`} 
                  placeholder="0" 
                  type="text" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Tenggat Waktu (Opsional)</label>
            <input 
              name="deadline" 
              value={formData.deadline} 
              onChange={handleChange} 
              className={`${inputClass} [color-scheme:dark]`} 
              type="date" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Ikon</label>
              <div className="flex flex-wrap gap-2">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      formData.icon === icon ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-surface-container text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Warna</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                  </button>
                ))}
              </div>
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

export default GoalForm;
