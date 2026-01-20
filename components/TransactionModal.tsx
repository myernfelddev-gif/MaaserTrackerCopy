
import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { TransactionType } from '../types';
import { Banknote, Calendar as CalendarIcon, Tag, AlignLeft, LayoutGrid, Layers } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
}

// Mock data for dynamic population
const MOCK_GROUPS = [
  { id: '1', name: 'שיווק דיגיטלי' },
  { id: '2', name: 'נדל״ן להשקעה' },
];

const MOCK_PROJECTS = [
  { id: '101', groupId: '1', name: 'קמפיין חורף 2024' },
  { id: '102', groupId: '1', name: 'ייעוץ עסקי - חברת הייטק' },
  { id: '201', groupId: '2', name: 'בניין המושבה - תל אביב' },
  { id: '202', groupId: '2', name: 'דירת סטודיו - חיפה' },
];

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  // Watch the groupId field to filter projects dynamically
  const selectedGroupId = watch('groupId');
  const filteredProjects = MOCK_PROJECTS.filter(project => project.groupId === selectedGroupId);

  const getTitle = () => {
    switch (type) {
      case TransactionType.INCOME: return 'הוספת הכנסה חדשה';
      case TransactionType.EXPENSE: return 'תיעוד הוצאה';
      case TransactionType.DONATION: return 'תיעוד תרומה (מעשר)';
    }
  };

  const onSubmit = (data: any) => {
    console.log('Transaction added:', { ...data, type });
    reset();
    onClose();
  };

  const isFinancial = type === TransactionType.INCOME || type === TransactionType.EXPENSE;

  const colorClasses = {
    [TransactionType.INCOME]: 'bg-green-600 hover:bg-green-700 shadow-green-100',
    [TransactionType.EXPENSE]: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    [TransactionType.DONATION]: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isFinancial && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
                <Layers size={14} className="text-slate-400" />
                קבוצה
              </label>
              <select 
                {...register('groupId', { required: true })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
              >
                <option value="">בחר קבוצה...</option>
                {MOCK_GROUPS.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
                <LayoutGrid size={14} className="text-slate-400" />
                פרויקט
              </label>
              <select 
                {...register('projectId', { required: true })}
                disabled={!selectedGroupId}
                className={`
                  w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold 
                  ${!selectedGroupId ? 'text-slate-400 cursor-not-allowed opacity-60' : 'text-slate-700'}
                `}
              >
                {!selectedGroupId ? (
                  <option value="">בחר קבוצה תחילה...</option>
                ) : (
                  <>
                    <option value="">בחר פרויקט...</option>
                    {filteredProjects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              <Banknote size={14} className="text-slate-400" />
              סכום
            </label>
            <div className="relative">
              <input 
                type="number"
                step="0.01"
                {...register('amount', { required: true, min: 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-800 placeholder:font-normal"
                placeholder="0.00"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₪</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              <CalendarIcon size={14} className="text-slate-400" />
              תאריך
            </label>
            <input 
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              {...register('date', { required: true })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
            <Tag size={14} className="text-slate-400" />
            כותרת / תיאור קצר
          </label>
          <input 
            type="text"
            {...register('title', { required: true })}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
            placeholder="לדוגמה: תשלום עבור ייעוץ..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
            <AlignLeft size={14} className="text-slate-400" />
            הערות נוספות
          </label>
          <textarea 
            {...register('notes')}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-28 resize-none transition-all font-medium text-slate-600 placeholder:text-slate-300"
            placeholder="פרטים נוספים שיעזרו לך לזכור את הפעולה..."
          />
        </div>

        <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              ביטול
            </button>
            <button 
              type="submit"
              className={`
                flex-[2] py-4 px-6 rounded-2xl font-black text-white transition-all active:scale-[0.98] shadow-lg
                ${colorClasses[type]}
              `}
            >
              שמירת פעולה
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
