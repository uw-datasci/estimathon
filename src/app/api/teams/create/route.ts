import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code } = body;

  // Need to submit a team code to make a team
  if (!code) {
    return NextResponse.json({ error: "Team code required" }, { status: 400 });
  }

  // Check if team with same code exists
  const { data: existing, error: checkError } = await supabase
    .from('teams')
    .select('id')
    .eq('code', code)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
    return NextResponse.json({ error: checkError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: "Team with code already exists" },
      { status: 400 }
    );
  }

  // Create team
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      code: code,
      event_id: "",
      score: 0,
      good_interval: 0
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Team created", team });
}