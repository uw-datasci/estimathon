"use client";

import React from "react";
import { useLeaderboard, LeaderboardEntry } from "@/utils/hooks/useLeaderboard";
import PodiumTeamCard from "../../components/PodiumTeamCard";

export default function AdminLeaderboard() {
  const { leaderboard, loading, error } = useLeaderboard();

  if (loading) return <div>Loading leaderboard…</div>;
  if (error)  return <div className="text-red-400">Error: {error}</div>;

  const podiumStyles = [
    { bg: "bg-portage-600", text: "text-portage-100" },
    { bg: "bg-portage-400", text: "text-portage-100" },
    { bg: "bg-portage-200", text: "text-portage-600" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Global Leaderboard</h2>

      <div className="flex overflow-x-auto gap-6 py-4">
        {leaderboard.slice(0, 3).map((entry, idx) => {
          const style = podiumStyles[idx] || podiumStyles[0];
          return (
            <div key={entry.id} className="w-64 flex-shrink-0">
              <PodiumTeamCard
                teamCode={entry.code}
                score={entry.score}
                members={entry.members}
                bgColourClass={style.bg}
                textColourClass={style.text}
              />
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[600px] bg-white rounded-lg overflow-hidden">
          <thead className="bg-portage-950 text-portage-100">
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Team Code</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Correct</th>
              <th className="px-4 py-2 text-left">Members</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry: LeaderboardEntry, idx: number) => (
              <tr key={entry.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{entry.code}</td>
                <td className="px-4 py-2">{entry.score}</td>
                <td className="px-4 py-2">{entry.good_interval}</td>
                <td className="px-4 py-2">
                  {entry.members.map((m) => m.name).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
