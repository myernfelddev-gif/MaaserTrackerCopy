
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'לוח בקרה', icon: <LayoutDashboard size={20} /> },
    { path: '/groups', label: 'קבוצות', icon: <Users size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
