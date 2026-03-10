import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { calculateTeamScore } from "@/utils/scoring";

export async function POST(req: Request) {
  const { teamId, questionId, min_value, max_value } = await req.json();
  if (!teamId || !questionId || min_value == null || max_value == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check submission count using teams table
  const { data: teamData, error: countError } = await supabaseAdmin
    .from("teams")
    .select("submission_count")
    .eq("id", teamId)
    .single();

  if (countError) {
    console.error(countError);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const currentSubmissionCount = teamData?.submission_count || 0;
  if (currentSubmissionCount >= 18) {
    return NextResponse.json(
      { error: "Submission limit reached" },
      { status: 403 }
    );
  }

  // Upsert submission
  const { data: submission, error } = await supabaseAdmin
    .from("submissions")
    .upsert(
      {
        team_id: teamId,
        question_id: questionId,
        min_value,
        max_value,
      },
      {
        onConflict: "team_id,question_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Recalculate team score after successful submission
  const { data: allSubmissions, error: subError } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("team_id", teamId);

  const { data: questions, error: qError } = await supabaseAdmin
    .from("questions")
    .select("*");

  if (subError || qError || !allSubmissions || !questions) {
    console.error("Failed to fetch data for score recalculation", subError, qError);
    return NextResponse.json({ error: "Score calculation failed" }, { status: 500 });
  }

  const { score, goodIntervals } = calculateTeamScore(allSubmissions, questions);

  // Optimistic lock: only update if submission_count hasn't changed (prevents race condition from spam clicks)
  const { data: updateResult, error: updateError } = await supabaseAdmin
    .from("teams")
    .update({
      score,
      good_interval: goodIntervals,
      submission_count: currentSubmissionCount + 1,
    })
    .eq("id", teamId)
    .eq("submission_count", currentSubmissionCount)
    .select();

  if (updateError) {
    console.error("Failed to update team score", updateError);
    return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
  }

  if (!updateResult?.length) {
    return NextResponse.json({ error: "Concurrent submission detected, please retry" }, { status: 409 });
  }

  return NextResponse.json(submission);
}
