import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  role: string | null;
  roleId: string | null;
  username: string | null;
  email: string | null;
}

const initialState: AuthState = {
  role: null,
  roleId: null,
  username: null,
  email: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.role = action.payload.role;
      state.roleId = action.payload.roleId;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    cleanAuth: (state) => {
      state.role = null;
      state.roleId = null;
      
    },
  },
});

export const { setAuth, cleanAuth } = authSlice.actions;

export const selectRole = (state: RootState) => state.auth.role;
export const selectRoleId = (state: RootState) => state.auth.roleId;
export const selectusername = (state: RootState) => state.auth.username;

export default authSlice.reducer;
