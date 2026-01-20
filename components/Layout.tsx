
import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { LayoutDashboard, Users, User, LogOut, Calendar, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, logout, setDateFilter } from '../store';
import { DateFilterType } from '../types';
import BottomNav from './BottomNav';

const Layout: React.FC<{ children?: React.ReactNode }> = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);

  const menuItems = [
    { path: '/', label: 'לוח בקרה', icon: <LayoutDashboard size={20} /> },
    { path: '/groups', label: 'קבוצות ופרויקטים', icon: <Users size={20} /> },
  ];

  const getPageTitle = () => {
    if (location.pathname === '/') return 'לוח בקרה';
    if (location.pathname.startsWith('/groups')) return 'קבוצות ופרויקטים';
    if (location.pathname.startsWith('/projects')) return 'פרטי פרויקט';
    return 'ניהול מעשרות';
  };

  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleFilterTypeChange = (type: DateFilterType) => {
    const newState = { type };
    if (type === 'ANNUAL') Object.assign(newState, { year: currentYear });
    if (type === 'MONTHLY') Object.assign(newState, { year: currentYear, month: new Date().getMonth() + 1 });
    if (type === 'CUSTOM') Object.assign(newState, { startDate: '', endDate: '' });
    dispatch(setDateFilter(newState));
  };

  const updateFilterData = (updates: Partial<typeof dateFilter>) => {
    dispatch(setDateFilter({ ...dateFilter, ...updates }));
  };

  const renderDateDetails = () => {
    switch (dateFilter.type) {
      case 'ANNUAL':
        return (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-xs font-bold text-slate-400">שנה:</span>
            <select 
              value={dateFilter.year || currentYear}
              onChange={(e) => updateFilterData({ year: parseInt(e.target.value) })}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        );
      case 'MONTHLY':
        return (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">חודש:</span>
              <select 
                value={dateFilter.month || new Date().getMonth() + 1}
                onChange={(e) => updateFilterData({ month: parseInt(e.target.value) })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">שנה:</span>
              <select 
                value={dateFilter.year || currentYear}
                onChange={(e) => updateFilterData({ year: parseInt(e.target.value) })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        );
      case 'CUSTOM':
        return (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">מ-</span>
              <input 
                type="date"
                value={dateFilter.startDate || ''}
                onChange={(e) => updateFilterData({ startDate: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">עד-</span>
              <input 
                type="date"
                value={dateFilter.endDate || ''}
                onChange={(e) => updateFilterData({ endDate: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      default:
        return <span className="text-xs font-bold text-slate-400 italic">מציג את כל היסטוריית הנתונים</span>;
    }
  };

  const getDisplayLabel = () => {
    if (dateFilter.type === 'ALL') return 'כל הזמן';
    if (dateFilter.type === 'ANNUAL') return `שנת ${dateFilter.year || currentYear}`;
    if (dateFilter.type === 'MONTHLY') return `${months[(dateFilter.month || 1) - 1]} ${dateFilter.year || currentYear}`;
    if (dateFilter.type === 'CUSTOM') return `${dateFilter.startDate || '?'} - ${dateFilter.endDate || '?'}`;
    return '';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Assistant']" dir="rtl">
      {/* Sidebar - Desktop Only (Always Open) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-slate-100 shadow-sm sticky top-0 h-screen z-40">
        <div className="p-8">
          <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2 tracking-tight">
            <span>מעשרות</span>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Calendar size={18} />
            </div>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 translate-x-[-4px]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-6">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-slate-800 truncate text-sm">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 px-5 py-4 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>התנתקות</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Calendar size={20} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{getPageTitle()}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                   <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">{getDisplayLabel()}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center bg-slate-100 rounded-2xl p-1.5 shadow-inner border border-slate-200/50">
              {(['ALL', 'ANNUAL', 'MONTHLY', 'CUSTOM'] as DateFilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterTypeChange(type)}
                  className={`
                    px-4 py-2 text-xs font-black rounded-xl transition-all duration-300
                    ${dateFilter.type === type 
                      ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200/50' 
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

            {/* User profile on mobile header */}
            <div className="lg:hidden flex items-center gap-2">
               <button onClick={() => dispatch(logout())} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                 <LogOut size={18} />
               </button>
            </div>
          </div>

          {/* Date Selection Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-slate-50">
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
                {renderDateDetails()}
             </div>
             
             {/* Mobile Filter Toggles (Horizontal Scrollable) */}
             <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
               {(['ALL', 'ANNUAL', 'MONTHLY', 'CUSTOM'] as DateFilterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterTypeChange(type)}
                    className={`
                      whitespace-nowrap px-4 py-2 text-[10px] font-black rounded-xl transition-all
                      ${dateFilter.type === type ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}
                    `}
                  >
                    {type === 'ALL' && 'הכל'}
                    {type === 'ANNUAL' && 'שנתי'}
                    {type === 'MONTHLY' && 'חודשי'}
                    {type === 'CUSTOM' && 'מותאם'}
                  </button>
                ))}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-1 pb-32 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
