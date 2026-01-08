import React from 'react';

interface ResultCardProps {
  title: string;
  amount: number;
  currency: string;
  colorClass: string;
  icon: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, amount, currency, colorClass, icon }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${colorClass} transition-transform duration-300 hover:scale-[1.02] shadow-sm`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">
            {currency} {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h3>
        </div>
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
      {/* Decorative background circle */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
};
