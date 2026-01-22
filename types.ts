export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  DONATION = 'DONATION'
}

export interface User {
  id: string;
  name: string;
  email: string;
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
  description?: string;
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

export type DateFilterType = 'ANNUAL' | 'MONTHLY' | 'CUSTOM' | 'ALL';

export interface DateFilterState {
  type: DateFilterType;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}