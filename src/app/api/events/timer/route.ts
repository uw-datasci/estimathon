import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/../lib/prisma";

type TimerBody = {
  increment: number;
};

export async function POST(request: Request) {
  try {
    let { increment } = (await request.json()) as TimerBody;
    if (typeof increment !== "number" || increment < 0) {
      return NextResponse.json(
        { error: "Invalid increment value" },
        { status: 400 }
      );
    }
    console.log("Increment value:", increment);
    const result = await prisma.event.findFirst({
      orderBy: {
        endTime: "desc",
      },
      select: {
        id: true,
        isActive: true,
        endTime: true,
        timerDuration: true,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = (await headers()).get("host");

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
    let newEndTime = new Date(result.endTime);
    newEndTime.setSeconds(newEndTime.getSeconds() + increment);
    let newIsActive = newEndTime > new Date();
    let newTimerDuration = result.timerDuration + increment;

    const updatedEvent = await prisma.event.update({
      where: { id: result.id },
      data: {
        endTime: newEndTime,
        isActive: newIsActive,
        timerDuration: newTimerDuration,
      },
    });

    return NextResponse.json({
      message: "Updated endTime succesfully",
      updatedEvent,
    });
  } catch (error: any) {
    console.error("Error processing request:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
