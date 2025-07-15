import { Submission, Question } from "@/lib/supabase";

export function calculateTeamScore(
  submissions: Submission[],
  questions: Question[]
): { score: number; goodIntervals: number } {
  let totalRatio = 0;
  let goodIntervals = 0;

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Get the most recent submission for each question
  const latestSubmissions = new Map<string, Submission>();

  for (const submission of submissions) {
    const existing = latestSubmissions.get(submission.question_id);
    if (
      !existing ||
      new Date(submission.created_at) > new Date(existing.created_at)
    ) {
      latestSubmissions.set(submission.question_id, submission);
    }
  }

  // Calculate score using only the latest submissions
  for (const submission of latestSubmissions.values()) {
    const question = questionMap.get(submission.question_id);
    if (!question || !question.answer) continue;

    // Check if interval contains the correct answer
    const isCorrect =
      submission.min_value <= question.answer &&
      submission.max_value >= question.answer;

    if (isCorrect) {
      goodIntervals++;
      // Calculate max/min ratio for this interval
      const ratio = submission.max_value / submission.min_value;
      totalRatio += ratio;
    }
  }

  // Apply scoring formula
  const baseScore = 10 + totalRatio;
  const multiplier = Math.pow(2, 13 - goodIntervals);
  const score = Math.round(baseScore * multiplier);

  return {
    score,
    goodIntervals,
  };
}
