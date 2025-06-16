"use client";

import { useTimer } from "@/utils/hooks/useTimer";

export default function TimeLeft() {
  const { timeLeft, loading, error } = useTimer();

  if (loading) {
    return (
      <div className="bg-portage-900 rounded-lg p-6 text-portage-200">
        Loading timer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-portage-900 rounded-lg p-6 text-red-400">
        Error: {error}
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-portage-900 rounded-lg p-6">
      <h3 className="text-portage-200 text-lg">Time Left</h3>
      <div className="flex flex-row gap-6">
        <span className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
