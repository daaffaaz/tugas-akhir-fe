export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { LevelQuestionnaireClient } from "@/components/questionnaire/LevelQuestionnaireClient";

export default async function LevelQuestionnairePage() {
  const questions = await getQuestions();
  // Filter to only SUB-BAGIAN A — LEVEL questions
  const levelQuestions = questions.filter(
    (q) => q.section === "SUB-BAGIAN A — LEVEL",
  );
  return <LevelQuestionnaireClient questions={levelQuestions} />;
}