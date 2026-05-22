import React, { useState, useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import Modal from '../components/ui/Modal';

const IntegrationCard = ({ title, type, icon, iconColor, glowColor, description, actionLabel, actionIcon, enabled, onToggle, fields }) => {
  return (
    <div className="glass-panel rounded-xl p-card-padding flex flex-col relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
      
      <div className="flex items-start justify-between mb-stack-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30 shadow-inner">
            <span className={`material-symbols-outlined ${iconColor} text-[28px]`}>{icon}</span>
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface text-[20px]">{title}</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase tracking-wider mt-1">
              {type}
            </span>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input 
            type="checkbox" 
            checked={enabled}
            onChange={onToggle}
            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 z-10"
          />
          <label 
            className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-surface-variant'}`}
            onClick={onToggle}
          ></label>
        </div>
      </div>
      
      <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg relative z-10">
        {description}
      </p>
      
      <div className={`flex flex-col gap-stack-md mt-auto relative z-10 transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {fields.map((field, idx) => (
          <div key={idx}>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 opacity-80">{field.label}</label>
            <div className="relative">
              <input 
                type={field.type || 'text'} 
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={field.placeholder}
                className="w-full bg-surface-container-low/80 border border-outline-variant/30 text-on-surface rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-[0_0_0_1px_rgba(0,0,0,0)] focus:shadow-[0_0_0_1px_rgba(198,191,255,1)]"
              />
              {field.type === 'password' && (
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-primary">
                  visibility
                </span>
              )}
            </div>
          </div>
        ))}
        
        <button className="mt-4 w-full py-3 rounded-lg border border-primary/50 text-primary font-label-md text-label-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">{actionIcon}</span>
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('Integrasi');
  const [settings, setSettings] = useState({
    googleSheetsApiKey: '',
    googleSheetsSpreadsheetId: '',
    googleSheetsEnabled: false,
    telegramBotToken: '',
    telegramChatId: '',
    telegramEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', variant: 'info' });
  const { apiFetch } = useApiClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const json = await apiFetch('/api/settings');
        if (json.success && json.data) {
          setSettings(prev => ({ ...prev, ...json.data }));
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const json = await apiFetch('/api/settings', {
        method: 'PATCH',
        body: settings
      });
      if (json.success) {
        setAlertModal({ isOpen: true, title: 'Berhasil', message: 'Pengaturan berhasil disimpan!', variant: 'success' });
      } else {
        setAlertModal({ isOpen: true, title: 'Gagal', message: json.message || 'Gagal menyimpan pengaturan', variant: 'error' });
      }
    } catch (err) {
      console.error('Save settings error:', err);
      setAlertModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan pengaturan.', variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'Preferensi Aplikasi', icon: 'tune' },
    { id: 'Keamanan & Privasi', icon: 'lock' },
    { id: 'Notifikasi', icon: 'notifications_active' },
    { id: 'Integrasi', icon: 'api' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-gutter w-full animate-in fade-in duration-500">
      {/* Internal Settings Sidebar */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left w-full px-4 py-3 rounded-lg font-label-md text-label-md flex items-center gap-3 transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary-container/20 text-primary-fixed-dim font-bold border border-primary/20' 
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {tab.icon}
            </span>
            {tab.id}
          </button>
        ))}
      </aside>

      {/* Settings Content Area */}
      <div className="flex-1 flex flex-col gap-stack-lg">
        {activeTab === 'Integrasi' && (
          <>
            {/* Section Title */}
            <div className="mb-stack-sm">
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Integrasi Sistem</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Hubungkan DompetKu dengan layanan eksternal untuk otomasi pencatatan dan notifikasi real-time.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center p-8 text-on-surface-variant font-body-md">Memuat pengaturan...</div>
            ) : (
              <>
                {/* Bento Grid Layout for Integrations */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
                  <IntegrationCard 
                    title="Google Sheets"
                    type="Database Sync"
                    icon="description"
                    iconColor="text-secondary"
                    glowColor="bg-secondary/10"
                    description="Sinkronisasi otomatis setiap transaksi baru ke dalam spreadsheet pilihan Anda untuk analisis lebih lanjut."
                    actionLabel="Test Koneksi"
                    actionIcon="sync"
                    enabled={settings.googleSheetsEnabled}
                    onToggle={() => handleToggle('googleSheetsEnabled')}
                    fields={[
                      { label: 'Google API Key', placeholder: 'Masukkan API Key', name: 'googleSheetsApiKey', value: settings.googleSheetsApiKey, onChange: handleChange, type: 'password' },
                      { label: 'Spreadsheet ID', placeholder: 'Masukkan ID Sheet', name: 'googleSheetsSpreadsheetId', value: settings.googleSheetsSpreadsheetId, onChange: handleChange, type: 'text' }
                    ]}
                  />

                  <IntegrationCard 
                    title="Telegram Bot"
                    type="Notifikasi & Input"
                    icon="send"
                    iconColor="text-primary"
                    glowColor="bg-primary/10"
                    description="Terima alert transaksi mencurigakan dan catat pengeluaran instan langsung via chat Telegram."
                    actionLabel="Kirim Pesan Uji"
                    actionIcon="chat"
                    enabled={settings.telegramEnabled}
                    onToggle={() => handleToggle('telegramEnabled')}
                    fields={[
                      { label: 'Bot Token', placeholder: 'Masukkan Bot Token', name: 'telegramBotToken', value: settings.telegramBotToken, onChange: handleChange, type: 'password' },
                      { label: 'Chat ID', placeholder: 'Masukkan Chat ID', name: 'telegramChatId', value: settings.telegramChatId, onChange: handleChange, type: 'text' }
                    ]}
                  />
                </div>

                {/* Global Save Action */}
                <div className="mt-8 flex justify-end gap-4 border-t border-outline-variant/20 pt-6">
                  <button className="px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors">
                    Batal
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(198,191,255,0.3)] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        
        {activeTab === 'Preferensi Aplikasi' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Preferensi Aplikasi</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Sesuaikan tampilan dan format regional aplikasi.</p>
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl">
                <h4 className="font-headline-md text-headline-md mb-4 text-on-surface">Regional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-2">Mata Uang Dasar</label>
                    <select className="w-full bg-surface-container border border-outline-variant/30 text-on-surface rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>IDR (Rupiah Indonesia)</option>
                      <option>USD (US Dollar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-2">Zona Waktu</label>
                    <select className="w-full bg-surface-container border border-outline-variant/30 text-on-surface rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>WIB (Asia/Jakarta)</option>
                      <option>WITA (Asia/Makassar)</option>
                      <option>WIT (Asia/Jayapura)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Keamanan & Privasi' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Keamanan & Privasi</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Kelola kata sandi dan autentikasi multi-faktor.</p>
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl flex items-center justify-between border border-outline-variant/10">
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Autentikasi 2 Langkah (2FA)</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Gunakan aplikasi autentikator untuk keamanan ekstra.</p>
                </div>
                <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors">Aktifkan</button>
              </div>
              <div className="glass-panel p-6 rounded-xl flex items-center justify-between border border-outline-variant/10">
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Sesi Aktif</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Keluarkan akun dari semua perangkat lain.</p>
                </div>
                <button className="border border-error text-error hover:bg-error/10 px-5 py-2.5 rounded-lg font-label-md transition-colors">Logout Semua</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Notifikasi' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Pengaturan Notifikasi</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Pilih notifikasi apa saja yang ingin Anda terima.</p>
            <div className="space-y-4 glass-panel p-6 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="font-headline-md text-on-surface">Peringatan Anggaran</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">Saat pengeluaran melebihi 80% dari batas.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="font-headline-md text-on-surface">Ringkasan Mingguan</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">Laporan arus kas setiap hari Senin.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-headline-md text-on-surface">Notifikasi Login Baru</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">Email peringatan jika ada login tak dikenal.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
              </div>
            </div>
          </div>
        )}
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

export default Pengaturan;
