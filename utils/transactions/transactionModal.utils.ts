import { TransactionType } from '../../types/index';

/**
 * Checks if the transaction type is a financial movement (Income or Expense)
 */
export const checkIsFinancial = (type: TransactionType): boolean => {
  return type === TransactionType.INCOME || type === TransactionType.EXPENSE;
};

/**
 * Returns the modal title based on the transaction type
 */
export const getTransactionTitle = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.INCOME: return 'הוספת הכנסה חדשה';
    case TransactionType.EXPENSE: return 'תיעוד הוצאה';
    case TransactionType.DONATION: return 'תיעוד תרומה (מעשר)';
    default: return '';
  }
};

/**
 * Returns the CSS color classes for the submit button based on the transaction type
 */
export const getTransactionColorClasses = (type: TransactionType): string => {
  const colorClasses = {
    [TransactionType.INCOME]: 'bg-green-600 hover:bg-green-700 shadow-green-100',
    [TransactionType.EXPENSE]: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    [TransactionType.DONATION]: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
  };
  return colorClasses[type];
};
