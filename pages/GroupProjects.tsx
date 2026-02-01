
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import DeleteProjectModal from '../components/DeleteProjectModal';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { projectService } from '../services/api';
import { GroupProjectsResponse, Project } from '../types/project';

const GroupProjects: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const { userId } = useSelector((state: RootState) => state.auth);
  const { dateFilter } = useSelector((state: RootState) => state.ui);
  
  const startDate = dateFilter.startDate || '';
  const endDate = dateFilter.endDate || '';

  useEffect(() => {
    if (editingProject) {
      setValue('name', editingProject.name);
      setValue('description', editingProject.description || '');
    } else {
      reset({ name: '', description: '' });
    }
  }, [editingProject, setValue, reset]);

  const { data: response, isLoading, error } = useQuery<GroupProjectsResponse>({
    queryKey: ['groupProjects', userId, groupId, startDate, endDate],
    queryFn: async () => {
      const result = await projectService.getGroupProjectsSummary(userId || '', groupId || '', startDate, endDate);
      return result?.data;
    },
    enabled: !!userId && !!groupId,
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: { name: string; description: string; groupId: string }) => 
      projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupProjects'] });
      reset();
      setIsModalOpen(false);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: { id: string; name: string; description: string }) => 
      projectService.updateProject(data.id, { name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupProjects'] });
      setEditingProject(null);
      setIsModalOpen(false);
    },
  });

  const onSubmit = (data: any) => {
    if (!groupId) return;
    
    if (editingProject) {
      updateProjectMutation.mutate({
        id: editingProject.id,
        name: data.name,
        description: data.description
      });
    } else {
      createProjectMutation.mutate({
        name: data.name,
        description: data.description,
        groupId: groupId
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
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

  const groupData = response || { groupName: 'טוען...', groupDescription: '', projects: [] };
  const projects = groupData.projects || [];
  const isPending = createProjectMutation.isPending || updateProjectMutation.isPending;
  const mutationError = (createProjectMutation.error as any) || (updateProjectMutation.error as any);

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
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProject ? "עריכת פרויקט" : "הוספת פרויקט חדש"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mutationError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in">
              <AlertCircle size={18} />
              <span>{mutationError.message || 'שגיאה בביצוע הפעולה.'}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">קבוצה (קריאה בלבד)</label>
            <input 
              type="text"
              readOnly
              value={groupData.groupName}
              className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-500 outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">שם הפרויקט</label>
            <input 
              {...register('name', { required: true })}
              disabled={isPending}
              className={`w-full px-5 py-3 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-100'} rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 disabled:opacity-50`}
              placeholder="לדוגמה: בניית אתר לקוח"
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold px-1">יש להזין שם פרויקט</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase px-1">תיאור</label>
            <textarea 
              {...register('description')}
              disabled={isPending}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-32 resize-none transition-all font-medium text-slate-600 disabled:opacity-50"
              placeholder="תאר בקצרה את הפרויקט..."
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
              editingProject ? 'עדכן פרויקט' : 'צור פרויקט'
            )}
          </button>
        </form>
      </Modal>

      <DeleteProjectModal 
        isOpen={!!deletingProject} 
        onClose={() => setDeletingProject(null)} 
        projectId={deletingProject?.id || null} 
        projectName={deletingProject?.name || ''} 
      />
    </div>
  );
};

export default GroupProjects;
