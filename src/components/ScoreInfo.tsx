"use client";

interface ScoreInfoProps {
  score: number;
  correctIntervals: number;
  total: number;
  remainingGuesses: number;
  maxGuesses: number;
}

export default function ScoreInfo({
  score,
  correctIntervals,
  total,
  remainingGuesses,
  maxGuesses,
}: ScoreInfoProps) {
  return (
    <div className="bg-portage-50 rounded-lg p-4 text-portage-700 text-sm flex flex-col gap-2">
      <div>
        <span className="font-semibold">Current score:</span> {score}
      </div>
      <div>
        <span className="font-semibold">Correct intervals:</span> {correctIntervals}/{total}
      </div>
      <div>
        <span className="font-semibold">Remaining guesses:</span>{" "}
        {remainingGuesses}/{maxGuesses}
      </div>
    </div>
  );
}
