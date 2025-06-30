import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean; // Thêm biến loading
}

const initialState: AuthState = {
  username: null,
  token: null,
  isAdmin: false,
  isLoading: true, // Ban đầu đang loading
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<Omit<AuthState, "isLoading">>) {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
      state.isLoading = false; // Đã xong
    },
    clearAuthData(state) {
      state.username = null;
      state.token = null;
      state.isAdmin = false;
      state.isLoading = false; // Reset
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const { setAuthData, clearAuthData, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;