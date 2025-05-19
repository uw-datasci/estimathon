import UserBanner from "../components/UserBanner";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">UW DSC Estimathon</h1>
      <UserBanner />
    </main>
  );
}
