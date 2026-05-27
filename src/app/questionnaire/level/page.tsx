export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { LevelQuestionnaireClient } from "@/components/questionnaire/LevelQuestionnaireClient";

export default async function LevelQuestionnairePage() {
  const questions = await getQuestions();
  // Qa1–Qa3: first 3 questions
  const levelQuestions = questions.slice(0, 3);
  return <LevelQuestionnaireClient questions={levelQuestions} />;
}