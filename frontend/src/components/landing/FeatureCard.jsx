import React from 'react';

const FeatureCard = ({ icon, iconColor, hoverBorderColor, title, description, className = '' }) => {
  return (
    <div className={`bg-surface/40 backdrop-blur-[20px] border border-white/10 rounded-xl p-card-padding flex flex-col items-start hover:bg-surface/60 transition-colors duration-300 group ${className}`}>
      <div className={`w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 mb-stack-md ${hoverBorderColor} transition-colors`}>
        <span className={`material-symbols-outlined ${iconColor} text-[24px]`}>{icon}</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm text-[20px]">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
    </div>
  );
};

export default FeatureCard;
