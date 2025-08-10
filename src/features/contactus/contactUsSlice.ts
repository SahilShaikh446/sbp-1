import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface ContactUs {
  id: string;
  mail_from: string;
  mail_to: string;
  contact_us_name: string;
  contact_us_email: string;
  contact_us_company: string;
  contact_us_number: string;
  contact_us_remarks: string;
}

interface contactUsState {
  entity: ContactUs[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: contactUsState = {
  entity: null,
  loading: true,
  error: false,
};

export const fetchContactUsAsync = createAsyncThunk(
  "contactUs/getContactUs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        BASE_URL + "API/List/Contact/Us/Details"
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const contactUsSlice = createSlice({
  name: "contactUs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactUsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchContactUsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default contactUsSlice.reducer;

export const selectContactUs = (state: RootState) => state.contactUs.entity;
export const contactUsLoading = (state: RootState) => state.contactUs.loading;
export const contactUsError = (state: RootState) => state.contactUs.error;
