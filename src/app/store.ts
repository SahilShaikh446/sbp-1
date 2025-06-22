import { adminSlice } from "@/features/admin/adminSlice";
import { authSlice } from "@/features/authSlice/authSlice";
import { clientSlice } from "@/features/client/clientSlice";
import companySlice from "@/features/company/companySlice";
import { configureStore } from "@reduxjs/toolkit";
// ...

export const store = configureStore({
  reducer: {
    company: companySlice,
    client: clientSlice.reducer,
    admin: adminSlice.reducer,
    auth: authSlice.reducer,
  },
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
