import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const questions = await prisma.question.findMany({
    where: { released: true },
  });
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/me`,
    {
      method: "GET",
      headers: { Cookie: `token=${token}` },
    }
  );

  const data = await response.json();
  if (data.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const { text, answer } = await req.json();
  if (!text || answer == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: { text, answer, released: false },
  });

  return NextResponse.json(question);
}
