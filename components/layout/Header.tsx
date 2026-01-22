
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Settings2, ChevronDown, Activity } from 'lucide-react';
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

  const getPageInfo = () => {
    if (location.pathname === '/') {
      return {
        title: 'לוח בקרה',
        description: 'סיכום המאזן הפיננסי וסטטוס המעשרות בזמן אמת'
      };
    }
    if (location.pathname.startsWith('/groups')) {
      return {
        title: 'ניהול קבוצות',
        description: 'ארגון מקורות ההכנסה והפרויקטים תחת קטגוריות'
      };
    }
    if (location.pathname.startsWith('/projects')) {
      return {
        title: 'פירוט פרויקט',
        description: 'ניתוח מעמיק של תנועות כספיות והפרשות מעשר'
      };
    }
    return {
      title: 'מערכת מעשרות',
      description: 'ניהול חכם של כספי הצדקה והתרומות שלך'
    };
  };

  const { title, description } = getPageInfo();

  const handleConfirmDate = (newFilter: DateFilterState) => {
    dispatch(setDateFilter(newFilter));
    setIsDateModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-[60] h-[120px] flex items-center px-10 border-b border-slate-200/80 transition-all bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-blue-50/30 via-transparent to-indigo-50/30 -z-10 pointer-events-none" />

      <div className="w-full flex items-center justify-between">
        {/* Title & Context Section */}
        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            
            {/* Live Indicator (Improved "Updated just now") */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black text-green-700 uppercase tracking-wide">Live</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-lg">
            {description}
          </p>
        </div>

        {/* Action & Date Controls Section */}
        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
          {/* Enhanced Date Selector */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
            
            <button 
              id="date-trigger"
              onClick={() => setIsDateModalOpen(true)}
              className={`
                relative flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all border
                ${isDateModalOpen 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-50' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5'}
              `}
            >
              <div className={`p-2 rounded-xl transition-colors ${isDateModalOpen ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
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

              <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDateModalOpen ? 'bg-white/10' : 'bg-slate-50 text-slate-400'}`}>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-500 ${isDateModalOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </button>
            
            <DateModal 
              isOpen={isDateModalOpen}
              onClose={() => setIsDateModalOpen(false)}
              currentFilter={dateFilter}
              onConfirm={handleConfirmDate}
            />
          </div>

          {/* Quick Settings Action - Now visible on Tablet (md+) */}
          <button className="hidden md:flex p-4 text-slate-400 hover:text-blue-600 hover:bg-white hover:border-blue-200 border border-slate-200 rounded-2xl transition-all hover:shadow-md active:scale-95">
            <Activity size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
