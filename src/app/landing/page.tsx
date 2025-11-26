"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Backdrop from "@/components/Backdrop";

export default function OnboardingPage() {
  const [hasTeam, setHasTeam] = useState<null | boolean>(null);
  const [teamCode, setTeamCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Checks to see if logged in, if not then redirects to login page
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });

        if (res.status === 401) {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  // Generates a random 5 digit team code
  const generateCode = () =>
    Math.floor(10000 + Math.random() * 90000).toString();

  // Uses generateCode to get a random code, regenerates if code exists already
  const generateUniqueCode = async () => {
    let code: string;
    let exists = true;
    let count = 0; // Tries 25 times (so don't get stuck in an infinite loop if something goes very wrong)

    while (exists && count < 25) {
      code = generateCode();

      // Check to see if team exists already
      const res = await fetch("/api/teams/check-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      exists = data.exists;
      count++;
    }

    if (exists) {
      // Means something went very wrong (way too many teams already created)
      alert("Failed to generate a unique code. Please try again.");
    } else {
      // Set team code
      setGeneratedCode(code!);
    }
  };

  useEffect(() => {
    if (hasTeam === false) {
      generateUniqueCode();
    }
  }, [hasTeam]);

  // Calls join-team api endpoint to join a team
  const handleJoin = async () => {
    try {
      const res = await fetch("/api/teams/join-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join team");
      console.log("Joined team successfully:", data);
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Calls create api endpoint and then join-team to create and join a new team
  const handleCreateAndJoin = async () => {
    try {
      // Create the team
      const createRes = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: generatedCode }),
      });
      const createData = await createRes.json();
      if (!createRes.ok)
        throw new Error(createData.error || "Failed to create team");
      console.log("Team created:", createData);

      // Immediately join it as the current user
      const joinRes = await fetch("/api/teams/join-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamCode: generatedCode }),
      });
      const joinData = await joinRes.json();
      if (!joinRes.ok) throw new Error(joinData.error || "Failed to join team");
      console.log("User joined team:", joinData);

      // Redirect
      router.push("/dashboard"); // or whatever page the dash is on
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Copies the current team code that was generated
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus(""), 1500);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center gap-6 text-center p-6">
      <Backdrop />

      {hasTeam === null && (
        <div className="relative md:absolute md:top-2/5 md:left-15 text-white">
          <p className="text-xl antialiased">Do you have a team?</p>
          <div className="flex gap-4 w-48 pt-3">
            <button
              onClick={() => setHasTeam(true)}
              className="w-full py-2 bg-[#314077] text-white rounded hover:bg-[#212d59]"
            >
              Yes
            </button>
            <button
              onClick={() => setHasTeam(false)}
              className="w-full py-2 bg-white text-[#5D84D4] rounded hover:bg-blue-100"
            >
              No
            </button>
          </div>
        </div>
      )}

      {hasTeam === true && (
        <div className="relative md:absolute md:top-2/5 md:left-15">
          <p className="text-xl antialiased text-left">
            Enter your team’s code:
          </p>
          <div className="flex gap-2 items-center justify-center pt-3">
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="12345"
              className="w-full border px-4 py-2 rounded bg-gray-100 text-[#496AC7] pl-6"
            />
            <button
              onClick={handleJoin}
              className="px-6 py-2 bg-white text-[#5D84D4] rounded hover:bg-blue-100"
            >
              Join
            </button>
            <button
              onClick={() => setHasTeam(null)}
              className="px-6 py-2 bg-white text-[#5D84D4] rounded hover:bg-blue-100"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {hasTeam === false && (
        <div className="relative md:absolute md:top-2/5 md:left-15">
          <p className="text-xl antialiased text-left">Your team’s code is:</p>
          <div className="flex items-center gap-3 pt-3">
            <div className="relative w-40">
              <input
                type="text"
                value={generatedCode}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100 text-[#496AC7] pl-6"
              />
              <button
                onClick={handleCopy}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-600 hover:underline"
              >
                <img
                  src="/copy_icon.svg"
                  className="w-6 h-6 block"
                  alt="Copy"
                />
              </button>
            </div>
            <button
              onClick={handleCreateAndJoin}
              className="px-6 py-2 bg-white text-[#5D84D4] rounded hover:bg-blue-100"
            >
              Join
            </button>
            <button
              onClick={() => setHasTeam(null)}
              className="px-6 py-2 bg-white text-[#5D84D4] rounded hover:bg-blue-100"
            >
              Back
            </button>
          </div>
          {copyStatus && (
            <p className="text-blue-100 text-center pt-2 pl-2">{copyStatus}</p>
          )}
        </div>
      )}

      <h2
        className="relative md:absolute md:bottom-12 md:left-15 text-4xl md:text-8xl font-helvetica drop-shadow-lg text-white text-center md:text-left"
        style={{
          textShadow: "0 0 12px rgba(255, 255, 255, 0.6)",
        }}
      >
        Estimathon {process.env.NEXT_PUBLIC_TERM}
      </h2>
    </main>
  );
}
