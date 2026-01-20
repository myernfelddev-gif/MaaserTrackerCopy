
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  DONATION = 'DONATION'
}

export interface Group {
  id: string;
  name: string;
  description: string;
  activeProjects: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  titheDue: number;
}

export interface Project {
  id: string;
  groupId: string;
  name: string;
  description: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  titheDue: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  title: string;
  notes?: string;
  groupId?: string;
  projectId?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalDonations: number;
  netProfit: number;
  requiredTithe: number;
  balance: number;
}
