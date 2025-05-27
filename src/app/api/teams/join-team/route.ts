import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
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

    // Get team
    const team = await prisma.team.findFirst({
      where: { code: teamCode },
      include: { members: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if team is full
    if (team.members.length >= 8) {
      return NextResponse.json(
        { error: "Team is full (max 8 members)" },
        { status: 400 }
      );
    }

    // Check if user already joined a team
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      // If user isn't in database, add the user
      user = await prisma.user.create({
        data: {
          clubId: "",
          name: data.username,
          email: data.email,
        },
      });
    }

    if (user.teamId) {
      return NextResponse.json(
        { error: "User is already on a team" },
        { status: 400 }
      );
    }

    // Update user with new teamId
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { teamId: team.id },
    });

    return NextResponse.json({
      message: "User successfully joined team",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Join error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
