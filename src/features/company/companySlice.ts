import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface companyType {
  id: string;
  name: string;
  address: string;
}

interface CompanyState {
  entity: companyType[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: CompanyState = {
  entity: null,
  loading: false,
  error: false,
};

export const getCompanyAsync = createAsyncThunk(
  "company/getCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("API/List/Company");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(getCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default companySlice.reducer;

export const selectCompany = (state: RootState) => state.company.entity;
export const companyLoading = (state: RootState) => state.company.loading;
export const companyError = (state: RootState) => state.company.error;
