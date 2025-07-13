import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Get user info from external auth server
    const { data: userInfo } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      }
    );

    const userEmail = userInfo.email;

    // Update user's team_id to null, leave team
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ team_id: null })
      .eq("email", userEmail)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "User successfully left the team",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Leave error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
