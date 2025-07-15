"use client";
import { useUserInfo } from "@/utils/hooks/useUserInfo";
import { useCurrentTeam } from "@/utils/hooks/useCurrentTeam";
import { useSubmissions } from "@/utils/hooks/useSubmissions";
import { useTeamScore } from "@/utils/hooks/useTeamScore";
import { useLeaderboard } from "@/utils/hooks/useLeaderboard";
import PodiumTeamCard from "../../components/PodiumTeamCard";
import LeaderboardRow from "../../components/LeaderboardRow";
import React from "react";

export default function LeaderboardClient() {
  // Getting user info
  const { user } = useUserInfo();
  const { teamId } = useCurrentTeam();
  const { submissions } = useSubmissions(teamId ?? undefined);
  const { score, goodIntervals } = useTeamScore(teamId);
  const badIntervals = submissions.length - goodIntervals;
  const { leaderboard } = useLeaderboard();

  const podiumStyles = [
    { bg: "bg-portage-600", text: "text-portage-100" },
    { bg: "bg-portage-400", text: "text-portage-100" },
    { bg: "bg-portage-200", text: "text-portage-600" },
  ];

  return (
    <main className="overflow-y-auto min-h-screen w-full flex flex-col px-6 sm:px-12 bg-gradient-to-br from-white to-portage-200">
      <header className="absolute left-6 top-6">
        <img
          src="/dsc.svg"
          alt="UW DSC logo"
          className="h-16 w-auto text-portage-600"
        />
      </header>
      <header className="absolute top-6 right-6 text-portage-600 text-sm sm:text-base">
        {user?.name}
      </header>

      <div className="mt-32 px-8 flex flex-col space-y-10 w-full max-w-screen-xl">
        <h2 className="text-2xl sm:text-3xl font-medium text-portage-600">
          Your results
        </h2>

        <div className="flex flex-col sm:flex-row sm:gap-x-16 gap-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-portage-600">{score}</h1>
            <p className="text-lg text-portage-600">Your score</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-portage-600">
              {badIntervals}
            </h1>
            <p className="text-lg text-portage-600">Questions wrong</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-portage-600">
              {goodIntervals}
            </h1>
            <p className="text-lg text-portage-600">Questions correct</p>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-medium text-portage-600">
          Leaderboard
        </h2>
        <div className="flex overflow-x-auto sm:justify-start gap-6 py-4">
          {leaderboard.slice(0, 3).map((entry, index) => {
            const style = podiumStyles[index] ?? {
              bg: "bg-portage-600",
              text: "text-portage-100",
            };
            return (
              <div key={entry.id} className="w-64 sm:w-80 flex-shrink-0">
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

        <h2 className="text-2xl sm:text-3xl font-medium text-portage-600">
          Global Ranking
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[700px] flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden p-6 pt-4 h-80">
            <div className="flex text-portage-600 pb-3">
              <div className="w-[8%]">Rank</div>
              <div className="w-[16%]">Team Code</div>
              <div className="w-[16%]">Score</div>
              <div className="w-[16%]">Correct</div>
              <div className="w-[16%]">Submissions</div>
              <div className="w-[28%]">Team Members</div>
            </div>
            <hr className="border-t border-gray-200 pb-3" />
            <div
              className="scrollable-container max-h-[90%] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#C2CCFF #FFFFFF", // thumb color, track color
              }}
            >
              {leaderboard.map((entry, index) => {
                return (
                  <div key={entry.id} className="w-full">
                    <LeaderboardRow
                      rank={index + 1}
                      teamCode={entry.code}
                      score={entry.score}
                      good_intervals={entry.good_interval}
                      submission_count={entry.submission_count}
                      members={entry.members}
                    />
                    <hr className="border-t border-gray-200 pb-3" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
