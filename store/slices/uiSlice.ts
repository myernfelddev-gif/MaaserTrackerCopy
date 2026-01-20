
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateFilterState } from '../../types/ui';

interface UIState {
  dateFilter: DateFilterState;
}

const initialState: UIState = {
  dateFilter: { type: 'ALL' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDateFilter: (state, action: PayloadAction<DateFilterState>) => {
      state.dateFilter = action.payload;
      console.log(state.dateFilter);
    }
  }
});

export const { setDateFilter } = uiSlice.actions;
export default uiSlice.reducer;
