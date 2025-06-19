import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Team code required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("teams")
    .select("id")
    .eq("code", code)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const exists = !!data;
  return NextResponse.json({ exists });
}
