import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Get the latest event by start_time
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!events || events.length === 0) {
    return NextResponse.json({ error: "No events found" }, { status: 404 });
  }

  const event = events[0];
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);

  const isActive = now >= startTime && now <= endTime;

  return NextResponse.json({
    event,
    active: isActive
  });
}