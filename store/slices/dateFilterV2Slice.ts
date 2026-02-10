import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateFilterV2State, DateFilterUIState, ResolvedDateRange } from '../../types/dateFilterV2';
import { RootState } from '../index';

const getEndOfTodayISO = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
};

const initialState: DateFilterV2State = {
  ui: { mode: 'ALL' },
  resolved: {
    resolvedStartDate: '1990-01-01T00:00:00.000Z',
    resolvedEndDate: getEndOfTodayISO(),
  }
};

const dateFilterV2Slice = createSlice({
  name: 'dateFilterV2',
  initialState,
  reducers: {
    setDateFilterUIState: (state, action: PayloadAction<DateFilterUIState>) => {
      state.ui = action.payload;
    },
    setResolvedDateRange: (state, action: PayloadAction<ResolvedDateRange>) => {
      state.resolved = action.payload;
    },
    resetDateFilterV2State: (state) => {
      state.ui = initialState.ui;
      state.resolved = {
        resolvedStartDate: '1990-01-01T00:00:00.000Z',
        resolvedEndDate: getEndOfTodayISO(),
      };
    }
  }
});

export const { setDateFilterUIState, setResolvedDateRange, resetDateFilterV2State } = dateFilterV2Slice.actions;

// Selectors
export const selectDateFilterV2UIState = (state: RootState) => state.dateFilterV2.ui;
export const selectResolvedDateRangeV2 = (state: RootState) => state.dateFilterV2.resolved;
export const selectDateFilterV2State = (state: RootState) => state.dateFilterV2;

export default dateFilterV2Slice.reducer;
