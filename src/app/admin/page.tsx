import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const host = (await headers()).get("host");
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  
  try {
    const response = await fetch(`${proto}://${host}/api/me`, {
      method: "GET",
      headers: { Cookie: `token=${token}` },
    });

    const data = await response.json();
    if (data.role !== "admin" && data.role !== "exec") {
      redirect("/dashboard");
    }

    return <AdminDashboard />;
  } catch (error) {
    redirect("/login");
  }
}