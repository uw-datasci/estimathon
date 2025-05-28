import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const body = await req.json();
  const { code } = body;

  // Need to submit a team code to make a team
  if (!code) {
    return NextResponse.json({ error: "Team code required" }, { status: 400 });
  }

  // Find to see if a team with the same name exists
  const existing = await prisma.team.findFirst({ where: { code } });
  if (existing) {
    return NextResponse.json(
      { error: "Team with name already exists" },
      { status: 400 }
    );
  }

  // Make team
  const team = await prisma.team.create({
    data: {
      code: code,
      eventId: "",
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ message: "Team created", team });
}
