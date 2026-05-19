import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/landing/FeatureCard';

const features = [
  {
    icon: 'contrast',
    iconColor: 'text-primary',
    hoverBorderColor: 'group-hover:border-primary/30',
    title: 'Dual Theme',
    description:
      'Dirancang secara default dengan mode gelap yang elegan, memberikan kenyamanan visual maksimal saat Anda memantau data finansial di malam hari.',
  },
  {
    icon: 'sync',
    iconColor: 'text-secondary',
    hoverBorderColor: 'group-hover:border-secondary/30',
    title: 'Google Sheets Sync',
    description:
      'Sinkronisasi otomatis dengan spreadsheet Anda. Data keuangan tetap berada dalam kendali Anda sepenuhnya, divisualisasikan dengan indah di sini.',
    className: 'md:translate-y-4',
  },
  {
    icon: 'trending_up',
    iconColor: 'text-tertiary',
    hoverBorderColor: 'group-hover:border-tertiary/30',
    title: 'Portofolio Saham',
    description:
      'Pantau pergerakan investasi dan aset saham Anda dengan grafik instan dan ringkasan performa yang mudah dipahami.',
  },
];

const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: '10s' }}
      ></div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop py-stack-md bg-transparent">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 backdrop-blur-[10px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">DompetKu</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-container-padding-mobile md:px-container-padding-desktop py-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center flex flex-col items-center mb-24">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container/50 border border-white/10 backdrop-blur-[20px] mb-stack-lg animate-float">
            <span
              className="material-symbols-outlined text-secondary text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monetization_on
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Premium Finance Dashboard
            </span>
          </div>

          <h1 className="font-display text-display text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-primary mb-stack-md leading-tight">
            Kelola Keuangan Lebih Cerdas
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg leading-relaxed">
            Dashboard premium dengan desain glassmorphism untuk memantau kekayaan Anda.
          </p>

          {/* CTA Button */}
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary-container font-label-md text-label-md font-bold shadow-[0_0_30px_rgba(108,92,231,0.3)] hover:shadow-[0_0_40px_rgba(108,92,231,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden mb-6"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span>Mulai Sekarang</span>
          </Link>

          <p className="font-label-md text-label-md text-on-surface-variant">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">
              Masuk
            </Link>
          </p>
        </section>

        {/* Features Bento Grid */}
        <section className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-stack-lg text-center border-t border-white/5 mt-auto">
        <p className="font-label-sm text-label-sm text-on-surface-variant/60">
          © 2024 DompetKu. Desain Sistem oleh UI Designer.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
