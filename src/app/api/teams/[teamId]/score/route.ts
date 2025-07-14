import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const { teamId } = await params;

  const { data, error } = await supabaseAdmin
    .from("teams")
    .select("score, good_interval")
    .eq("id", teamId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    score: data.score ?? 0,
    goodInterval: data.good_interval ?? 0,
  });
}
