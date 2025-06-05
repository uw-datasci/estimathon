import { NextResponse } from "next/server";
import prisma from "@/../lib/prisma";

export async function GET(request: Request) {
  try {
    console.log("Here");
    const result = await prisma.event.findFirst({
      orderBy: {
        endTime: "desc",
      },
      select: {
        id: true,
        isActive: true,
        name: true,
        startTime: true,
        endTime: true,
        timerDuration: true,
      },
    });
    if (!result) {
      throw new Error("No events found");
    }

    return NextResponse.json(
      {
        event: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
