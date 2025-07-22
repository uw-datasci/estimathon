"use client";

import { useEffect, useRef, useState } from "react";
import TimeLeft from "../../components/TimeLeft";
import QuestionCard from "../../components/QuestionCard";
import QuestionGrid from "../../components/QuestionGrid";
import ScoreInfo from "../../components/ScoreInfo";
import Image from "next/image";
import { useQuestions } from "@/utils/hooks/useQuestions";
import { useSubmissions, Submission } from "@/utils/hooks/useSubmissions";
import { useScoreInfo } from "@/utils/hooks/useScoreInfo";
import Modal from "../../components/Modal";
import { useTimer } from "@/utils/hooks/useTimer";
import React from "react";
import { useCurrentTeam } from "@/utils/hooks/useCurrentTeam";
import { useTeamScore } from "@/utils/hooks/useTeamScore";
import { useRouter } from "next/navigation";

export default function UserQuestionsClient() {
  const router = useRouter();
  const { teamId, teamCode } = useCurrentTeam();
  const { questions } = useQuestions();
  const { submissions } = useSubmissions(teamId ?? undefined);
  const { remainingGuesses, loading: scoreLoading } = useScoreInfo(
    teamId ?? undefined
  );
  const { score, goodIntervals } = useTeamScore(teamId);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { timeLeft } = useTimer();
  const [showOutOfGuesses, setShowOutOfGuesses] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const initialTimerRef = useRef(true);

  // Map submissions by question id for fast lookup
  const submissionMap: Record<string, Submission & { attempted?: boolean }> =
    {};
  submissions.forEach((s) => {
    submissionMap[s.question_id] = { ...s, attempted: true };
  });

  const total = questions.length;
  const maxGuesses = 18;

  // ignore the very first render
  useEffect(() => {
    if (initialTimerRef.current) {
      initialTimerRef.current = false;
    } else if (timeLeft === 0 && !scoreLoading) {
      setShowTimeUpModal(true);
      router.push("/leaderboard");
    }
  }, [timeLeft, router, scoreLoading]);

  // Show out of guesses modal when remainingGuesses is 0 and not loading
  React.useEffect(() => {
    if (!scoreLoading && remainingGuesses === 0) {
      setShowOutOfGuesses(true);
    }
  }, [remainingGuesses, scoreLoading]);

  // Show time's out modal when timeLeft is 0
  const isModalOpen = showTimeUpModal || showOutOfGuesses;

  // Scroll to question if requested
  if (scrollToId && questionRefs.current[scrollToId]) {
    questionRefs.current[scrollToId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setScrollToId(null);
  }

  // Submission handler
  const handleSubmit = async (questionId: string, min: number, max: number) => {
    if (!teamId) {
      console.error("No team ID available");
      return;
    }

    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: teamId,
        questionId,
        min_value: min,
        max_value: max,
      }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E1EAF8] via-[#CADAF3] to-[#B3C9EE] relative">
      {/* Modals */}
      <Modal isOpen={showTimeUpModal}>
        <div>
          <h2 className="text-portage-700 text-2xl font-semibold mb-2">
            Time&apos;s out!
          </h2>
          <p className="text-portage-700">Please wait for the results</p>
        </div>
      </Modal>
      <Modal
        isOpen={showOutOfGuesses}
        onClose={() => setShowOutOfGuesses(false)}
        showCloseButton
      >
        <div>
          <h2 className="text-portage-700 text-2xl font-semibold mb-2">
            You&apos;ve run out of guesses!
          </h2>
        </div>
      </Modal>
      <div
        className={isModalOpen ? "pointer-events-none blur-sm select-none" : ""}
      >
        <header className="
          relative
          flex flex-row items-start p-4 justify-between md:items-center md:p-8
        ">
          <Image
            src="/dsc.svg"
            alt="dsclogo"
            width={64}
            height={64}
            className="h-16 w-16 md:h-16 md:w-16 lg:h-20 lg:w-20"
            priority
          />
          {/* mobile */}
          <div className="mt-2 mr-15 flex flex-col items-center md:hidden">
            <h1 className="text-portage-700 text-shadow-md text-3xl">
              Estimathon S25
            </h1>
            <h4 className="text-portage-700 font-semibold text-xl">
              Team Code: {teamCode ?? "Not in a team"}
            </h4>
          </div>
          {/* desktop */}
          <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2
                        text-portage-700 text-shadow-md text-4xl lg:text-5xl">
            Estimathon S25
          </h1>
          <div className="hidden md:block w-16" />
          <h4 className="hidden md:block text-portage-700 font-semibold text-xl">
            Team Code: {teamCode ?? "Not in a team"}
          </h4>
        </header>
        <main className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5 flex flex-col gap-6 p-4 md:p-6">
            <div>
              <TimeLeft />
            </div>
            <div>
              <h4 className="text-portage-700 font-semibold mb-2">
                Questions:
              </h4>
              <QuestionGrid
                questions={questions}
                submissions={submissionMap}
                onSelect={(id) => setScrollToId(id)}
              />
            </div>
            <ScoreInfo
              score={score}
              correctIntervals={goodIntervals}
              total={total}
              remainingGuesses={remainingGuesses}
              maxGuesses={maxGuesses}
            />
          </aside>
          {/* Main content */}
          <section className="flex-1 flex flex-col gap-6 p-4 md:p-8">
            {questions.map((question) => (
              <div
                key={question.id}
                ref={(el) => {
                  questionRefs.current[question.id] = el;
                }}
              >
                <QuestionCard
                  question={question}
                  submission={submissionMap[question.id]}
                  onSubmit={async (min, max) =>
                    handleSubmit(question.id, min, max)
                  }
                  disabled={!scoreLoading && remainingGuesses <= 0}
                />
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
