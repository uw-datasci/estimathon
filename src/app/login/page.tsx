"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login } from "@/store/loginTokenSlice";
import { sendSignInInfo } from "@/utils/apiCalls";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params?.get("return") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await sendSignInInfo({ email, password });
      dispatch(
        login({
          name: data.name,
          token: data.accessToken,
          role: data.role,
        })
      );
      router.replace(returnTo);
    } catch (e: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-portage-50 to-portage-100 flex items-center justify-center p-6">
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full">
        <h1 className="text-3xl text-portage-700 text-center">
          Sign in 
        </h1>
        <p className="text-md text-portage-700 text-center mb-6">
          (DSC Account)
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="
              border border-portage-200
              focus:border-portage-500 focus:ring-2 focus:ring-portage-200
              outline-none
              p-3 rounded-2xl
              placeholder-portage-400
              text-portage-400
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="
              border border-portage-200
              focus:border-portage-500 focus:ring-2 focus:ring-portage-200
              outline-none
              p-3 rounded-2xl
              placeholder-portage-400
              text-portage-400
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
          <button
            type="submit"
            className="
              mt-2
              bg-portage-500 hover:bg-portage-600
              text-white font-semibold
              rounded-2xl p-3
              shadow-md
              transition
            "
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
