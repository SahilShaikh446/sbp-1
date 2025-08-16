import { adminSlice } from "@/features/admin/adminSlice";
import { authSlice } from "@/features/authSlice/authSlice";
import { clientSlice } from "@/features/client/clientSlice";
import companySlice from "@/features/company/companySlice";
import { contactUsSlice } from "@/features/contactus/contactUsSlice";
import { oilReportSlice } from "@/features/oilReport/oilReportSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  company: companySlice,
  client: clientSlice.reducer,
  admin: adminSlice.reducer,
  auth: authSlice.reducer,
  oilReport: oilReportSlice.reducer,
  contactUs: contactUsSlice.reducer,
});

// Root reducer that handles reset
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "RESET") {
    state = undefined; // let all slices return their initialState
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// Types
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const resetStore = () => ({ type: "RESET" });
