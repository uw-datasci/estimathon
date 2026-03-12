"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserQuestionsClient from "./UserQuestionsClient";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function checkEventStatus() {
      const res = await fetch("/api/events/status");
      if (!res.ok) {
        router.replace("/");
        return;
      }
      const { event } = await res.json();
      if (!event) {
        router.replace("/");
        return;
      }
      const now = new Date();
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);

      if (now < startTime) {
        router.replace("/waiting");
        return;
      }
      if (now > endTime) {
        router.replace("/leaderboard");
        return;
      }
      setReady(true);
    }
    checkEventStatus();
  }, [router]);

  if (!ready) return null;

  return <UserQuestionsClient />;
}
