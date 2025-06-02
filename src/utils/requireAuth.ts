import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const jwt = (await cookies()).get("token");
  if (!jwt) redirect("/login?return=/");
}
