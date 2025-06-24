import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  context: { params: { teamId: string } }
) {
  const { teamId } = await context.params;

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      `
      *,
      question:questions(*)
    `
    )
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate correctness and score for each submission
  const submissionsWithScore = submissions?.map((submission) => {
    const question = submission.question;
    const isCorrect =
      question &&
      submission.min_value <= question.answer &&
      submission.max_value >= question.answer;

    return {
      ...submission,
      is_correct: isCorrect,
      interval_size: submission.max_value - submission.min_value,
    };
  });

  return NextResponse.json(submissionsWithScore);
}
