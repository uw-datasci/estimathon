import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";

const MAX_GUESSES = 18;

export function useTeamScore(teamId: string | null) {
  const [score, setScore] = useState<number | null>(null);
  const [goodIntervals, setGoodIntervals] = useState<number | null>(null);
  const [remainingGuesses, setRemainingGuesses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScore = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`/api/teams/${teamId}/score`);
      if (!res.ok) throw new Error("Failed to fetch score");
      const data = await res.json();
      setScore(data.score);
      setGoodIntervals(data.goodInterval);
      setRemainingGuesses(data.remaining ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  // Subscribe to realtime changes on this team's record
  useEffect(() => {
    if (!teamId) return;

    const channel = supabase
      .channel(`teams:id=eq.${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          const row = payload.new as {
            score: number;
            good_interval: number;
            submission_count: number;
          };
          setScore(row.score);
          setGoodIntervals(row.good_interval);
          setRemainingGuesses(MAX_GUESSES - (row.submission_count ?? 0));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  return {
    score: score ?? 0,
    goodIntervals: goodIntervals ?? 0,
    remainingGuesses,
    loading,
    error,
    refetch: fetchScore,
  };
}
