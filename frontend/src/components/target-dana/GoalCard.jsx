import React from 'react';

const GoalCard = ({
  icon,
  iconColor,
  iconBg,
  badge,
  badgeStyle,
  title,
  description,
  currentAmount,
  amountColor,
  targetAmount,
  percentage,
  progressBar,
  progressGlow,
  progressPulse,
  remaining,
}) => {
  return (
    <div className="glass-panel p-card-padding rounded-3xl flex flex-col relative overflow-hidden group hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
      {/* Background watermark icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-7xl">{icon}</span>
      </div>

      {/* Icon + Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        {badge && (
          <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${badgeStyle}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h4>
      <p className="text-on-surface-variant font-label-md text-label-md mb-6">{description}</p>

      {/* Progress Section */}
      <div className="mt-auto">
        <div className="flex justify-between items-end mb-2">
          <span className={`${amountColor} font-bold text-lg`}>{currentAmount}</span>
          <span className="text-on-surface-variant font-label-sm text-label-sm">Target: {targetAmount}</span>
        </div>

        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full ${progressBar} rounded-full relative ${progressGlow || ''}`}
            style={{ width: `${percentage}%` }}
          >
            {progressPulse && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {remaining}
          </span>
          <button className="bg-white/10 hover:bg-white/20 text-on-surface px-4 py-2 rounded-xl transition-all font-bold text-sm">
            Sisihkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
