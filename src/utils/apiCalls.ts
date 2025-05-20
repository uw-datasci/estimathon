import axios from "axios";

export const sendSignInInfo = (values: { email: string; password: string }) =>
  axios.post("/api/login", values);
