
import React from 'react';
import { Plus, Minus, Gift } from 'lucide-react';
import AltActionCard from './AltActionCard';
import { TransactionType } from '../../types';

interface AltQuickActionsProps {
  onAction: (type: TransactionType) => void;
}

const AltQuickActions: React.FC<AltQuickActionsProps> = ({ onAction }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <AltActionCard 
        title="הוספת הכנסה" 
        subtitle="חדש בקופה" 
        icon={<Plus />} 
        color="green" 
        onClick={() => onAction(TransactionType.INCOME)} 
      />
      <AltActionCard 
        title="תיעוד הוצאה" 
        subtitle="יוצא מהקופה" 
        icon={<Minus />} 
        color="red" 
        onClick={() => onAction(TransactionType.EXPENSE)} 
      />
      <AltActionCard 
        title="נתינת מעשר" 
        subtitle="צדקה ותרומה" 
        icon={<Gift />} 
        color="blue" 
        onClick={() => onAction(TransactionType.DONATION)} 
      />
    </div>
  );
};

export default AltQuickActions;
