import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  name: string;
  token: string;
  role: string;
}

const initialState: LoginState = { name: "", token: "", role: "" };

export const loginTokenSlice = createSlice({
  name: "loginToken",
  initialState,
  reducers: {
    login: (_state, action: PayloadAction<LoginState>) => action.payload,
    logout: () => initialState,
  },
});

export const { login, logout } = loginTokenSlice.actions;
export default loginTokenSlice.reducer;
