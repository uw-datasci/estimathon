"use client";

import { useState, useEffect } from "react";

interface Event {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  submission_limit: number;
  created_at: string;
}

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event = await response.json();
        setEvent(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(event.end_time).getTime();
      const newTimeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event]);

  return { timeLeft, loading, error, event };
}
