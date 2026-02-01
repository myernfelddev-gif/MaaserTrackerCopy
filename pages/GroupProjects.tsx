
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { projectService } from '../services/api';
import { GroupProjectsResponse } from '../types/project';

const GroupProjects: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { userId } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);
  
  const startDate = dateFilter.startDate || '';
  const endDate = dateFilter.endDate || '';

  // Fix: Extract data from result in queryFn to satisfy the GroupProjectsResponse type
  const { data: response, isLoading, error } = useQuery<GroupProjectsResponse>({
    queryKey: ['groupProjects', userId, groupId, startDate, endDate],
    queryFn: async () => {
      const result = await projectService.getGroupProjectsSummary(userId || '', groupId || '', startDate, endDate);
      return result?.data;
    },
    enabled: !!userId && !!groupId,
  });

  const onSubmit = (data: any) => {
    console.log('New project:', data);
    reset();
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-4">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="font-bold">טוען פרויקטים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex flex-col items-center gap-4 text-red-600 text-center">
        <AlertCircle size={40} />
        <p className="font-bold">אירעה שגיאה בטעינת הפרויקטים</p>
        <button onClick={() => navigate('/groups')} className="text-sm underline">חזרה לרשימת הקבוצות</button>
      </div>
    );
  }

  // Fix: response is now typed as GroupProjectsResponse, so we use it directly instead of accessing .data
  const groupData = response || { groupName: 'טוען...', groupDescription: '', projects: [] };
  const projects = groupData.projects || [];

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
          <h1 className="text-3xl font-extrabold text-slate-800">{groupData.groupName}</h1>
          <p className="text-slate-500">{groupData.groupDescription || `ניהול פרויקטים תחת קבוצת ${groupData.groupName}`}</p>
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

      {projects.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 border border-slate-100 border-dashed text-center">
          <p className="text-slate-500 font-bold text-lg">אין פרויקטים בקבוצה זו עדיין</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}

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
