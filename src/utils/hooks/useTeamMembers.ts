import { useEffect, useState } from "react";
import { useCurrentTeam } from "./useCurrentTeam";

export interface TeamMember {
  id: string;
  name: string;
}

export function useTeamMembers() {
  const { teamId, isLoading: teamLoading, error: teamError } = useCurrentTeam();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teamLoading || !teamId) return;

    async function fetchMembers() {
      setLoading(true);
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) {
          throw new Error(`Failed to load members (${res.status})`);
        }
        const body = await res.json();
        setMembers(body.members || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to fetch members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [teamId, teamLoading]);

  return {
    members,
    loading: loading || teamLoading,
    error: error || teamError,
  };
}
