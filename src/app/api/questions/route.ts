import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('released', true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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

  const { data: question, error } = await supabaseAdmin
    .from('questions')
    .insert({ text, answer, released: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question);
}
