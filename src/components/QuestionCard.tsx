"use client";
import { useState, useEffect } from "react";

interface QuestionCardProps {
  question: {
    id: string;
    title?: string;
    content?: string;
    text?: string;
  };
  submission?: {
    min_value: number;
    max_value: number;
    is_correct?: boolean;
  };
  onSubmit: (min: number, max: number) => Promise<void>;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  submission,
  onSubmit,
  disabled,
}: QuestionCardProps) {
  const [lower, setLower] = useState<string>("");
  const [upper, setUpper] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize input fields with previous submission values
  useEffect(() => {
    if (submission && !submission.is_correct) {
      setLower(submission.min_value.toString());
      setUpper(submission.max_value.toString());
    }
  }, [submission]);

  const borderColor = submission
    ? submission.is_correct
      ? "border-green-400"
      : "border-red-400"
    : "border-portage-200";

  const isDisabled = loading || disabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(Number(lower), Number(upper));
      setLower("");
      setUpper("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={`bg-portage-50 border ${borderColor} rounded-lg p-6 flex flex-col gap-2 shadow-md`}
      onSubmit={handleSubmit}
    >
      <h3 className="text-portage-700 text-lg font-bold">
        {question.text}
      </h3>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <div className="flex flex-row gap-3 items-center">
          <label className="text-portage-700">Lower bound:</label>
          <input
            type="number"
            className="border text-portage-700 rounded px-2 py-1 w-48 bg-white"
            value={lower}
            onChange={(e) => setLower(e.target.value)}
            disabled={isDisabled}
            required
            min="0"
            step="1"
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <label className="text-portage-700">Upper bound:</label>
          <input
            type="number"
            className="border text-portage-700 rounded px-2 py-1 w-48 bg-white"
            value={upper}
            onChange={(e) => setUpper(e.target.value)}
            disabled={isDisabled}
            required
            min="0"
            step="1"
          />
        </div>
        <button
          type="submit"
          className="bg-portage-400 text-white rounded p-2 hover:bg-blue-400 px-4 py-2 ml-auto"
          disabled={isDisabled}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
      <div className="flex flex-row items-center justify-between mt-2">
        {submission && (
          <div className="text-portage-700 text-xs">
            <span className="font-semibold">Prev. submission:</span>{" "}
            {submission.min_value} - {submission.max_value}
          </div>
        )}
        <div className="flex-1" />
        {submission && (
          <div
            className={`text-xs font-semibold ${
              submission.is_correct ? "text-green-600" : "text-red-600"
            }`}
          >
            {submission.is_correct ? "Correct" : "Incorrect"}
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </form>
  );
}
