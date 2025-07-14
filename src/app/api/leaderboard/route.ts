import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("teams")
      .select("id, code, score, good_interval")
      .order("score", { ascending: false });

    if (error) {
      console.error("Leaderboard fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leaderboard: data });
  } catch (err: any) {
    console.error("Unexpected leaderboard error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
