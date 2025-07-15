import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { calculateTeamScore } from "@/utils/scoring";

export async function POST(req: Request) {
  const { teamId, questionId, min_value, max_value } = await req.json();
  if (!teamId || !questionId || min_value == null || max_value == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check submission count
  const { count, error: countError } = await supabaseAdmin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (countError) {
    console.error(countError);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count && count >= 18) {
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
  try {
    // Get all team submissions
    const { data: allSubmissions } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("team_id", teamId);

    // Get all questions
    const { data: questions } = await supabaseAdmin
      .from("questions")
      .select("*");

    if (allSubmissions && questions) {
      const { score, goodIntervals } = calculateTeamScore(
        allSubmissions,
        questions
      );

      // Update team score
      await supabaseAdmin
        .from("teams")
        .update({
          score,
          good_interval: goodIntervals,
        })
        .eq("id", teamId);
    }
  } catch (scoreError) {
    console.error("Error updating team score:", scoreError);
  }

  return NextResponse.json(submission);
}
