import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface clientType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: number;
  phone: string;
  designation: string;
  company_name: string;
}

interface ClientState {
  entity: clientType[] | null;
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL + "API/List/Client");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
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
