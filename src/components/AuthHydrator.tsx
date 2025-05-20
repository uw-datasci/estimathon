"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/loginTokenSlice";
import { AppDispatch } from "@/store/store";

export function AuthHydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) =>
        u ? dispatch(login({ name: u.name, token: "<<cookie>>", role: u.role }))
          : dispatch(logout())
      );
  }, []);

  return null;
}
