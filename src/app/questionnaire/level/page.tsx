export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { LevelQuestionnaireClient } from "@/components/questionnaire/LevelQuestionnaireClient";

export default async function LevelQuestionnairePage() {
  let questions: Awaited<ReturnType<typeof getQuestions>> = [];
  let errorMsg = "";
  try {
    questions = await getQuestions();
  } catch (e) {
    errorMsg = String(e);
    console.error("[level] getQuestions failed:", e);
  }
  console.log("[level] questions count:", questions.length, "error:", errorMsg);
  const levelQuestions = questions.filter(
    (q) => q.section === "LEVEL MEASUREMENT",
  );
  return <LevelQuestionnaireClient questions={levelQuestions} />;
}