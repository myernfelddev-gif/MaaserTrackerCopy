
import React, { useState } from 'react';
import { FolderOpen, MoreVertical, ChevronLeft, ArrowUpRight, ArrowDownRight, Target, Calculator, Wallet, Edit2, Trash2 } from 'lucide-react';
import { Group } from '../types/group';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  formatCurrency: (val: number) => string;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, formatCurrency }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // No functionality as per request
    setShowMenu(false);
  };

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
        
        <div className="relative">
          <button 
            className={`p-2 transition-colors rounded-xl ${showMenu ? 'bg-slate-100 text-slate-600' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'}`}
            onClick={handleMenuToggle}
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              {/* Invisible backdrop to close menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} 
              />
              <div 
                className="absolute left-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={handleActionClick}
                  className="w-full px-4 py-2.5 text-right text-xs font-black text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={14} className="text-slate-400" />
                  עריכה
                </button>
                <button 
                  onClick={handleActionClick}
                  className="w-full px-4 py-2.5 text-right text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-50"
                >
                  <Trash2 size={14} className="text-red-400" />
                  מחיקה
                </button>
              </div>
            </>
          )}
        </div>
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
