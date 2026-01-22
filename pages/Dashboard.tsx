
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Heart, Plus, Minus, Gift, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import SummaryCard from '../components/SummaryCard';
import TransactionModal from '../components/TransactionModal';
import { TransactionType } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { dashboardService } from '../services/api';

const Dashboard: React.FC = () => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: TransactionType | null }>({
    isOpen: false,
    type: null
  });

  const { userId } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);

  // Fetch dashboard data from API
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ['dashboard', userId, dateFilter],
    queryFn: () => dashboardService.getDashboardData(
      userId || '', 
      dateFilter.startDate || '', 
      dateFilter.endDate || ''
    ),
    enabled: !!userId,
  });

  const openModal = (type: TransactionType) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: null });

  // Extract dashboard data from the specified path: result.data.dashboard
  const apiDashboard = dashboardResponse?.data?.dashboard;

  // Map API fields correctly to dashboard UI fields
  const summary = {
    totalIncome: apiDashboard?.totalIncoms || 0,
    totalExpenses: apiDashboard?.totalExpense || 0,
    totalDonations: apiDashboard?.totalDonation || 0,
    netProfit: apiDashboard?.netProfit || 0,
    requiredTithe: apiDashboard?.requiredTithe || 0,
    titheBalance: apiDashboard?.titheBalance || 0
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <Loader2 size={48} className="animate-spin text-blue-500" />
        <p className="font-bold text-lg">טוען נתונים מהשרת...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">סיכום נתונים</h1>
          <p className="text-slate-500">סקירה כללית של המצב הכלכלי והמעשרות שלך</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openModal(TransactionType.INCOME)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md shadow-green-100 transition-all active:scale-95"
          >
            <Plus size={18} /> הכנסה
          </button>
          <button 
            onClick={() => openModal(TransactionType.EXPENSE)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-100 transition-all active:scale-95"
          >
            <Minus size={18} /> הוצאה
          </button>
          <button 
            onClick={() => openModal(TransactionType.DONATION)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
          >
            <Gift size={18} /> תרומה
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SummaryCard now fills all 3 columns on Tablet/Desktop (md+) */}
        <SummaryCard 
          netProfit={summary.netProfit}
          requiredTithe={summary.requiredTithe}
          titheBalance={summary.titheBalance}
        />
        <StatCard 
          label="סה״כ הכנסות" 
          value={formatCurrency(summary.totalIncome)} 
          icon={<TrendingUp size={24} />} 
          color="green" 
        />
        <StatCard 
          label="סה״כ הוצאות" 
          value={formatCurrency(summary.totalExpenses)} 
          icon={<TrendingDown size={24} />} 
          color="red" 
        />
        <StatCard 
          label="תרומות שבוצעו" 
          value={formatCurrency(summary.totalDonations)} 
          icon={<Heart size={24} />} 
          color="blue" 
        />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">טיפ לניהול מעשרות</h2>
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full shrink-0">
            <Heart size={20} />
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            חישוב המעשר מתבצע על בסיס הרווח הנקי שלך (הכנסות פחות הוצאות). 
            המערכת עוקבת אחר כל הפרויקטים שלך ומספקת לך תמונת מצב מדויקת כדי שתדע תמיד כמה נשאר לך לתרום לצדקה.
          </p>
        </div>
      </div>

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

export default Dashboard;
