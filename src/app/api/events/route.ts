import { NextResponse } from "next/server";
import prisma from "@/../lib/prisma";

type RequestBody = {
  startTime: Date;
  endTime: Date;
  name: string;
};

export async function POST(request: Request) {
  try {
    const { startTime, endTime, name } = (await request.json()) as RequestBody;

    if (!startTime || !endTime || !name) {
      return NextResponse.json(
        { error: "Missing required fields: startTime, endTime, or name" },
        { status: 400 }
      );
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { error: "startTime must be before endTime" },
        { status: 400 }
      );
    }
    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Invalid event name" },
        { status: 400 }
      );
    }
    // Create the event in the database
    const newEvent = await prisma.event.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        name: name.trim(),
        isActive:
          new Date(startTime) <= new Date() && new Date(endTime) > new Date(),
        timerDuration: Math.floor(
          (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
        ), // Duration in seconds
        submissionLimit: 500, // Provide a default or meaningful value
        leaderboardVisibleUntil: 300, // Provide a default or meaningful value
      },
    });

    // Respond with the created event
    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create event", details: error?.message },
      { status: 500 }
    );
  }
}
