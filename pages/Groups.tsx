
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import GroupCard from '../components/GroupCard';
import DeleteGroupModal from '../components/DeleteGroupModal';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setGroups } from '../store';
import { groupService } from '../services/api';
import { Group } from '../types/group';

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const { userId } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);
  const groupsFromRedux = useSelector((state: RootState) => state.groups.groups);

  useEffect(() => {
    if (editingGroup) {
      setValue('name', editingGroup.name);
      setValue('description', editingGroup.description || '');
    } else {
      reset({ name: '', description: '' });
    }
  }, [editingGroup, setValue, reset]);

  const { isLoading, error } = useQuery({
    queryKey: ['groupsSummary', userId, dateFilter],
    queryFn: async () => {
      const response = await groupService.getGroupsSummary(
        userId || '',
        dateFilter.startDate || '',
        dateFilter.endDate || ''
      );
      const data = response?.data || [];
      dispatch(setGroups(data));
      return data;
    },
    enabled: !!userId,
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: { name: string; description: string; userId: string }) => 
      groupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsSummary'] });
      reset();
      setIsModalOpen(false);
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: (data: { id: string; name: string; description: string }) => 
      groupService.updateGroup(data.id, { name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsSummary'] });
      setEditingGroup(null);
      setIsModalOpen(false);
    },
  });

  const onSubmit = (data: any) => {
    if (!userId) return;
    
    if (editingGroup) {
      updateGroupMutation.mutate({
        id: editingGroup.id,
        name: data.name,
        description: data.description
      });
    } else {
      createGroupMutation.mutate({
        name: data.name,
        description: data.description,
        userId: userId
      });
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (group: Group) => {
    setDeletingGroup(group);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(val);
  };

  const isPending = createGroupMutation.isPending || updateGroupMutation.isPending;
  const mutationError = createGroupMutation.error as any || updateGroupMutation.error as any;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">קבוצות</h1>
          <p className="text-slate-500 font-medium">ניהול קטגוריות הפעילות והמאזן הפיננסי שלך</p>
        </div>
        <button 
          onClick={() => { setEditingGroup(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} /> קבוצה חדשה
        </button>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 font-bold">
          <AlertCircle size={24} />
          <p>שגיאה בטעינת הנתונים. נא לנסות שוב מאוחר יותר.</p>
        </div>
      )}

      {!isLoading && groupsFromRedux.length === 0 && !error && (
        <div className="bg-white rounded-[2.5rem] p-16 border border-slate-100 border-dashed flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Plus size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">אין קבוצות עדיין</h3>
          <p className="text-slate-500 max-w-sm">צור קבוצה חדשה כדי להתחיל לעקוב אחר ההכנסות, ההוצאות והמעשרות שלך.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groupsFromRedux.map((group) => (
          <GroupCard 
            key={group.id}
            group={group}
            onClick={() => navigate(`/groups/${group.id}`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGroup ? "עריכת קבוצה" : "הוספת קבוצה חדשה"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mutationError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in">
              <AlertCircle size={18} />
              <span>{mutationError.message || 'שגיאה בביצוע הפעולה. ייתכן שהשם כבר קיים.'}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">שם הקבוצה</label>
            <input 
              {...register('name', { required: true })}
              disabled={isPending}
              className={`w-full px-5 py-3 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 disabled:opacity-50`}
              placeholder="לדוגמה: עסק המזון שלי"
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold px-1">יש להזין שם קבוצה</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">תיאור</label>
            <textarea 
              {...register('description')}
              disabled={isPending}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-32 resize-none transition-all font-medium text-slate-600 disabled:opacity-50"
              placeholder="תאר בקצרה את הפעילות..."
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                מעבד...
              </>
            ) : (
              editingGroup ? 'עדכן קבוצה' : 'צור קבוצה'
            )}
          </button>
        </form>
      </Modal>

      <DeleteGroupModal 
        isOpen={!!deletingGroup} 
        onClose={() => setDeletingGroup(null)} 
        groupId={deletingGroup?.id || null} 
        groupName={deletingGroup?.name || ''} 
      />
    </div>
  );
};

export default Groups;
