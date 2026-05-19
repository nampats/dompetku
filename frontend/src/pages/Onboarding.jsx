import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProfilPenggunaComponent from '../components/onboarding/StepProfilPengguna';
import StepKoneksiAkunComponent from '../components/onboarding/StepKoneksiAkun';
import StepReviewKonfirmasiComponent from '../components/onboarding/StepReviewKonfirmasi';

const TOTAL_STEPS = 3;

const stepLabels = ['Profil Pengguna', 'Koneksi Akun', 'Review & Konfirmasi'];

/* ──────────────────────────────────────────────
   Step Components (placeholder — will be replaced
   with Stitch designs later)
   ────────────────────────────────────────────── */

/* Step 1 — imported from components/onboarding/StepProfilPengguna */
/* Step 2 — imported from components/onboarding/StepKoneksiAkun */
/* Step 3 — imported from components/onboarding/StepReviewKonfirmasi */


const STEPS = [StepProfilPenggunaComponent, StepKoneksiAkunComponent, StepReviewKonfirmasiComponent];

/* ──────────────────────────────────────────────
   Main Onboarding Page
   ────────────────────────────────────────────── */

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState({ displayName: '', avatarPreview: null });
  const [accounts, setAccounts] = useState([{ id: 1, name: '', type: 'Rekening Tabungan', balance: '' }]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step) => setCurrentStep(step);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  const CurrentStepComponent = STEPS[currentStep - 1];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop py-stack-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container/30 border border-primary/20 backdrop-blur-[10px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">DompetKu</span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Langkah {currentStep} dari {TOTAL_STEPS}
        </span>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10 flex items-center justify-center gap-3 px-container-padding-mobile md:px-container-padding-desktop py-4">
        {stepLabels.map((label, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <React.Fragment key={step}>
              {/* Connector line */}
              {idx > 0 && (
                <div className={`hidden md:block h-px flex-1 max-w-16 ${isComplete ? 'bg-primary' : 'bg-outline-variant/30'} transition-colors`}></div>
              )}
              <button
                onClick={() => goToStep(step)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-label-md font-label-md ${
                  isActive
                    ? 'bg-primary-container/20 text-primary border border-primary/30'
                    : isComplete
                    ? 'bg-white/5 text-primary/70 border border-transparent'
                    : 'bg-transparent text-on-surface-variant border border-transparent'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-label-sm font-bold ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : isComplete
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-variant/50 text-on-surface-variant'
                  }`}
                >
                  {isComplete ? (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  ) : (
                    step
                  )}
                </span>
                <span className="hidden md:inline">{label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <main className="relative z-10 flex-1 flex flex-col px-container-padding-mobile md:px-container-padding-desktop py-8 max-w-4xl mx-auto w-full">
        <CurrentStepComponent 
          prevStep={prevStep} 
          nextStep={nextStep} 
          profile={profile}
          setProfile={setProfile}
          accounts={accounts}
          setAccounts={setAccounts}
        />
      </main>

      {/* Navigation Footer */}
      {!isLastStep && (
        <footer className="relative z-10 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop py-stack-md border-t border-white/5">
          <button
            onClick={isFirstStep ? () => navigate('/login') : prevStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md font-bold transition-all text-on-surface-variant hover:text-primary hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Kembali
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-label-md text-label-md font-bold transition-all transform hover:-translate-y-0.5 bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-90"
          >
            <span>Lanjutkan</span>
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default Onboarding;
