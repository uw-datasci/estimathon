// app/api/teams/[teamId]/members/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  // 1. require auth
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const { teamId } = await context.params;
  try {
    // 2. query members by team_id
    const { data: members, error } = await supabaseAdmin
      .from("users")
      .select("id, name")
      .eq("team_id", teamId);

    if (error) throw error;

    // 3. return array of { id, name }
    return NextResponse.json({ members });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error fetching team members:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
