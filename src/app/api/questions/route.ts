import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

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

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      }
    );

    if (data.userStatus !== "admin") {
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
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
