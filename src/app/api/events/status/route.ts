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
      },
    });
    console.log("Result:", result);
    if (!result) {
      throw new Error("No events found");
    }

    const eventid = result.id;
    return NextResponse.json({
      status: "success",
      eventid,
      isActive: result?.isActive,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
