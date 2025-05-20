import { configureStore } from "@reduxjs/toolkit";
import loginTokenReducer from "./loginTokenSlice";

export const store = configureStore({
  reducer: { auth: loginTokenReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
