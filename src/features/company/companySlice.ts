import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
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

export const fetchCompanyAsync = createAsyncThunk(
  "allcompany/getallCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL + "API/List/Company");
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
      .addCase(fetchCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default companySlice.reducer;

export const selectCompany = (state: RootState) => state.company.entity;
export const companyLoading = (state: RootState) => state.company.loading;
export const companyError = (state: RootState) => state.company.error;
