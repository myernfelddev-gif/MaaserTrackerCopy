
import React from 'react';

interface AltStatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  type?: 'positive' | 'negative' | 'neutral';
}

const AltStatCard: React.FC<AltStatCardProps> = ({ label, value, icon, trend, type = 'neutral' }) => {
  const getStyles = () => {
    switch (type) {
      case 'positive': return 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5';
      case 'negative': return 'border-rose-500/20 text-rose-500 bg-rose-500/5';
      default: return 'border-slate-500/20 text-slate-500 bg-slate-500/5';
    }
  };

  return (
    <div className="relative group overflow-hidden bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-500/10">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all"></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="p-3 bg-slate-800 rounded-2xl inline-flex text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            {icon}
          </div>
          <h4 className="text-slate-400 font-bold text-sm tracking-wide">{label}</h4>
        </div>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStyles()}`}>
            {trend}
          </div>
        )}
      </div>

      <div className="mt-8 relative z-10">
        <p className="text-4xl font-black text-white tracking-tight drop-shadow-sm">{value}</p>
      </div>
    </div>
  );
};

export default AltStatCard;
