"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login } from "@/store/loginTokenSlice";
import { sendSignInInfo } from "@/utils/apiCalls";
import { useRouter } from "next/navigation";
import Backdrop from "@/components/Backdrop";

export default function LoginPage({ returnTo }: { returnTo: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError("Invalid email or password: " + e);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="absolute left-6 top-6 z-10">
        <img
          src="/dsc_white.svg"
          alt="UW DSC logo"
          className="h-16 w-auto"
        />
      </header>
      <div
      className="
        absolute inset-0
        bg-black/40
      "
      />
      <Backdrop />

      {/* top-left header */}
      <div className="absolute left-6 top-30 z-10 text-white">
        <h2 className="text-xl sm:text-3xl font-light">Estimathon S25</h2>
      </div>

      {/* center card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm bg-portage-950/90 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl text-white text-center font-light mt-1 mb-6">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full bg-white text-portage-900 placeholder-portage-400 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-portage-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-white text-portage-900 placeholder-portage-400 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-portage-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}

            <button
              type="submit"
              className="
                mt-4
                w-full
                bg-portage-500 hover:bg-portage-600
                text-white font-semibold
                rounded-sm py-3
                transition-shadow shadow-sm hover:shadow-md
              "
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
