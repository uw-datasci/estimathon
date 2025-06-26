import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
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
  if (data.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const { name, start_time, end_time } = await req.json();
  
  if (!name || !start_time || !end_time) {
    return NextResponse.json(
      { error: "Missing required fields: name, start_time, end_time" },
      { status: 400 }
    );
  }

  const { data: event, error } = await supabaseAdmin
    .from('events')
    .insert({
      name,
      start_time,
      end_time,
      submission_limit: 18
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(event);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  let query = supabase.from('events').select('*');

  if (id) {
    query = query.eq('id', id);
    const { data: event, error } = await query.single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } else {
    // Get latest event by start_time
    const { data: events, error } = await query
      .order('start_time', { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!events || events.length === 0) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    return NextResponse.json(events[0]);
  }
}

export async function PUT(req: Request) {
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
  if (data.role !== "admin"  && data.role !== "exec") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const updateData = await req.json();

  // Remove id from update data if it exists
  delete updateData.id;
  delete updateData.created_at;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  let query = supabaseAdmin.from('events');

  if (id) {
    query = query.eq('id', id);
  } else {
    // Find the latest event by start_time
    const { data: latestEvent, error: findError } = await supabase
      .from('events')
      .select('id')
      .order('start_time', { ascending: false })
      .limit(1)
      .single();

    if (findError || !latestEvent) {
      return NextResponse.json(
        { error: "No event found to update" },
        { status: 404 }
      );
    }

    query = query.eq('id', latestEvent.id);
  }

  const { data: event, error } = await query
    .update(updateData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(event);
}