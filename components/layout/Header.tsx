
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Settings2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setDateFilter } from '../../store';
import { DateFilterState } from '../../types';
import { getDisplayLabel } from './dateUtils';
import DateModal from './DateModal';

const Header: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { dateFilter } = useSelector((state: RootState) => state.ui);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'לוח בקרה';
    if (location.pathname.startsWith('/groups')) return 'קבוצות ופרויקטים';
    if (location.pathname.startsWith('/projects')) return 'פרטי פרויקט';
    return 'ניהול מעשרות';
  };

  const handleConfirmDate = (newFilter: DateFilterState) => {
    dispatch(setDateFilter(newFilter));
    setIsDateModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-[60] bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex flex-col justify-center h-[140px] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="lg:hidden w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Calendar size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-none tracking-tight">
              {getPageTitle()}
            </h2>
            <div className="relative inline-block">
              <button 
                id="date-trigger"
                onClick={() => setIsDateModalOpen(true)}
                className="flex items-center gap-2 group transition-all hover:bg-blue-50/50 px-2 py-1 -mx-2 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm md:text-base font-bold text-blue-600 uppercase tracking-wide border-b border-dashed border-blue-200 group-hover:border-blue-600 transition-colors">
                  {getDisplayLabel(dateFilter)}
                </span>
                <Settings2 size={16} className="text-blue-400 group-hover:text-blue-600 group-hover:rotate-45 transition-all" />
              </button>
              
              <DateModal 
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                currentFilter={dateFilter}
                onConfirm={handleConfirmDate}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action buttons area */}
        </div>
      </div>
    </header>
  );
};

export default Header;
