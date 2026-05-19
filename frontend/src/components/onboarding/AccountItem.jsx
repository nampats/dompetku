import React from 'react';

const AccountItem = ({ icon, iconBg, iconColor, name, type, balance }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <div>
          <p className="font-body-md text-body-md text-on-surface">{name}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-label-md text-label-md text-secondary">{balance}</p>
      </div>
    </div>
  );
};

export default AccountItem;
