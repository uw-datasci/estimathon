import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  id: string;
  code: string;
  score: number;
  good_interval: number;
  members: { id: string; name: string }[];
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();

        const enriched = await Promise.all(
          (data.leaderboard || []).map(async (entry: any) => {
            const memberRes = await fetch(`/api/teams/${entry.id}`);
            const memberData = await memberRes.json();
            return {
              ...entry,
              members: memberData.members || [],
            };
          })
        );

        setLeaderboard(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, error };
}
