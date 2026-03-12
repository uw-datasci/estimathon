"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";

export interface Submission {
  id: string;
  question_id: string;
  min_value: number;
  max_value: number;
  is_correct?: boolean;
  created_at?: string;
}

export function useSubmissions(teamId: string | undefined) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`/api/submissions/team/${teamId}/history`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Subscribe to realtime changes on submissions for this team
  useEffect(() => {
    if (!teamId) return;

    const channel = supabase
      .channel(`submissions:team_id=eq.${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, fetchSubmissions]);

  return { submissions, loading, error, refetch: fetchSubmissions };
}
