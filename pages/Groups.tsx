
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import GroupCard from '../components/GroupCard';
import { useForm } from 'react-hook-form';
import { Group } from '../types/index';

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Mock groups data
  const groups: Group[] = [
    { 
      id: '1', 
      name: 'שיווק דיגיטלי', 
      description: 'פעילות שיווק, לידים ופרסום ממומן', 
      activeProjects: 3,
      totalIncome: 120000,
      totalExpenses: 35000,
      netProfit: 85000,
      titheDue: 8500
    },
    { 
      id: '2', 
      name: 'נדל״ן להשקעה', 
      description: 'ניהול נכסים והכנסות משכירות', 
      activeProjects: 1,
      totalIncome: 45000,
      totalExpenses: 12000,
      netProfit: 33000,
      titheDue: 3300
    },
  ];

  const onSubmit = (data: any) => {
    console.log('New group:', data);
    reset();
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">קבוצות</h1>
          <p className="text-slate-500">ניהול קטגוריות הפעילות שלך</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} /> קבוצה חדשה
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <GroupCard 
            key={group.id}
            group={group}
            onClick={() => navigate(`/groups/${group.id}`)}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="הוספת קבוצה חדשה">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">שם הקבוצה</label>
            <input 
              {...register('name', { required: true })}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="לדוגמה: עסק המזון שלי"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">תיאור</label>
            <textarea 
              {...register('description')}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="תאר בקצרה את הפעילות..."
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
          >
            צור קבוצה
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;
