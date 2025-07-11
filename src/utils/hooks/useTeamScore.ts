import { useState, useEffect } from "react";

export function useTeamScore(teamId: string | null) {
  const [score, setScore] = useState<number | null>(null);
  const [goodIntervals, setGoodIntervals] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;

    async function fetchScore() {
      try {
        const res = await fetch(`/api/teams/${teamId}/score`);
        if (!res.ok) throw new Error("Failed to fetch score");
        const data = await res.json();
        setScore(data.score);
        setGoodIntervals(data.goodInterval);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [teamId]);

  return {
    score: score ?? 0,
    goodIntervals: goodIntervals ?? 0,
    loading,
    error,
  };
}
