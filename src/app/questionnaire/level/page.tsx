export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { LevelQuestionnaireClient } from "@/components/questionnaire/LevelQuestionnaireClient";

export default async function LevelQuestionnairePage() {
  const questions = await getQuestions();
  // Qa1–Qa3: Section LEVEL MEASUREMENT
  const levelQuestions = questions.filter(
    (q) => q.section === "LEVEL MEASUREMENT",
  );
  return <LevelQuestionnaireClient questions={levelQuestions} />;
}