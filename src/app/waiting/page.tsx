"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useCurrentTeam } from "@/utils/hooks/useCurrentTeam";
import { useUserInfo } from "@/utils/hooks/useUserInfo";

interface TeamMember {
  id: string;
  name: string;
}

export default function WaitingPage() {
  const router = useRouter();

  // Getting user info
  const { user, loading, error } = useUserInfo();

  // 1) get teamId
  const { teamId, isLoading: teamLoading, error: teamError } = useCurrentTeam();

  // 2) fetch members
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    // redirect if not in a team
    if (!teamLoading && !teamId) {
      router.push("/landing");
    }
  }, [teamLoading, teamId, router]);

  useEffect(() => {
    if (teamLoading || !teamId) return;

    async function fetchMembers() {
      setMembersLoading(true);
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) {
          throw new Error(`Failed to load members (${res.status})`);
        }
        const body = await res.json();
        setMembers(body.members);
      } catch (err: any) {
        console.error(err);
        setMembersError(err.message);
      } finally {
        setMembersLoading(false);
      }
    }

    fetchMembers();
  }, [teamLoading, teamId]);

  // 3) fetch event and timer (unchanged)
  const [eventStartTime, setEventStartTime] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          console.error("Failed to fetch event data");
          return;
        }
        const evt = await res.json();
        setEventStartTime(evt.start_time);
      } catch (e) {
        console.error("Error fetching event:", e);
      }
    }
    fetchEvent();
  }, []);

  useEffect(() => {
    if (!eventStartTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const start = new Date(eventStartTime).getTime();
      const delta = start - now;
      setRemaining(delta <= 0 ? 0 : delta);
    };

    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [eventStartTime]);

  // 4) handle overall loading / error
  if (teamLoading || membersLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }
  if (teamError) {
    return <p className="text-red-600">Error loading team: {teamError}</p>;
  }
  if (membersError) {
    return (
      <p className="text-red-600">Error loading members: {membersError}</p>
    );
  }

  const clock =
    remaining != null && remaining > 0
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
        Are you ready,{" "}
        <span className="font-bold">{(user?.name)?.split(' ')[0] ?? "player"}</span>?
      </h2>

      <div className="rounded-xl bg-portage-600 px-14 py-12 text-white shadow-lg">
        <p className="text-5xl sm:text-6xl font-semibold tabular-nums">
          {clock}
        </p>
        <p className="mt-3 text-sm sm:text-base text-white/90">
          {remaining === 0 ? "Event has started!" : "Until questions release"}
        </p>
      </div>

      <aside className="rounded-xl border border-blue-200/60 bg-white/80 p-6 w-60 backdrop-blur">
        <h3 className="mb-3 font-semibold text-portage-600">Your team</h3>
        <ul className="space-y-2">
          {members.map((m, i) => (
            <li
              key={m.id}
              className="flex items-center gap-3 text-sm text-portage-600"
            >
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

      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/teams/leave-team", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
              const { error } = await res.json();
              throw new Error(error || "Failed to leave team");
            }

            router.push("/landing");
          } catch (err: any) {
            alert("Error leaving team: " + err.message);
          }
        }}
        className="px-6 py-2 rounded bg-portage-600 text-white hover:bg-portage-900"
      >
        Leave Team
      </button>
    </main>
  );
}
