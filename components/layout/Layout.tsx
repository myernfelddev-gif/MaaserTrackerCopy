import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, User, LogOut, Calendar, History } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, logout } from '../../store';
import BottomNav from '../BottomNav';
import Header from './Header';
import { dashboardService } from '../../services/api';

const Layout: React.FC<{ children?: React.ReactNode }> = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, userId } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);

  // Trigger dashboard data call on login or filter change
  useEffect(() => {
    if (userId) {
      dashboardService.getDashboardData(userId);
    }
  }, [userId, dateFilter]);

  const menuItems = [
    { path: '/', label: 'לוח בקרה', icon: <LayoutDashboard size={20} /> },
    { path: '/groups', label: 'קבוצות ופרויקטים', icon: <Users size={20} /> },
    { path: '/activity-log', label: 'יומן פעולות', icon: <History size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Assistant']" dir="rtl">
      {/* Sidebar - Desktop & Tablet (md+) (Always Open) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-l border-slate-100 shadow-sm sticky top-0 h-screen z-40">
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
        <Header />

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-1 pb-32 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on md+) */}
      <BottomNav />
    </div>
  );
};

export default Layout;
