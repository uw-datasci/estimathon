import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  context: { params: { teamId: string } }
) {
  const { teamId } = await context.params;

  const { count, error } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ remaining: 18 - (count || 0) });
}
