"use client";
import { useState, useEffect } from "react";

export function useScoreInfo(teamId: string | undefined) {
  const [remainingGuesses, setRemainingGuesses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    async function fetchScore() {
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
    }
    fetchScore();
  }, [teamId]);

  return { remainingGuesses, loading, error };
}
