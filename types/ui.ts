
export type DateFilterType = 'ANNUAL' | 'MONTHLY' | 'CUSTOM' | 'ALL';

export interface DateFilterState {
  type: DateFilterType;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}
