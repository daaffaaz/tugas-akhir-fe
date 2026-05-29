export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { LevelQuestionnaireClient } from "@/components/questionnaire/LevelQuestionnaireClient";

export default async function LevelQuestionnairePage() {
  const questions = await getQuestions();
  const levelQuestions = questions.filter(
    (q) => q.section === "LEVEL ASSESSMENT",
  );
  return <LevelQuestionnaireClient questions={levelQuestions} />;
}