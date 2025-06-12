// src/store/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  token: null,
  isAdmin: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
    },
    clearAuthData(state) {
      state.username = null;
      state.token = null;
      state.isAdmin = false;
    }
  }
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
