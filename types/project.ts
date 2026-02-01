
export interface Project {
  id: string;
  name: string;
  description: string;
  groupId: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  requiredTithe: number;
}

export interface GroupProjectsResponse {
  groupName: string;
  groupDescription: string;
  projects: Project[];
}

export interface ApiError {
  data?: {
    message?: string;
  };
  name?: string;
}
