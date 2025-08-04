export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";  
import UserQuestionsClient from "./UserQuestionsClient";

export default async function DashboardPage() {
  // only render dashboard if event is live, otherwise redirect to /waiting
  const { data: events, error } = await supabaseAdmin
    .from("events")
    .select("start_time, end_time")
    .order("start_time", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Failed to fetch events:", error.message);
    redirect("/");
  }

  if (events && events.length > 0) {
    const now = new Date();
    const startTime = new Date(events[0].start_time);
    const endTime   = new Date(events[0].end_time);

    // not yet started or already ended
    if (now < startTime) {
      redirect("/waiting");
    }
    if (now > endTime) {
      redirect("/leaderboard");
    }
  }

  return <UserQuestionsClient />;
}
