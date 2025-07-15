import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { teamCode } = await req.json();
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // Get user info from external auth server
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      }
    );

    const userEmail = data.email;

    // Get team with member count
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select(
        `
        *,
        members:users(id)
      `
      )
      .eq("code", teamCode)
      .single();

    if (teamError) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if team is full
    if (team.members && team.members.length >= 8) {
      return NextResponse.json(
        { error: "Team is full (max 8 members)" },
        { status: 400 }
      );
    }

    // Check if user exists, create if not
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    let user;
    if (userCheckError && userCheckError.code === "PGRST116") {
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          club_id: "",
          name: data.username,
          email: data.email,
          team_id: team.id,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        );
      }

      user = newUser;
    } else if (existingUser) {
      // User exists, update their team
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ team_id: team.id })
        .eq("email", userEmail)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      user = updatedUser;
    } else {
      return NextResponse.json(
        { error: userCheckError ? userCheckError.message : userCheckError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User successfully joined team",
      user: user,
    });
  } catch (error) {
    console.error("Join error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
