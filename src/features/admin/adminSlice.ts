import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface adminType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  number: string;
  designation: string;
}

interface AdminState {
  entity: adminType[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: AdminState = {
  entity: null,
  loading: false,
  error: false,
};

export const fetchAdminAsync = createAsyncThunk(
  "admin/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("API/List/Admin");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default adminSlice.reducer;

export const selectAdmin = (state: RootState) => state.admin.entity;
export const adminLoading = (state: RootState) => state.admin.loading;
export const adminError = (state: RootState) => state.admin.error;
