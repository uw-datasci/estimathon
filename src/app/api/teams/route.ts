import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          select: {
            name: true,
            email: true,
          },
        },
        submissions: true, // includes all submissions per team
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams: ", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
