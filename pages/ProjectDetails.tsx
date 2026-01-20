
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown, Clock, Search, Filter, MoreHorizontal } from 'lucide-react';
import StatCard from '../components/StatCard';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Mock project data
  const project = {
    id: projectId,
    name: 'קמפיין חורף 2024',
    description: 'פרסום מוצרי הלבשה בגוגל ופייסבוק. הקמפיין רץ לאורך כל חודשי החורף וכולל ניהול תקציב וקופירייטינג.',
    totalIncome: 50000,
    totalExpenses: 15000,
    netProfit: 35000,
    titheDue: 3500
  };

  // Mock transactions
  const transactions = [
    { id: '1', date: '2024-03-15', title: 'תשלום ראשון לקוח', type: 'INCOME', amount: 25000 },
    { id: '2', date: '2024-03-10', title: 'מודעות גוגל - שבוע 2', type: 'EXPENSE', amount: 7500 },
    { id: '3', date: '2024-03-05', title: 'תשלום שני לקוח', type: 'INCOME', amount: 25000 },
    { id: '4', date: '2024-03-01', title: 'מודעות פייסבוק - שבוע 1', type: 'EXPENSE', amount: 7500 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">{project.name}</h1>
          <p className="text-slate-500 max-w-2xl">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="הכנסות" value={formatCurrency(project.totalIncome)} icon={<TrendingUp size={20} />} color="green" />
        <StatCard label="הוצאות" value={formatCurrency(project.totalExpenses)} icon={<TrendingDown size={20} />} color="red" />
        <StatCard label="רווח נקי" value={formatCurrency(project.netProfit)} icon={<Clock size={20} />} color="indigo" />
        <StatCard label="מעשר" value={formatCurrency(project.titheDue)} icon={<Search size={20} />} color="amber" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800">פעולות אחרונות</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="חיפוש פעולה..." 
                className="pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-500 border rounded-xl hover:bg-slate-100">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">תאריך</th>
                <th className="px-8 py-4">תיאור</th>
                <th className="px-8 py-4 text-center">סוג</th>
                <th className="px-8 py-4">סכום</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                    {new Date(tx.date).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">
                    {tx.title}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`
                      inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase
                      ${tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {tx.type === 'INCOME' ? 'הכנסה' : 'הוצאה'}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-sm font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Clock size={40} />
            </div>
            <p className="text-slate-500 font-semibold">טרם בוצעו פעולות בפרויקט זה</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
