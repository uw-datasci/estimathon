"use client";

export default function QuestionCard({
  question,
}: {
  question: {
    id: string;
    title: string;
    content?: string;
  };
}) {
  return (
    <div className="bg-portage-50 border rounded-lg p-6">
      <h3 className="text-portage-700 text-lg">
        Question {question.id}: {question.content}
      </h3>
      <div className="flex flex-row gap-6">
        <div className="flex flex-row gap-3">
          <label className="text-portage-700">Lower Bound:</label>
          <input type="number" className="border text-portage-700 rounded" />
        </div>
        <div className="flex flex-row gap-3">
          <label className="text-portage-700 mb-1">Upper Bound:</label>
          <input type="number" className="border border-portage-700 rounded" />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-portage-400 text-white rounded p-2 hover:bg-blue-400 px-4 py-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
