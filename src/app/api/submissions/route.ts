import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { teamId, questionId, min_value, max_value } = await req.json();
  if (!teamId || !questionId || min_value == null || max_value == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const count = await prisma.submission.count({ where: { teamId } });
  if (count >= 18) {
    return NextResponse.json(
      { error: "Submission limit reached" },
      { status: 403 }
    );
  }

  const submission = await prisma.submission.upsert({
    where: { teamId_questionId: { teamId, questionId } },
    update: { min_value, max_value },
    create: { teamId, questionId, min_value, max_value },
  });

  return NextResponse.json(submission);
}
