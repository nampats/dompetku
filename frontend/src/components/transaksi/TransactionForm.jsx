import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    fromAccountId: '',
    toAccountId: '',
    description: '',
    note: ''
  });

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/accounts')
        ]);
        const catJson = await catRes.json();
        const accJson = await accRes.json();
        
        if (catJson.success) setCategories(catJson.data);
        if (accJson.success) setAccounts(accJson.data);
      } catch (err) {
        console.error('Failed to fetch form options:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, amount: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert('Nominal dan catatan wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || undefined,
          fromAccountId: formData.fromAccountId || undefined,
          toAccountId: formData.toAccountId || undefined,
        })
      });
      const json = await res.json();
      if (json.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(json.message || 'Gagal menyimpan transaksi');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Terjadi kesalahan saat menyimpan transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'expense', label: 'Pengeluaran', activeClass: 'bg-error/20 text-error font-semibold' },
    { value: 'income', label: 'Pemasukan', activeClass: 'bg-secondary/20 text-secondary font-semibold' },
    { value: 'transfer', label: 'Transfer', activeClass: 'bg-primary/20 text-primary font-semibold' },
  ];

  const inputClass =
    'w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none placeholder:text-on-surface-variant/50';

  const filteredCategories = categories.filter(c => c.type === formData.type || c.type === 'both');

  return (
    <div className="glass-panel rounded-2xl p-card-padding animate-fade-in-down">
      {/* Header */}
      <div className="flex justify-between items-center mb-stack-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pencatatan Baru</h2>
        <button
          className="text-on-surface-variant hover:text-error transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" onSubmit={handleSubmit}>
        {/* Tipe Segmented Control */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex p-1 bg-surface-container-highest rounded-lg border border-outline-variant/20 mb-2">
          {typeOptions.map((opt) => (
            <label key={opt.value} className="flex-1 text-center cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="type"
                value={opt.value}
                checked={formData.type === opt.value}
                onChange={handleChange}
              />
              <div
                className={`py-2 rounded-md font-label-md text-label-md transition-all ${
                  formData.type === opt.value ? opt.activeClass : 'text-on-surface-variant'
                }`}
              >
                {opt.label}
              </div>
            </label>
          ))}
        </div>

        {/* Nominal */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Nominal</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">Rp</span>
            <input 
              name="amount"
              value={formData.amount ? new Intl.NumberFormat('id-ID').format(formData.amount) : ''}
              onChange={handleAmountChange}
              className={`${inputClass} pl-10`} 
              placeholder="0" 
              type="text" 
            />
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Tanggal</label>
          <input 
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`${inputClass} [color-scheme:dark]`} 
            type="date" 
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Kategori</label>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={`${inputClass} appearance-none`}>
            <option value="">Pilih Kategori</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Dari */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">
            {formData.type === 'income' ? 'Masuk Ke Rekening' : 'Dari Rekening/Dompet'}
          </label>
          <select name="fromAccountId" value={formData.fromAccountId} onChange={handleChange} className={`${inputClass} appearance-none`}>
            <option value="">Pilih Akun</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Ke (Tujuan) - Hanya untuk transfer */}
        {formData.type === 'transfer' && (
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Ke (Tujuan)</label>
            <select name="toAccountId" value={formData.toAccountId} onChange={handleChange} className={`${inputClass} appearance-none`}>
              <option value="">Pilih Akun</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Catatan / Description */}
        <div className={`col-span-1 md:col-span-2 ${formData.type === 'transfer' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
          <label className="block font-label-sm text-label-sm text-on-surface-variant opacity-80 mb-2">Deskripsi</label>
          <input 
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={inputClass} 
            placeholder="Detail transaksi..." 
            type="text" 
          />
        </div>

        {/* Actions */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
          <button
            className="px-6 py-2 rounded-lg font-label-md text-label-md text-primary border border-primary hover:bg-primary/10 transition-colors"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-label-md text-label-md text-surface-container-lowest bg-primary hover:bg-primary-fixed-dim transition-colors shadow-lg shadow-primary/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
