
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Heart, Wallet, Calculator, ArrowUpRight, Plus, Minus, Gift } from 'lucide-react';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';
import { TransactionType } from '../types';

const Dashboard: React.FC = () => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: TransactionType | null }>({
    isOpen: false,
    type: null
  });

  const openModal = (type: TransactionType) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: null });

  // Mock data for display
  const summary = {
    totalIncome: 150000,
    totalExpenses: 45000,
    totalDonations: 8500,
    netProfit: 105000,
    requiredTithe: 10500,
    balance: -2000 // negative means debt (needs to donate)
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(val);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <StatCard 
          label="רווח נקי" 
          value={formatCurrency(summary.netProfit)} 
          icon={<Wallet size={24} />} 
          color="indigo" 
        />
        <StatCard 
          label="חובת מעשר (10%)" 
          value={formatCurrency(summary.requiredTithe)} 
          icon={<Calculator size={24} />} 
          color="amber" 
        />
        <StatCard 
          label="יתרת מעשר נוכחית" 
          value={formatCurrency(Math.abs(summary.balance))} 
          icon={<ArrowUpRight size={24} className={summary.balance < 0 ? 'rotate-90' : ''} />} 
          color={summary.balance < 0 ? 'amber' : 'green'} 
          description={summary.balance < 0 ? 'יתרה לתרומה' : 'תרומת יתר'}
        />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">טיפ לניהול מעשרות</h2>
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full shrink-0">
            <Calculator size={20} />
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
