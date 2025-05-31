import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";           

export const config = { runtime: "nodejs" };        

export async function GET(req: NextRequest) {
  if (!(global as any).io) {
    const io = new Server({
      path: "/api/socket",
      transports: ["websocket"],
    });

    io.use((socket, next) => {
      const user = getAuthUser(socket.handshake.headers.cookie);
      if (!user) return next(new Error("unauth"));
      socket.data.user = user;                      
      return next();
    });

    io.on("connection", (socket) => {
      const user = socket.data.user;
      console.log("WS connect", user.username);

      socket.join(`player:${user.id}`);

      socket.on("joinTeamRoom", (teamId: string) => {
        socket.join(`team:${teamId}`);
      });
    });

    (global as any).io = io;
  }
  return NextResponse.json({ ok: true });
}
