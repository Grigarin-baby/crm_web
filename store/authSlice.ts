import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    organizationId: string;
    role: string;
    firstName?: string;
    lastName?: string;
    organization?: any;
    branch?: any;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: AuthState['user'];
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.user?.organizationId) {
        localStorage.setItem('organizationId', action.payload.user.organizationId);
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('organizationId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
