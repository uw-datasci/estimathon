"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface Props { teamId: string }

export default function WaitingPage({ teamId }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [eventStartTime, setEventStartTime] = useState<string | null>(null);

  // Fetch event data from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const event = await response.json();
          setEventStartTime(event.start_time);
        } else {
          console.error('Failed to fetch event data');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  // Timer effect to calculate remaining time
  useEffect(() => {
    if (!eventStartTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const startTime = new Date(eventStartTime).getTime();
      const timeLeft = startTime - now;

      if (timeLeft <= 0) {
        setRemaining(0);
        // Optionally redirect to quiz when timer reaches 0
        // window.location.href = "/quiz";
      } else {
        setRemaining(timeLeft);
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [eventStartTime]);


  const clock = remaining != null && remaining > 0
    ? new Date(remaining).toISOString().substr(11, 8)
    : remaining === 0
    ? "00:00:00"
    : "--:--:--";

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center gap-10 px-6 sm:px-12 bg-gradient-to-br from-white to-portage-200">
      <header className="absolute left-6 top-6">
        <img
          src="/dsc.svg"
          alt="UW DSC logo"
          className="h-16 w-auto text-portage-600"
        />      
      </header>

      <h2 className="text-2xl sm:text-3xl font-medium text-portage-600">
        Are you ready, <span className="font-bold">{members[0]?.name ?? "player"}</span>?
      </h2>

      <div className="rounded-xl bg-portage-600 px-14 py-12 text-white shadow-lg">
        <p className="text-5xl sm:text-6xl font-semibold tabular-nums">{clock}</p>
        <p className="mt-3 text-sm sm:text-base text-white/90">
          {remaining === 0 ? "Event has started!" : "Until questions release"}
        </p>
      </div>

      <aside className="rounded-xl border border-blue-200/60 bg-white/80 p-6 w-60 backdrop-blur">
        <h3 className="mb-3 font-semibold text-portage-600">Your team</h3>
        <ul className="space-y-2">
          {members.map((m, i) => (
            <li key={m.id} className="flex items-center gap-3 text-sm">
              <span
                className={clsx(
                  "h-4 w-4 rounded-full",
                  ["bg-portage-900", "bg-portage-600", "bg-portage-400"][i % 3]
                )}
              />
              {m.name}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
