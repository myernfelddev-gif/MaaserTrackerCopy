import React, { useState, useEffect, useRef } from 'react';
import { DateFilterState, DateFilterType } from '../../types/index';
import { months, years, currentYear } from './dateUtils';
import { Calendar, Check, X } from 'lucide-react';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: DateFilterState;
  onConfirm: (filter: DateFilterState) => void;
}

const DateModal: React.FC<DateModalProps> = ({ isOpen, onClose, currentFilter, onConfirm }) => {
  const [tempFilter, setTempFilter] = useState<DateFilterState>(currentFilter);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempFilter(currentFilter);
    }
  }, [isOpen, currentFilter]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const trigger = document.getElementById('date-trigger');
      if (
        isOpen && 
        modalRef.current && 
        !modalRef.current.contains(event.target as Node) &&
        trigger && !trigger.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTypeChange = (type: DateFilterType) => {
    const newState: DateFilterState = { type };
    if (type === 'ANNUAL') Object.assign(newState, { year: currentYear });
    if (type === 'MONTHLY') Object.assign(newState, { year: currentYear, month: new Date().getMonth() + 1 });
    if (type === 'CUSTOM') {
      const today = new Date().toISOString().split('T')[0];
      Object.assign(newState, { startDate: today, endDate: today });
    }
    setTempFilter(newState);
  };

  const updateData = (updates: Partial<DateFilterState>) => {
    setTempFilter(prev => ({ ...prev, ...updates }));
  };

  const renderContent = () => {
    switch (tempFilter.type) {
      case 'ANNUAL':
        return (
          <div className="space-y-4 pt-2 block">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3">בחירת שנה</label>
              <div className="grid grid-cols-4 gap-2">
                {years.slice(0, 8).map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => updateData({ year: y })}
                    className={`py-2 px-1 rounded-xl text-sm font-bold transition-all border ${
                      tempFilter.year === y 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'MONTHLY':
        return (
          <div className="space-y-5 pt-2 block">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">שנה</label>
              <select 
                value={tempFilter.year || currentYear}
                onChange={(e) => updateData({ year: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">חודש</label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateData({ month: i + 1 })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      tempFilter.month === i + 1 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'CUSTOM':
        return (
          <div className="space-y-4 pt-2 block">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">מתאריך</label>
                <input 
                  type="date"
                  value={tempFilter.startDate || ''}
                  onChange={(e) => updateData({ startDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">עד תאריך</label>
                <input 
                  type="date"
                  value={tempFilter.endDate || ''}
                  onChange={(e) => updateData({ endDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 block">
            <p className="text-slate-500 font-bold text-sm">מציג את כל היסטוריית הנתונים</p>
          </div>
        );
    }
  };

  return (
    <div 
      ref={modalRef}
      className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <h3 className="font-black text-slate-800 tracking-tight">הגדרת טווח</h3>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Type Selector Tabs */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/30">
          {(['ALL', 'ANNUAL', 'MONTHLY', 'CUSTOM'] as DateFilterType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`
                flex-1 py-1.5 text-[10px] font-black rounded-xl transition-all
                ${tempFilter.type === type 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              {type === 'ALL' && 'הכל'}
              {type === 'ANNUAL' && 'שנתי'}
              {type === 'MONTHLY' && 'חודשי'}
              {type === 'CUSTOM' && 'מותאם'}
            </button>
          ))}
        </div>

        {/* Selection Area */}
        <div className="min-h-[140px]">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-slate-50">
          <button
            onClick={() => onConfirm(tempFilter)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-xs"
          >
            <Check size={16} />
            עדכן
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-slate-50 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all text-xs"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;
