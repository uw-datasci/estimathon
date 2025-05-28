import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const { teamId } = params;
  const submissions = await prisma.submission.findMany({ where: { teamId } });
  // TODO: Join with Question model to check correctness and score
  return NextResponse.json(submissions);
}
