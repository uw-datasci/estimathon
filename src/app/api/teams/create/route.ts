import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const body = await req.json();
  const { code } = body;

  // get user from cookies, check if user is valid

  if (!code) {
    return NextResponse.json({ error: "Team code required" }, { status: 400 });
  }

  const existing = await prisma.team.findFirst({ where: { code } });
  if (existing) {
    return NextResponse.json(
      { error: "Team with name already exists" },
      { status: 400 }
    );
  }

  const team = await prisma.team.create({
    data: {
      code: code,
      eventId: "",
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ message: "Team created", team });
}

/*
use cookies to get user
*/
