import React from 'react';
import { History } from 'lucide-react';

const ActivityLog: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">יומן פעולות</h1>
        <p className="text-slate-500 font-medium">מעקב אחר היסטוריית הפעולות והשינויים במערכת</p>
      </div>

      <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
        <div className="p-6 bg-slate-50 rounded-full mb-6 text-slate-300">
          <History size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">יומן הפעולות ריק כרגע</h3>
        <p className="text-slate-500 max-w-xs text-center leading-relaxed">
          כל פעולה שתבצע במערכת - הוספת הכנסה, הוצאה או פרויקט חדש - תתועד כאן באופן אוטומטי.
        </p>
      </div>
    </div>
  );
};

export default ActivityLog;
