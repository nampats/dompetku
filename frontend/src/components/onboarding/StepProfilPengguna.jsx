import React, { useState, useRef } from 'react';

const StepProfilPengguna = ({ profile, setProfile }) => {
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfile((prev) => ({ ...prev, avatarPreview: event.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setProfile((prev) => ({ ...prev, displayName: e.target.value }));
    if (hasError) setHasError(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-4">
      <div className="w-full max-w-[480px]">
        <div className="glass-panel rounded-[32px] p-card-padding shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <header className="text-center mb-stack-lg">
            <div className="mb-stack-md flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[28px]">account_balance_wallet</span>
              </div>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Selamat Datang di DompetKu
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
              Mari mulai dengan melengkapi profil Anda.
            </p>
          </header>

          {/* Form */}
          <div className="space-y-stack-lg">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5 overflow-hidden">
                  {profile.avatarPreview ? (
                    <img
                      src={profile.avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                      <span className="font-label-sm text-label-sm">Unggah Foto</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-surface">
                  <span className="material-symbols-outlined text-on-primary text-[20px]">edit</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-stack-sm">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="display-name">
                Nama Tampilan
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
                <input
                  id="display-name"
                  type="text"
                  value={profile.displayName}
                  onChange={handleNameChange}
                  placeholder="Masukkan nama Anda"
                  className={`w-full bg-surface-container-lowest/50 border ${
                    hasError ? 'border-error' : 'border-outline-variant/30'
                  } rounded-2xl py-4 pl-12 pr-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40`}
                />
              </div>
              {hasError && (
                <p className="text-error font-label-sm text-label-sm ml-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  Nama tampilan wajib diisi.
                </p>
              )}
            </div>

            {/* Step Indicator (visual only) */}
            <div className="flex justify-center gap-2 pt-stack-sm">
              <div className="h-1.5 w-8 rounded-full bg-primary"></div>
              <div className="h-1.5 w-2 rounded-full bg-outline-variant/30"></div>
              <div className="h-1.5 w-2 rounded-full bg-outline-variant/30"></div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <p className="text-center mt-stack-lg font-label-sm text-label-sm text-on-surface-variant/60">
          Langkah 1 dari 3: Pengaturan Identitas
        </p>
      </div>
    </div>
  );
};

export default StepProfilPengguna;
