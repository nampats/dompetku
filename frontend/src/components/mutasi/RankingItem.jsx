import React from 'react';

const RankingItem = ({ rank, label, amount, percentage, opacity = 100 }) => {
  const opacityClass = opacity < 100 ? `text-primary/${opacity}` : 'text-primary';
  const barOpacity = opacity < 100 ? `bg-primary/${opacity}` : 'bg-primary';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className={`font-bold ${opacityClass} italic text-lg`}>
            {String(rank).padStart(2, '0')}
          </span>
          <span className="text-label-md font-medium">{label}</span>
        </div>
        <span className="font-bold text-on-surface">{amount}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${barOpacity}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default RankingItem;
