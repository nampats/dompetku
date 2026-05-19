import React from 'react';

const CategoryRow = ({ icon, iconColor, iconBg, label, budget, actual, diff, diffColor, status, statusStyle, rowBg = '' }) => {
  return (
    <tr className={`${rowBg || 'hover:bg-white/5'} transition-colors`}>
      <td className="px-card-padding py-5 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor} text-lg`}>{icon}</span>
        </div>
        <span className="font-medium">{label}</span>
      </td>
      <td className="px-card-padding py-5">{budget}</td>
      <td className="px-card-padding py-5 font-bold">{actual}</td>
      <td className={`px-card-padding py-5 ${diffColor}`}>{diff}</td>
      <td className="px-card-padding py-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

export default CategoryRow;
