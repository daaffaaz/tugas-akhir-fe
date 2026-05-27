import { getQuestions } from "@/lib/api/questionnaire";
import { PreferencesQuestionnaireClient } from "@/components/questionnaire/PreferencesQuestionnaireClient";

export default async function PreferencesQuestionnairePage() {
  const questions = await getQuestions();
  // Qa1–Qa3: first 3 (level), Qa4–Qa9: slice(3, 9) (preferences)
  const levelQuestions = questions.slice(0, 3);
  const prefQuestions = questions.slice(3, 9);
  return (
    <PreferencesQuestionnaireClient
      questions={prefQuestions}
      levelQuestions={levelQuestions}
    />
  );
}