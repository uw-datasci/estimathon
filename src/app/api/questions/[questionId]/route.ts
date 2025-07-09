import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  req: Request,
  context: { params: { questionId: string } }
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Check admin status
  const host = (await headers()).get("host");
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${proto}://${host}/api/me`, {
    method: "GET",
    headers: { Cookie: `token=${token}` },
  });

  const data = await response.json();
  if (data.role !== "admin" && data.role !== "exec") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const { questionId } = await context.params;
  const updateData = await req.json();

  // Remove fields that shouldn't be updated
  delete updateData.id;
  delete updateData.created_at;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const { data: question, error } = await supabaseAdmin
    .from('questions')
    .update(updateData)
    .eq('id', questionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question);
}

export async function DELETE(
  req: Request,
  context: { params: { questionId: string } }
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Check admin status
  const host = (await headers()).get("host");
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${proto}://${host}/api/me`, {
    method: "GET",
    headers: { Cookie: `token=${token}` },
  });

  const data = await response.json();
  if (data.role !== "admin" && data.role !== "exec") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const { questionId } = await context.params;

  const { error } = await supabaseAdmin
    .from('questions')
    .delete()
    .eq('id', questionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}