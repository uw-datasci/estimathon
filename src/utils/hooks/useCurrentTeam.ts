import { useState, useEffect } from "react";

interface UseCurrentTeamResult {
  teamId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useCurrentTeam(): UseCurrentTeamResult {
  const [teamId, setTeamId] = useState<string | null>(null);
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
        const { teamId } = await res.json();
        if (isMounted) setTeamId(teamId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return { teamId, isLoading, error };
}
