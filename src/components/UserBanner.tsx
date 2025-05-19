"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function UserBanner() {
  const { name, role } = useSelector((s: RootState) => s.auth);
  return (
    <p className="text-lg text-stone-300">
      Logged in as <strong>{name}</strong> ({role})
    </p>
  );
}
