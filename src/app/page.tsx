import Backdrop from "@/components/Backdrop";
import UserBanner from "@/components/UserBanner";
import WaitingRoom from "@/components/WaitingRoom";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <WaitingRoom/>
    </main>
  );
}
