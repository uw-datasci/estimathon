"use client";

interface QuestionGridProps {
  questions: { id: string }[];
  submissions: Record<string, { is_correct?: boolean; attempted?: boolean }>;
  currentQuestionId?: string;
  onSelect?: (id: string) => void;
}

export default function QuestionGrid({
  questions,
  submissions,
  currentQuestionId,
  onSelect,
}: QuestionGridProps) {
  return (
    <div className="bg-portage-50 border border-portage-50 rounded-lg p-3 grid grid-cols-5 gap-2 md:grid-cols-3 lg:grid-cols-5">
      {questions.map((q, idx) => {
        const sub = submissions[q.id];
        let color = "bg-portage-400";
        if (sub) {
          if (sub.is_correct) color = "bg-green-400";
          else if (sub.attempted) color = "bg-red-400";
        }
        return (
          <button
            key={q.id}
            className={`rounded w-8 h-8 flex items-center justify-center text-white font-bold ${color} ${
              currentQuestionId === q.id ? "ring-2 ring-portage-900" : ""
            }`}
            onClick={() => onSelect && onSelect(q.id)}
            aria-label={`Question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}
