import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const { teamId } = params;
  const count = await prisma.submission.count({ where: { teamId } });
  return NextResponse.json({ remaining: 18 - count });
}
