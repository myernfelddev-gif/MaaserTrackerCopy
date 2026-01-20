
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'amber' | 'indigo' | 'slate';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, description }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-50 text-slate-600',
  };

  const borderColors = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    red: 'border-red-200',
    amber: 'border-amber-200',
    indigo: 'border-indigo-200',
    slate: 'border-slate-200',
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${borderColors[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        {description && <span className="text-xs font-medium text-slate-400">{description}</span>}
      </div>
      <div>
        <h3 className="text-slate-500 font-semibold text-sm mb-1">{label}</h3>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
