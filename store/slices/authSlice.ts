
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string; userId: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      
      // שמירת הטוקן ב-LocalStorage לשימוש עתידי בקריאות API
      localStorage.setItem('auth_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      localStorage.removeItem('auth_token');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
