
import React from 'react';
import { Layout, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  formatCurrency: (val: number) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, formatCurrency }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Layout size={20} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          >
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
          <span className="font-bold text-blue-600">{formatCurrency(project.requiredTithe)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <span className="text-blue-500 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          לפרטי פרויקט <ChevronLeft size={14} />
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
