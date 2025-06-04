"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface Props { teamId: string }

export default function WaitingRoom({ teamId }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

//   useEffect(() => {
//     socket.emit("joinTeamRoom", teamId);       // room for live roster

//     socket.on("timer", ({ remaining }) => setRemaining(remaining));
//     socket.on("teamRoster", (list) => setMembers(list));
//     socket.on("quizStarted", () => {
//       window.location.href = "/quiz";
//     });

//     return () => {
//       socket.off("timer");
//       socket.off("teamRoster");
//       socket.off("quizStarted");
//     };
//   }, [teamId]);

  const clock = remaining != null
    ? new Date(remaining).toISOString().substr(11, 8)
    : "--:--:--";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 sm:px-12 bg-gradient-to-br from-white to-dsc-200">
      <header className="absolute left-6 top-6 text-3xl font-bold text-dsc-800">
        UW DSC<span className="inline-block ml-1 h-[3px] w-4 bg-dsc-200 align-baseline" />
      </header>

      <h2 className="text-2xl sm:text-3xl font-medium text-dsc">
        Are you ready, <span className="font-bold">{members[0]?.name ?? "player"}</span>?
      </h2>

      <div className="rounded-xl bg-dsc px-14 py-12 text-white shadow-lg">
        <p className="text-5xl sm:text-6xl font-semibold tabular-nums">{clock}</p>
        <p className="mt-3 text-sm sm:text-base text-white/90">
          Until questions release
        </p>
      </div>

      <aside className="rounded-xl border border-blue-200/60 bg-white/80 p-6 w-60 backdrop-blur">
        <h3 className="mb-3 font-semibold text-dsc">Your team</h3>
        <ul className="space-y-2">
          {members.map((m, i) => (
            <li key={m.id} className="flex items-center gap-3 text-sm">
              <span
                className={clsx(
                  "h-4 w-4 rounded-full",
                  ["bg-blue-900", "bg-blue-600", "bg-blue-400"][i % 3]
                )}
              />
              {m.name}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
