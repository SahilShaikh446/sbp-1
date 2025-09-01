import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { ReportType } from "@/features/oilReport/OilReportCreate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiResponse } from "./type";

interface ACBReportState {
  entity: ApiResponse | null;
  loading: boolean;
  error: boolean;
}

const initialState: ACBReportState = {
  entity: null,
  loading: true,
  error: false,
};

// export const fetchACBReportAsync = createAsyncThunk(
//   "acbReport/getACBReport",
//   async () => {
//     try {
//       const response = await axios.get(BASE_URL + "API/List/ACB/Report");
//       return response.data;
//     } catch (error) {
//       return error;
//     }
//   }
// );
export const fetchACBReportAsync = createAsyncThunk(
  "acbReport/getACBReport",
  async (params: string) => {
    try {
      const response = await axios.get(
        BASE_URL + "API/List/ACB/Report/Filter/Search" + params
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const acbReportSlice = createSlice({
  name: "acbReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchACBReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchACBReportAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default acbReportSlice.reducer;

export const selectACBdata = (state: RootState) => state.acbReport.entity;
export const acbReportLoading = (state: RootState) => state.acbReport.loading;
export const acbReportError = (state: RootState) => state.acbReport.error;
