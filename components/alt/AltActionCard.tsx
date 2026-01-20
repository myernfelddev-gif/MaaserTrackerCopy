
import React from 'react';

interface AltActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const AltActionCard: React.FC<AltActionCardProps> = ({ title, subtitle, icon, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] 
        transition-all duration-300 active:scale-95 border-b-8 border-r-8 
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        ${color === 'green' ? 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400' : ''}
        ${color === 'red' ? 'bg-rose-500 border-rose-700 hover:bg-rose-400' : ''}
        ${color === 'blue' ? 'bg-sky-500 border-sky-700 hover:bg-sky-400' : ''}
      `}
    >
      <div className="bg-white/20 p-4 rounded-3xl mb-4 group-hover:bg-white/30 transition-all text-white">
        {/* Fix: Added React.isValidElement check and cast to React.ReactElement<any> to resolve TypeScript error on 'size' property */}
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 32 }) : icon}
      </div>
      <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">{title}</h3>
      <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{subtitle}</p>
    </button>
  );
};

export default AltActionCard;
