import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import groupReducer from './slices/groupSlice';
import dateFilterV2Reducer from './slices/dateFilterV2Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    groups: groupReducer,
    dateFilterV2: dateFilterV2Reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export actions for easier access
export * from './slices/authSlice';
export * from './slices/uiSlice';
export * from './slices/groupSlice';
export * from './slices/dateFilterV2Slice';
