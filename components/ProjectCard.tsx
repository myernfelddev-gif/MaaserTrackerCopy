
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  formatCurrency: (val: number) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onEdit, onDelete, formatCurrency }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border border-blue-200 h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-5 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight">{project.name}</h3>
          <p className="text-slate-600 text-sm line-clamp-2 mt-1 leading-snug">{project.description || 'אין תיאור'}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button 
            className="p-2 text-slate-500 hover:text-blue-700 hover:bg-white rounded-lg transition-colors flex-shrink-0" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            title="עריכה"
          >
            <Edit2 size={18} className="flex-shrink-0" />
          </button>
          <button 
            className="p-2 text-slate-500 hover:text-red-700 hover:bg-white rounded-lg transition-colors flex-shrink-0" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            title="מחיקה"
          >
            <Trash2 size={18} className="flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Main Stats - Income & Expenses */}
      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-blue-300 flex-shrink-0">
        <div className="min-w-0">
          <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">הכנסה</p>
          <p className="text-green-700 text-base font-bold whitespace-nowrap">{formatCurrency(project.totalIncome)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">הוצאה</p>
          <p className="text-red-700 text-base font-bold whitespace-nowrap">{formatCurrency(project.totalExpense)}</p>
        </div>
      </div>

      {/* Summary Stats - Net Profit & Tithe */}
      <div className="space-y-3 mt-auto flex-shrink-0">
        <div className="flex justify-between items-center gap-2 bg-white bg-opacity-70 rounded-lg p-3 min-w-0">
          <span className="text-slate-800 font-bold text-sm flex-shrink-0">רווח נקי</span>
          <span className="text-base font-bold text-slate-900 whitespace-nowrap text-right">{formatCurrency(project.netProfit)}</span>
        </div>
        <div className="flex justify-between items-center gap-2 bg-blue-200 bg-opacity-60 rounded-lg p-3 min-w-0">
          <span className="text-slate-800 font-bold text-sm flex-shrink-0">מעשר</span>
          <span className="text-base font-bold text-blue-900 whitespace-nowrap text-right">{formatCurrency(project.requiredTithe)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
