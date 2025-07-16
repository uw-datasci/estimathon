import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("teams")
    .select("submission_count")
    .eq("id", teamId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const submissionCount = data.submission_count || 0;
  return NextResponse.json({ remaining: 18 - submissionCount });
}
