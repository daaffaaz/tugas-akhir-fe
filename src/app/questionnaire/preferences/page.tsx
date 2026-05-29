export const dynamic = "force-dynamic";

import { getQuestions, LEVEL_SECTION } from "@/lib/api/questionnaire";
import { PreferencesQuestionnaireClient } from "@/components/questionnaire/PreferencesQuestionnaireClient";

export default async function PreferencesQuestionnairePage() {
  const questions = await getQuestions();
  const levelQuestions = questions.filter((q) => q.section === LEVEL_SECTION);
  const prefQuestions = questions.filter((q) => q.section !== LEVEL_SECTION);
  return (
    <PreferencesQuestionnaireClient
      questions={prefQuestions}
      levelQuestions={levelQuestions}
    />
  );
}