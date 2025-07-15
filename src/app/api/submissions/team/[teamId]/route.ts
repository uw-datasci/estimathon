import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await context.params;

  const { count, error } = await supabaseAdmin 
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ remaining: 18 - (count || 0) });
}
