import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { TransactionType } from '../types';
import { Banknote, Calendar as CalendarIcon, Tag, AlignLeft, LayoutGrid, Layers, Loader2, AlertCircle } from 'lucide-react';
import { groupService } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
}

interface ApiProject {
  id: string;
  name: string;
}

interface ApiGroup {
  id: string;
  name: string;
  projects: ApiProject[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { userId } = useSelector((state: RootState) => state.auth);
  
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isFinancial = type === TransactionType.INCOME || type === TransactionType.EXPENSE;

  // Set default values when modal opens or type changes
  useEffect(() => {
    if (isOpen) {
      const defaultTitle = 
        type === TransactionType.INCOME ? "הכנסה" : 
        type === TransactionType.EXPENSE ? "הוצאה" : "תרומה";
      
      reset({
        title: defaultTitle,
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        groupId: '',
        projectId: ''
      });
    }
  }, [isOpen, type, reset]);

  // Fetch groups and projects from API when modal opens for INCOME/EXPENSE
  useEffect(() => {
    if (isOpen && userId && isFinancial) {
      setIsLoading(true);
      setHasError(false);
      groupService.fetchUserGroupsWithProjects(userId)
        .then(response => {
          const fetchedGroups = response?.data?.rows?.[0]?.groups || [];
          setGroups(fetchedGroups);
        })
        .catch(error => {
          console.error('API Error (o_fetch_user_groups_with_projects):', error);
          setHasError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!isOpen) {
      setGroups([]);
      setHasError(false);
    }
  }, [isOpen, userId, type, isFinancial]);

  // Watch the groupId field to filter projects dynamically
  const selectedGroupId = watch('groupId');
  
  const filteredProjects = useMemo(() => {
    if (!selectedGroupId) return [];
    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    return selectedGroup?.projects || [];
  }, [selectedGroupId, groups]);

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

  const colorClasses = {
    [TransactionType.INCOME]: 'bg-green-600 hover:bg-green-700 shadow-green-100',
    [TransactionType.EXPENSE]: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    [TransactionType.DONATION]: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
  };

  const noGroupsAvailable = isFinancial && !isLoading && groups.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isFinancial && (
          <>
            {noGroupsAvailable && !hasError && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 text-sm font-bold animate-in fade-in">
                <AlertCircle size={18} />
                <span>לא נמצאו קבוצות פעילות. יש ליצור קבוצה ופרויקט לפני הוספת תנועה.</span>
              </div>
            )}

            {hasError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in">
                <AlertCircle size={18} />
                <span>שגיאה בטעינת נתונים מהשרת. נסה שנית מאוחר יותר.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
                  <Layers size={14} className="text-slate-400" />
                  קבוצה
                </label>
                <div className="relative">
                  <select 
                    {...register('groupId', { required: isFinancial })}
                    disabled={isLoading || noGroupsAvailable}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.groupId ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none disabled:opacity-50`}
                  >
                    <option value="">{isLoading ? 'טוען קבוצות...' : 'בחר קבוצה...'}</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  {isLoading && (
                    <div className="absolute left-10 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
                  <LayoutGrid size={14} className="text-slate-400" />
                  פרויקט
                </label>
                <select 
                  {...register('projectId', { required: isFinancial })}
                  disabled={!selectedGroupId || isLoading || noGroupsAvailable}
                  className={`
                    w-full px-4 py-3 bg-slate-50 border ${errors.projectId ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold 
                    ${(!selectedGroupId || isLoading || noGroupsAvailable) ? 'text-slate-400 cursor-not-allowed opacity-60' : 'text-slate-700'}
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
          </>
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
                disabled={noGroupsAvailable && isFinancial}
                {...register('amount', { 
                  required: true, 
                  min: 0.01 // Ensures only positive numbers
                })}
                onWheel={(e) => e.currentTarget.blur()} // Prevents changing value via mouse wheel
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.amount ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-800 placeholder:font-normal disabled:opacity-50`}
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
              disabled={noGroupsAvailable && isFinancial}
              {...register('date', { required: true })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 disabled:opacity-50"
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
            disabled={noGroupsAvailable && isFinancial}
            {...register('title', { required: true })}
            className={`w-full px-5 py-3 bg-slate-50 border ${errors.title ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50`}
            placeholder="לדוגמה: תשלום עבור ייעוץ..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider px-1">
            <AlignLeft size={14} className="text-slate-400" />
            הערות נוספות
          </label>
          <textarea 
            {...register('description')}
            disabled={noGroupsAvailable && isFinancial}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-28 resize-none transition-all font-medium text-slate-600 placeholder:text-slate-300 disabled:opacity-50"
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
              disabled={isLoading || (noGroupsAvailable && isFinancial)}
              className={`
                flex-[2] py-4 px-6 rounded-2xl font-black text-white transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                ${colorClasses[type]}
              `}
            >
              {isLoading ? 'טוען...' : 'שמירת פעולה'}
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;