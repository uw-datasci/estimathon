// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { supabaseAdmin } from "@/lib/supabase";

export default async function Home() {
  // 1) auth check
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // 2) get user email from external auth service
  let userEmail: string;
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      }
    );
    userEmail = data.email;
  } catch (err) {
    // if the token is invalid / expired
    redirect("/login");
  }

  // 3) look up the user's team_id in Supabase
  const { data: userRow, error: userError } = await supabaseAdmin
    .from("users")
    .select("team_id")
    .eq("email", userEmail)
    .single();

  // if no record or any error, treat as “not in a team yet”
  if (userError || !userRow?.team_id) {
    redirect("/landing");
  }
  const teamId = userRow.team_id;

  // 4) fetch the latest event
  const { data: events, error: eventError } = await supabaseAdmin
    .from("events")
    .select("start_time, end_time")
    .order("start_time", { ascending: false })
    .limit(1);

  // if no events found, just send them to dashboard
  if (eventError || !events || events.length === 0) {
    redirect("/dashboard");
  }

  const { start_time, end_time } = events[0];
  const now = new Date();
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);

  // 5) route based on whether the event is currently active
  if (now < startTime || now > endTime) {
    redirect("/waiting");
  }

  // event is live!
  redirect("/dashboard");
}
