export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { PreferencesQuestionnaireClient } from "@/components/questionnaire/PreferencesQuestionnaireClient";

export default async function PreferencesQuestionnairePage() {
  const questions = await getQuestions();
  // Level: LEVEL MEASUREMENT (3Q), Preferences: semua yang lain (bukan demografi)
  const levelQuestions = questions.filter(
    (q) => q.section === "LEVEL MEASUREMENT",
  );
  const prefQuestions = questions.filter(
    (q) => q.section !== "LEVEL MEASUREMENT",
  );
  return (
    <PreferencesQuestionnaireClient
      questions={prefQuestions}
      levelQuestions={levelQuestions}
    />
  );
}