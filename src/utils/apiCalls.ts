import axios from "axios";

export function sendSignInInfo(values: { email: string; password: string }) {
  return axios.post("/api/login", values);
}
