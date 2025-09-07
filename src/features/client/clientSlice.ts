import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  designation: string;
  password: string | null;
  authority_id: number;
  company_id: number;
  company_name: string;
  lock_status: number;
};

type Pageable = {
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

export interface clientType {
  content: User[];
  pageable: Pageable;
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

interface ClientState {
  entity: clientType | null;
  loading: boolean;
  error: boolean;
}

const initialState: ClientState = {
  entity: null,
  loading: false,
  error: false,
};

export const fetchClientAsync = createAsyncThunk(
  "client/getClient",
  async (params: string) => {
    try {
      const response = await axios.get(
        BASE_URL + "/API/List/Client/Filter/Search" + params
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchClientAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default clientSlice.reducer;

export const selectClient = (state: RootState) => state.client.entity;
export const clientLoading = (state: RootState) => state.client.loading;
export const clientError = (state: RootState) => state.client.error;
