
import React from 'react';
import { FolderOpen, MoreVertical, ChevronLeft } from 'lucide-react';
import { Group } from '../types/index';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
  formatCurrency: (val: number) => string;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick, formatCurrency }) => {
console.log(group)
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <FolderOpen size={24} />
        </div>
        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-1">{group.name}</h3>
        <p className="text-slate-500 text-sm">{group.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">פרויקטים פעילים</p>
          <p className="font-extrabold text-slate-700">{group.activeProjects}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">מעשר מצטבר</p>
          <p className="font-extrabold text-blue-700">{formatCurrency(group.titheDue)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-slate-400 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span>רווח נקי:</span>
          <span className="text-slate-700">{formatCurrency(group.netProfit)}</span>
        </div>
        <ChevronLeft size={18} className="text-blue-500 group-hover:translate-x-[-4px] transition-transform" />
      </div>
    </div>
  );
};

export default GroupCard;
