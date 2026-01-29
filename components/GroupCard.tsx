
import React from 'react';
import { FolderOpen, MoreVertical, ChevronLeft, ArrowUpRight, ArrowDownRight, Target, Calculator, Wallet } from 'lucide-react';
import { Group } from '../types/group';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  formatCurrency: (val: number) => string;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, formatCurrency }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col shadow-sm"
    >
      {/* Header: Identity & Actions */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-2xl transition-colors border border-slate-100">
            <FolderOpen size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-0.5">{group.name}</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Target size={10} />
                {group.projectCount} פרויקטים
              </span>
            </div>
          </div>
        </div>
        <button 
          className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Hero Metric: Net Profit */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <Wallet size={14} />
          <span className="text-[11px] font-black uppercase tracking-widest">רווח נקי כולל</span>
        </div>
        <p className="text-4xl font-black text-slate-900 tracking-tighter">
          {formatCurrency(group.netProfit)}
        </p>
      </div>

      {/* Financial Split: Income & Expenses */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
            <ArrowUpRight size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">הכנסות</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{formatCurrency(group.totalIncome)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-100/50">
          <div className="flex items-center gap-1.5 text-rose-600 mb-1">
            <ArrowDownRight size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">הוצאות</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{formatCurrency(group.totalExpense)}</p>
        </div>
      </div>

      {/* Secondary Metric: Tithe */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
            <Calculator size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">חובת מעשר מצטבר</p>
            <p className="text-lg font-black text-blue-700 leading-none">{formatCurrency(group.requiredTithe)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-blue-600 font-black text-sm group-hover:gap-3 transition-all">
          <span>ניהול</span>
          <ChevronLeft size={18} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
