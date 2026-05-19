import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    if (!email) {
      setError('Email wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({ name: name.trim(), email, password });
      if (res?.error) {
        const msg = res.error.message || 'Gagal mendaftarkan akun.';
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist')) {
          setError('Email sudah terdaftar. Silakan login.');
        } else {
          setError(msg);
        }
      } else {
        // Auto-login successful, redirect to onboarding
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      setError('Terjadi kesalahan server. Coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: '10s' }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop py-stack-md">
        <Link to="/landing" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 backdrop-blur-[10px] flex items-center justify-center group-hover:bg-primary-container/50 transition-all">
            <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">DompetKu</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-container-padding-mobile md:px-container-padding-desktop py-8">
        <div className="w-full max-w-[440px]">
          {/* Glass Card */}
          <div className="glass-panel rounded-[32px] p-8 md:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <header className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-secondary to-tertiary flex items-center justify-center shadow-lg shadow-secondary/20">
                  <span className="material-symbols-outlined text-on-primary text-[28px]">person_add</span>
                </div>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Daftar gratis dan mulai kelola keuangan Anda.
              </p>
            </header>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
                <p className="font-label-md text-label-md text-error">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="register-name">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">person</span>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    autoComplete="name"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="register-email">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="register-password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-12 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant/50 ml-1">
                  Gunakan kombinasi huruf, angka, dan simbol.
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="register-confirm-password">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock_reset</span>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password"
                    autoComplete="new-password"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/40"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-label-md text-label-md font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group
                  bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container hover:shadow-primary/30 hover:scale-[1.02] active:scale-95
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant/20" />
              <span className="font-label-sm text-label-sm text-on-surface-variant/50 uppercase tracking-wider">atau</span>
              <div className="flex-1 h-px bg-outline-variant/20" />
            </div>

            {/* Login Link */}
            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                Masuk
              </Link>
            </p>
          </div>

          {/* Back to Landing */}
          <div className="text-center mt-6">
            <Link
              to="/landing"
              className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant/60 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
