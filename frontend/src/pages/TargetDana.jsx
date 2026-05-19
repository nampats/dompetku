import React, { useState, useEffect } from 'react';
import GoalCard from '../components/target-dana/GoalCard';
import GoalForm from '../components/target-dana/GoalForm';

const TargetDana = () => {
  const [goalsData, setGoalsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/goals');
      const json = await res.json();

      if (json.success && json.data) {
        const formatted = json.data.map((goal) => {
          const target = parseFloat(goal.targetAmount) || 0;
          const current = parseFloat(goal.currentAmount) || 0;
          const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
          
          // Calculate remaining months
          let remainingText = '';
          if (goal.deadline) {
            const deadlineDate = new Date(goal.deadline);
            const now = new Date();
            const diffTime = deadlineDate.getTime() - now.getTime();
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
            if (diffMonths > 0) {
              remainingText = `Sisa ${diffMonths} bulan`;
            } else if (diffMonths === 0) {
              remainingText = 'Bulan ini';
            } else {
              remainingText = 'Lewat tenggat';
            }
          }

          // Determine badge based on percentage
          let badge = '';
          let badgeStyle = '';
          let progressBar = 'bg-primary';
          let amountColor = 'text-primary';

          if (percentage >= 100) {
            badge = 'Tercapai';
            badgeStyle = 'bg-secondary-container/10 text-secondary border border-secondary/20';
            progressBar = 'bg-gradient-to-r from-primary-container to-secondary';
            amountColor = 'text-secondary';
          } else if (percentage >= 80) {
            badge = 'Hampir Selesai';
            badgeStyle = 'bg-tertiary-container/10 text-tertiary';
            progressBar = 'bg-tertiary';
            amountColor = 'text-tertiary';
          }

          return {
            id: goal.id,
            icon: goal.icon || 'star',
            iconColor: goal.color ? `text-[${goal.color}]` : 'text-primary',
            iconBg: 'bg-surface-variant/50',
            badge,
            badgeStyle,
            title: goal.title,
            description: goal.description,
            currentAmount: `Rp ${current.toLocaleString('id-ID')}`,
            amountColor,
            targetAmount: `Rp ${target.toLocaleString('id-ID')}`,
            percentage,
            progressBar,
            remaining: remainingText,
          };
        });

        setGoalsData(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="space-y-stack-lg">
      {showForm && <GoalForm onClose={() => setShowForm(false)} onSuccess={fetchGoals} />}
      
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Mimpi &amp; Aspirasi</h3>
          <p className="text-on-surface-variant mt-2 font-body-md text-body-md max-w-lg">
            Kelola target keuanganmu dengan lebih teratur. Setiap langkah kecil membawamu lebih dekat ke impian.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Tambah Target</span>
        </button>
      </section>

      {/* Goals Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-on-surface-variant font-body-md glass-panel rounded-3xl">
            Memuat data target dana...
          </div>
        ) : goalsData.map((goal) => (
          <GoalCard key={goal.id} {...goal} />
        ))}

        {/* Empty State / Add New Card */}
        <div 
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-outline-variant/30 rounded-3xl flex flex-col items-center justify-center p-card-padding hover:border-primary/50 transition-all group cursor-pointer h-full min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary">add</span>
          </div>
          <p className="font-bold text-on-surface-variant group-hover:text-primary transition-colors">Buat Target Baru</p>
          <p className="text-on-surface-variant/60 font-label-sm text-label-sm text-center mt-2">
            Mulai menabung untuk mimpi lainnya
          </p>
        </div>
      </div>

      {/* Analytical Insight Section */}
      <section>
        <div className="glass-panel p-card-padding rounded-3xl border-l-4 border-l-secondary flex flex-col md:flex-row gap-6 items-center hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="w-20 h-20 flex-shrink-0 bg-secondary/10 rounded-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-4xl text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
          </div>
          <div className="flex-1">
            <h5 className="font-headline-md text-headline-md text-on-surface">Insight Tabungan</h5>
            <p className="text-on-surface-variant font-body-md text-body-md mt-1">
              Berdasarkan pendapatan bulan ini, kamu bisa mempercepat target <b>Dana Darurat</b> 1 bulan lebih awal jika menyisihkan tambahan Rp 500.000.
            </p>
          </div>
          <button className="bg-secondary-container/20 hover:bg-secondary-container/30 text-secondary font-bold px-6 py-3 rounded-xl transition-all whitespace-nowrap">
            Detail Insight
          </button>
        </div>
      </section>
    </div>
  );
};

export default TargetDana;
