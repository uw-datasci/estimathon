import { useState, useEffect } from "react";

interface UseCurrentTeamResult {
  teamId: string | null;
  teamCode: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useCurrentTeam(): UseCurrentTeamResult {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamCode, setTeamCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTeam() {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthenticated");
          throw new Error(`Team fetch failed (${res.status})`);
        }
        const { teamId, teamCode } = await res.json();
        if (isMounted) {
          setTeamId(teamId);
          setTeamCode(teamCode);
        }
      } catch (err: any) {
        console.error(err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  return { teamId, teamCode, isLoading, error };
}
