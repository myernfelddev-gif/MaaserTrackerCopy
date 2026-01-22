import { DateFilterState, DateFilterType } from '../../types/index';

export const months = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

/**
 * Generates a human-readable display label for the current date filter.
 */
export const getDisplayLabel = (dateFilter: DateFilterState) => {
  if (dateFilter.type === 'ALL') return 'כל הזמן';
  if (dateFilter.type === 'ANNUAL') return `שנת ${dateFilter.year || currentYear}`;
  if (dateFilter.type === 'MONTHLY') return `${months[(dateFilter.month || 1) - 1]} ${dateFilter.year || currentYear}`;
  if (dateFilter.type === 'CUSTOM') return `${dateFilter.startDate || '?'} - ${dateFilter.endDate || '?'}`;
  return '';
};
