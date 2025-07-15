import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const { data: events, error } = await supabaseAdmin
    .from("events")
    .select("start_time, end_time")
    .order("start_time", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Could not fetch event:", error.message);
    redirect("/dashboard");
  }

  if (events && events.length) {
    const now = new Date();
    const startTime = new Date(events[0].start_time);
    const endTime = new Date(events[0].end_time);

    if (now < startTime) {
      redirect("/waiting"); 
    }
    else if (now < endTime) {
      redirect("/dashboard");
    }
  }

  return <LeaderboardClient />;
}
