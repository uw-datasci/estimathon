import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_UWDSC_WEBSITE_SERVER_URL}/api/users/user`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      },
    );

    return NextResponse.json(
      {
        id: data.id ?? data._id ?? data.email, 
        name: data.username,
        role: data.userStatus,
        email: data.email,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }
}
