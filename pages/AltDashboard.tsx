
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Wallet, 
  Zap, 
  BarChart3, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import AltStatCard from '../components/alt/AltStatCard';
import AltQuickActions from '../components/alt/AltQuickActions';
import TransactionModal from '../components/TransactionModal';
import { TransactionType } from '../types';

const AltDashboard: React.FC = () => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: TransactionType | null }>({
    isOpen: false,
    type: null
  });

  const openModal = (type: TransactionType) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: null });

  // Mock data (same as original for consistency)
  const summary = {
    totalIncome: 150000,
    totalExpenses: 45000,
    totalDonations: 8500,
    netProfit: 105000,
    requiredTithe: 10500,
    balance: -2000
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/30 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-widest">
              <Zap size={14} className="animate-pulse" />
              מצב נוכחי בזמן אמת
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              הרווח הנקי שלך <br/> <span className="text-blue-500">{formatCurrency(summary.netProfit)}</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md">
              המערכת ניתחה את הנתונים שלך. כרגע יתרת המעשר שלך עומדת על {formatCurrency(Math.abs(summary.balance))} לזכותך.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700 flex flex-col items-center justify-center min-w-[240px]">
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <BarChart3 size={32} className="text-white" />
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-tighter text-xs mb-1">מעשר דרוש</p>
             <p className="text-4xl font-black">{formatCurrency(summary.requiredTithe)}</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AltStatCard 
          label="הכנסות ברוטו" 
          value={formatCurrency(summary.totalIncome)} 
          icon={<TrendingUp size={24} />} 
          trend="+12%"
          type="positive"
        />
        <AltStatCard 
          label="הוצאות תפעול" 
          value={formatCurrency(summary.totalExpenses)} 
          icon={<TrendingDown size={24} />} 
          trend="-4%"
          type="negative"
        />
        <AltStatCard 
          label="סך תרומות" 
          value={formatCurrency(summary.totalDonations)} 
          icon={<Heart size={24} />} 
          type="neutral"
        />
      </section>

      {/* Quick Actions */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">פעולות מהירות</h2>
          <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            כל הפעולות <ChevronLeft size={16} />
          </button>
        </div>
        <AltQuickActions onAction={openModal} />
      </section>

      {/* Security Tip */}
      <section className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 flex items-center gap-8 shadow-sm">
        <div className="hidden sm:flex w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl items-center justify-center shrink-0">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 mb-2">חישוב מדויק ומאובטח</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            כל הנתונים שלך מוצפנים ונשמרים באופן בטוח. חישוב המעשר נעשה באופן אוטומטי על פי הכללים שהגדרת, כדי שתוכל להתמקד בנתינה בראש שקט.
          </p>
        </div>
      </section>

      {modalState.type && (
        <TransactionModal 
          isOpen={modalState.isOpen} 
          onClose={closeModal} 
          type={modalState.type} 
        />
      )}
    </div>
  );
};

export default AltDashboard;
