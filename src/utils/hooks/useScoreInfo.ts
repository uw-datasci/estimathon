"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";

export function useScoreInfo(teamId: string | undefined) {
  const [remainingGuesses, setRemainingGuesses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScore = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`/api/submissions/team/${teamId}`);
      if (!res.ok) throw new Error("Failed to fetch score info");
      const data = await res.json();
      setRemainingGuesses(data.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  // Subscribe to realtime changes on this team's submission count
  useEffect(() => {
    if (!teamId) return;

    const channel = supabase
      .channel(`teams-score:id=eq.${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          const row = payload.new as { submission_count: number };
          setRemainingGuesses(18 - (row.submission_count ?? 0));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  return { remainingGuesses, loading, error };
}
