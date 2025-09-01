import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface companyType {
  content: {
    id: number;
    name: string;
    address: string;
  }[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface CompanyState {
  entity: companyType | null;
  loading: boolean;
  error: boolean;
}

const initialState: CompanyState = {
  entity: null,
  loading: false,
  error: false,
};

export const fetchAllCompanyAsync = createAsyncThunk(
  "company/getCompany",
  async (params: string) => {
    try {
      const response = await axios.get(
        BASE_URL + "/API/List/Company/Filter/Search" + params
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const allCompanySlice = createSlice({
  name: "allCompany",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchAllCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default allCompanySlice.reducer;

export const selectAllCompany = (state: RootState) => state.allCompany.entity;
export const allCompanyLoading = (state: RootState) => state.allCompany.loading;
export const allCompanyError = (state: RootState) => state.allCompany.error;
