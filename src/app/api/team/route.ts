// app/api/team/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  // 1) Auth via token cookie
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // 2) Retrieve user email from external auth service
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      }
    );
    const userEmail = data.email;

    // 3) Lookup team_id in Supabase
    const { data: userRow, error } = await supabaseAdmin
      .from("users")
      .select("team_id")
      .eq("email", userEmail)
      .single();

    if (error) throw error;

    // 4) Return { teamId: string|null }
    return NextResponse.json({ teamId: userRow.team_id });
  } catch (err: any) {
    console.error("Error fetching current team:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
