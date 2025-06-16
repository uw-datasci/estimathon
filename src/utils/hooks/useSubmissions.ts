"use client";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!teamId) return;
    async function fetchSubmissions() {
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
    }
    fetchSubmissions();
  }, [teamId]);

  return { submissions, loading, error };
}
