import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { ReportType } from "@/features/oilReport/OilReportCreate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiResponse } from "./type";
// import { ReportsResponse } from "./type";

interface EarthReportState {
  entity: ApiResponse | null;
  loading: boolean;
  error: boolean;
}

const initialState: EarthReportState = {
  entity: null,
  loading: true,
  error: false,
};

export const fetchEarthReportAsync = createAsyncThunk(
  "earthReport/getEarthReport",
  async (params: string) => {
    try {
      const response = await axios.get(
        BASE_URL + "API/List/Earth/Test/Report/Filter/Search" + params
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const earthReportSlice = createSlice({
  name: "earthReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarthReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchEarthReportAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default earthReportSlice.reducer;

export const selectEarthReport = (state: RootState) => state.earthReport.entity;
export const earthReportLoading = (state: RootState) =>
  state.earthReport.loading;
export const earthReportError = (state: RootState) => state.earthReport.error;
