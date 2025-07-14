import { TeamMember } from "@/utils/hooks/useTeamMembers";
import clsx from "clsx";

interface PodiumTeamCardProps {
  teamCode: string;
  members: TeamMember[];
  score: number;
  bgColourClass: string;
  textColourClass: string;
}

export default function PodiumTeamCard({
  teamCode,
  members,
  score,
  bgColourClass,
  textColourClass,
}: PodiumTeamCardProps) {
  // Split members into two columns if more than 4
  const teamMembers = members ?? [];
  const midpoint = Math.ceil(teamMembers.length / 2);
  const splitMembers =
    teamMembers.length > 4
      ? [teamMembers.slice(0, midpoint), teamMembers.slice(midpoint)]
      : [teamMembers];

  return (
    <div
      className={`${bgColourClass} p-4 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.2)] w-full h-full aspect-[4/3] flex flex-col justify-between`}
    >
      <h1 className={`${textColourClass} mb-2 text-xl`}>Team {teamCode}</h1>
      <div
        className={`grid gap-2 h-[50%] ${
          splitMembers.length === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {splitMembers.map((col, colIdx) => (
          <div key={colIdx} className="">
            {col.map((member, index) => (
              <div
                key={member.id}
                className={`${textColourClass} p-2 rounded text-sm`}
              >
                <span
                  className={clsx(
                    "inline-block h-4 w-4 rounded-full mr-2",
                    ["bg-portage-900", "bg-portage-700", "bg-portage-500"][
                      index % 3
                    ]
                  )}
                />
                {member.name}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={`${textColourClass} p-2 rounded`}>
        Score:{" "}
        <span className={`${textColourClass} p-2 rounded text-2xl`}>
          {score}
        </span>
      </div>
    </div>
  );
}
