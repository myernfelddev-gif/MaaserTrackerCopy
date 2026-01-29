
import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/api';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  groupName: string;
}

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({ isOpen, onClose, groupId, groupName }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsSummary'] });
      onClose();
    },
  });

  const handleDelete = () => {
    if (groupId) {
      deleteMutation.mutate(groupId);
    }
  };

  const isPending = deleteMutation.isPending;
  const error = deleteMutation.error as Error;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="מחיקת קבוצה">
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <AlertTriangle size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800">האם אתה בטוח?</h3>
          <p className="text-slate-500 leading-relaxed">
            האם אתה בטוח שברצונך למחוק את קבוצת <span className="font-black text-slate-800">"{groupName}"</span>? 
            פעולה זו תמחק את כל הנתונים הקשורים ולא ניתן לבטל אותה.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in">
            <AlertCircle size={18} />
            <span>{error.message || 'שגיאה במחיקת הקבוצה.'}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-4 px-6 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            לא, בטל
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-[2] py-4 px-6 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                מוחק...
              </>
            ) : (
              'כן, מחק קבוצה'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteGroupModal;
