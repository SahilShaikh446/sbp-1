import { RootState } from "@/app/store";
import { BASE_URL } from "@/lib/constants";
import { ReportType } from "@/features/oilReport/OilReportCreate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface OilReportState {
  entity: ReportType[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: OilReportState = {
  entity: null,
  loading: true,
  error: false,
};

export const fetchOilReportAsync = createAsyncThunk(
  "oilReport/getOilReport",
  async () => {
    try {
      const response = await axios.get(
        BASE_URL + "API/List/Oil/Filtration/Test/Report"
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
// export const fetchOilReportAsync = createAsyncThunk(
//   "oilReport/getOilReport",
//   async (params: string) => {
//     try {
//       const response = await axios.get(
//         BASE_URL + "API/List/Oil/Filtration/Test/Report/Filter/Search?" + params
//       );
//       return response.data;
//     } catch (error) {
//       return error;
//     }
//   }
// );

export const oilReportSlice = createSlice({
  name: "oilReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOilReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchOilReportAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default oilReportSlice.reducer;

export const selectOilReport = (state: RootState) => state.oilReport.entity;
export const oilReportLoading = (state: RootState) => state.oilReport.loading;
export const oilReportError = (state: RootState) => state.oilReport.error;
