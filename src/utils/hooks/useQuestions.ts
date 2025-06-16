"use client";
import { useState, useEffect } from "react";

export interface Question {
  id: string;
  title?: string;
  content?: string;
  text?: string;
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  return { questions, loading, error };
}
