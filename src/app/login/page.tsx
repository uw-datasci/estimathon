// src/app/login/page.tsx
import LoginPage from "./LoginPage";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const raw = (await searchParams).return;
  const returnTo =
    Array.isArray(raw) ? raw[0] :
    typeof raw === "string" ? raw :
    "/";

  return <LoginPage returnTo={returnTo} />;
}
