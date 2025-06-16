"use client";

import QuestionCard from "../../components/QuestionCard";
import TimeLeft from "../../components/TimeLeft";

export default function UserQuestions() {
  // Mock data for now - multiple questions
  const sampleQuestions = [
    {
      id: "1",
      title: "Jellybeans",
      content: "How many jellybeans are in this jar?",
    },
    {
      id: "2",
      title: "Population",
      content: "What is the population of Canada?",
    },
    {
      id: "3",
      title: "Height",
      content: "How tall is the CN Tower in meters?",
    },
    {
      id: "4",
      title: "Books",
      content: "How many books are published worldwide each year?",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E1EAF8] via-[#CADAF3] to-[#B3C9EE]">
      <div>
        <TimeLeft />
      </div>
      <div className="w-full flex justify-end px-6">
        <div className="w-full md:w-7/10 flex flex-col gap-6">
          {sampleQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </main>
  );
}
