import React from 'react';

const DebtCard = ({
  icon,
  iconColor,
  title,
  category,
  badge,
  badgeStyle,
  badgePulse,
  progressLabel,
  percentage,
  progressColor,
  progressGlow,
  amountLabel,
  currentAmount,
  totalAmount,
  amountColor,
  dueLabel,
  dueValue,
  dueColor,
  actionLabel,
  actionColor,
  actionIcon,
  hoverBorder,
  borderClass,
}) => {
  return (
    <div className={`glass-panel p-card-padding rounded-[28px] group ${hoverBorder || ''} ${borderClass || ''} transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className={`material-symbols-outlined ${iconColor} text-[32px]`}>{icon}</span>
          </div>
        </div>

        <div className="flex-1">
          {/* Title + Badge */}
          <div className="flex flex-wrap justify-between items-start mb-2">
            <div>
              <h4 className="font-headline-md text-headline-md text-white mb-1">{title}</h4>
              <p className="text-label-md text-on-surface-variant">Kategori: {category}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${badgeStyle} ${badgePulse ? 'animate-pulse' : ''}`}>
              {badge}
            </span>
          </div>

          {/* Progress */}
          <div className="my-6">
            <div className="flex justify-between text-label-md mb-2">
              <span className="text-on-surface-variant">{progressLabel}</span>
              <span className="text-white font-bold">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} ${progressGlow || ''}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Amount + Due Date */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase">{amountLabel}</p>
              <p className={`text-headline-md font-bold ${amountColor}`}>
                {currentAmount}
                {totalAmount && (
                  <span className="text-label-sm text-on-surface-variant font-normal"> / {totalAmount}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-label-sm text-on-surface-variant uppercase">{dueLabel}</p>
              <p className={`text-label-md font-bold ${dueColor || 'text-white'}`}>{dueValue}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button className={`flex-1 py-3 ${actionColor} font-bold rounded-xl active:scale-95 transition-transform`}>
              {actionLabel}
            </button>
            <button className="px-4 py-3 glass-panel rounded-xl text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">{actionIcon}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
