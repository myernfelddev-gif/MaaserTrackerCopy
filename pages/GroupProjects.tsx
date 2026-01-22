
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Layout, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

const GroupProjects: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Mock group name based on ID
  const groupName = groupId === '1' ? 'שיווק דיגיטלי' : 'נדל״ן להשקעה';

  // Mock projects data
  const projects = [
    { 
      id: '101', 
      name: 'קמפיין חורף 2024', 
      description: 'פרסום מוצרי הלבשה בגוגל ופייסבוק', 
      totalIncome: 50000,
      totalExpenses: 15000,
      netProfit: 35000,
      titheDue: 3500
    },
    { 
      id: '102', 
      name: 'ייעוץ עסקי - חברת הייטק', 
      description: 'ליווי שיווקי חודשי', 
      totalIncome: 70000,
      totalExpenses: 20000,
      netProfit: 50000,
      titheDue: 5000
    },
  ];

  const onSubmit = (data: any) => {
    console.log('New project:', data);
    reset();
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/groups')}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">{groupName}</h1>
          <p className="text-slate-500">ניהול פרויקטים תחת קבוצת {groupName}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} /> פרויקט חדש
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Layout size={20} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">{project.name}</h3>
            <p className="text-slate-400 text-xs mb-6 line-clamp-2">{project.description}</p>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">רווח נקי</span>
                <span className="font-bold text-slate-800">{formatCurrency(project.netProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">מעשר</span>
                <span className="font-bold text-blue-600">{formatCurrency(project.titheDue)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <span className="text-blue-500 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                לפרטי פרויקט <ChevronLeft size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="הוספת פרויקט חדש">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">שם הפרויקט</label>
            <input 
              {...register('name', { required: true })}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="לדוגמה: בניית אתר לקוח"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">תיאור</label>
            <textarea 
              {...register('description')}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="תאר בקצרה את הפרויקט..."
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
          >
            צור פרויקט
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default GroupProjects;
