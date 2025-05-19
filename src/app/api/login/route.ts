import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/login`,
    { email: email.toLowerCase(), password },
    { headers: { "Content-Type": "application/json" } }
  );

  (await cookies()).set({
    name: "token",
    value: data.accessToken,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 120,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ name: data.name, role: data.role }, { status: 200 });
}
