export type DateFilterMode = 'ALL' | 'MONTH' | 'YEAR' | 'RANGE';

export type DateFilterPreset =
  | 'CURRENT_MONTH'
  | 'PREVIOUS_MONTH'
  | 'CURRENT_YEAR'
  | 'PREVIOUS_YEAR';

export interface DateFilterUIState {
  mode: DateFilterMode;
  preset?: DateFilterPreset;

  year?: number;   // MONTH / YEAR (manual selection only)
  month?: number;  // MONTH only (1-12)

  startDate?: string; // RANGE (yyyy-mm-dd)
  endDate?: string;   // RANGE (yyyy-mm-dd)
}

export interface ResolvedDateRange {
  resolvedStartDate: string; // ISO with time
  resolvedEndDate: string;   // ISO with time
}

export interface DateFilterV2State {
  ui: DateFilterUIState;
  resolved: ResolvedDateRange;
}
