import { TeamMember } from "@/utils/hooks/useTeamMembers";

interface LeaderboardRowProps {
  rank: number;
  teamCode: string;
  score: number;
  good_intervals: number;
  submission_count: number;
  members: TeamMember[];
}

export default function LeaderboardRow({
  rank,
  teamCode,
  score,
  good_intervals,
  submission_count,
  members,
}: LeaderboardRowProps) {
  // Split members into two rows if more than 4
  const teamMembers = members ?? [];
  const midpoint = Math.ceil(teamMembers.length / 2);
  const splitMembers =
    teamMembers.length > 4
      ? [teamMembers.slice(0, midpoint), teamMembers.slice(midpoint)]
      : [teamMembers];

  return (
    <div className="flex items-start text-portage-900 pb-4">
      <div className="w-[8%]">{rank}</div>
      <div className="w-[16%]">{teamCode}</div>
      <div className="w-[16%]">{score}</div>
      <div className="w-[16%]">{good_intervals}</div>
      <div className="w-[16%]">{submission_count}</div>
      <div className="flex flex-col gap-1 w-[28%]">
        {splitMembers.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-4">
            {row.map((member) => (
              <span key={member.id}>{member.name}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
