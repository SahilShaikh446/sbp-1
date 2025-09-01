import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { ReportType } from "@/features/oilReport/OilReportCreate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ReportsResponse } from "./type";

interface HTBreakerReportState {
  entity: ReportsResponse | null;
  loading: boolean;
  error: boolean;
}

const initialState: HTBreakerReportState = {
  entity: null,
  loading: true,
  error: false,
};

// export const fetchOilReportAsync = createAsyncThunk(
//   "oilReport/getOilReport",
//   async () => {
//     try {
//       const response = await axios.get(BASE_URL + "API/List/Oil/Filtration/Test/Report");
//       return response.data;
//     } catch (error) {
//       return error;
//     }
//   }
// );

export const fetchHTBreakerReportAsync = createAsyncThunk(
  "HTBreakerReport/getHTBreakerReport",
  async (params: string) => {
    try {
      const response = await axios.get(
        BASE_URL + "API/List/Service/Report/Filter/Search" + params
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const HTBreakerReportSlice = createSlice({
  name: "HTBreakerReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHTBreakerReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchHTBreakerReportAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default HTBreakerReportSlice.reducer;

export const selectHTBreakerReport = (state: RootState) =>
  state.HTBreakerReport.entity;
export const HTBreakerReportLoading = (state: RootState) =>
  state.HTBreakerReport.loading;
export const HTBreakerReportError = (state: RootState) =>
  state.HTBreakerReport.error;
