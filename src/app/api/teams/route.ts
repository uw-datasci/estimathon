import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:users(name, email),
        submissions(*)
      `);

    if (error) {
      throw error;
    }

    return NextResponse.json(teams);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching teams: ", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}