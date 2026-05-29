export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { PreferencesQuestionnaireClient } from "@/components/questionnaire/PreferencesQuestionnaireClient";

export default async function PreferencesQuestionnairePage() {
  const questions = await getQuestions();
  const levelQuestions = questions.filter(
    (q) => q.section === "LEVEL ASSESSMENT",
  );
  const prefQuestions = questions.filter(
    (q) => q.section !== "LEVEL ASSESSMENT",
  );
  return (
    <PreferencesQuestionnaireClient
      questions={prefQuestions}
      levelQuestions={levelQuestions}
    />
  );
}