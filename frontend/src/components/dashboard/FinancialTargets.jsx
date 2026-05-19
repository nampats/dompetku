import React, { useState, useEffect } from 'react';

const FinancialTargets = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/goals');
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = json.data.slice(0, 2).map((goal) => {
            const target = parseFloat(goal.targetAmount) || 0;
            const current = parseFloat(goal.currentAmount) || 0;
            const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            return {
              id: goal.id,
              title: goal.title,
              icon: goal.icon || 'star',
              color: goal.color ? `text-[${goal.color}] bg-[${goal.color}]` : 'text-primary bg-primary',
              textColor: goal.color ? `text-[${goal.color}]` : 'text-primary',
              bgColor: goal.color ? `bg-[${goal.color}]` : 'bg-primary',
              percentage: Math.round(percentage)
            };
          });
          setGoals(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div className="glass-card rounded-xl p-card-padding flex flex-col gap-4">
      <h2 className="font-label-sm text-label-sm text-on-surface-variant opacity-80 uppercase tracking-wider mb-2">Target Dana</h2>
      
      {isLoading ? (
        <div className="text-center text-on-surface-variant text-label-sm py-4">Memuat data...</div>
      ) : goals.length > 0 ? (
        goals.map((goal) => (
          <div key={goal.id} className="bg-surface-container/50 rounded-lg p-4 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined ${goal.textColor}`}>{goal.icon}</span>
                <span className="font-body-md font-semibold text-on-surface">{goal.title}</span>
              </div>
              <span className={`font-label-md ${goal.textColor}`}>{goal.percentage}%</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className={`h-1.5 rounded-full ${goal.bgColor}`} style={{ width: `${goal.percentage}%` }}></div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-on-surface-variant text-label-sm py-4">Belum ada target dana.</div>
      )}
    </div>
  );
};

export default FinancialTargets;
