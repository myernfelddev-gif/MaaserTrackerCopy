import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { DateFilterState } from '../../types/index';
import { getDisplayLabel } from './dateUtils';

interface DateFilterPillV2Props {
  onClick: () => void;
  isOpen: boolean;
  dateFilter: DateFilterState;
}

const DateFilterPillV2: React.FC<DateFilterPillV2Props> = ({ onClick, isOpen, dateFilter }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
      
      <button 
        id="date-trigger-v2"
        onClick={onClick}
        className={`
          relative flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all border
          ${isOpen 
            ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-50' 
            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5'}
        `}
      >
        <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
          <Calendar size={20} />
        </div>
        
        <div className="flex flex-col items-start text-right min-w-[100px]">
          <span className={`text-[10px] font-black uppercase tracking-[0.05em] leading-none mb-1.5 opacity-60`}>
            טווח נתונים
          </span>
          <span className="text-[15px] font-extrabold leading-none tracking-tight">
            {getDisplayLabel(dateFilter)}
          </span>
        </div>

        <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isOpen ? 'bg-white/10' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
    </div>
  );
};

export default DateFilterPillV2;