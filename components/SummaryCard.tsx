
import React from 'react';
import { Wallet, Calculator, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface SummaryCardProps {
  netProfit: number;
  requiredTithe: number;
  titheBalance: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ netProfit, requiredTithe, titheBalance }) => {
  // Normalize values: Round to 2 decimal places to match standard currency display.
  const normalizedBalance = Math.round(titheBalance * 100) / 100;

  const formatCurrency = (val: number) => {
    const cleanVal = Math.abs(val) < 0.005 ? 0 : val;
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(cleanVal);
  };

  const getStatusConfig = () => {
    if (normalizedBalance < 0) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        accent: 'text-red-600',
        label: 'יש להשלים תרומה',
        icon: <ArrowDownRight size={20} />
      };
    } else if (normalizedBalance > 0) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        label: 'תרומת יתר',
        icon: <ArrowUpRight size={20} />
      };
    }
    return {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      accent: 'text-slate-600',
      label: 'אין חובת מעשר',
      icon: <Info size={20} />
    };
  };

  const status = getStatusConfig();

  return (
    <div className={`col-span-1 md:col-span-3 rounded-[2.5rem] border-2 ${status.border} ${status.bg} p-8 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className={`p-2 rounded-xl bg-white shadow-sm ${status.accent}`}>
              <Wallet size={24} />
            </span>
            סיכום מאזן וזכויות
          </h2>
          <p className="text-slate-500 font-medium mr-12 -mt-1">תמונת מצב שקופה של הרווחים וחובת המעשר שלך</p>
        </div>
        
        <div className={`px-4 py-2 rounded-2xl bg-white border ${status.border} flex items-center gap-2 shadow-sm`}>
          <span className={`${status.accent}`}>
            {status.icon}
          </span>
          <span className={`font-black text-sm uppercase tracking-wide ${status.accent}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Separators for md+ (Tablet/Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/3 w-px h-12 bg-slate-200 -translate-y-1/2"></div>
        <div className="hidden md:block absolute top-1/2 left-2/3 w-px h-12 bg-slate-200 -translate-y-1/2"></div>

        <div className="flex flex-col">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Wallet size={14} /> רווח נקי
          </span>
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            {formatCurrency(netProfit)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Calculator size={14} /> חובת מעשר (10%)
          </span>
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            {formatCurrency(requiredTithe)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className={`font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2 ${status.accent}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse bg-current`}></div>
            יתרת מעשר נוכחית
          </span>
          <span className={`text-3xl font-black tracking-tight ${status.accent}`}>
            {formatCurrency(normalizedBalance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
