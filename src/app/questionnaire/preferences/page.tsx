export const dynamic = "force-dynamic";

import { getQuestions } from "@/lib/api/questionnaire";
import { PreferencesQuestionnaireClient } from "@/components/questionnaire/PreferencesQuestionnaireClient";

export default async function PreferencesQuestionnairePage() {
  const questions = await getQuestions();
  // Filter split by section
  const levelQuestions = questions.filter(
    (q) => q.section === "SUB-BAGIAN A — LEVEL",
  );
  const prefQuestions = questions.filter(
    (q) => q.section === "SUB-BAGIAN B — PREFERENCE",
  );
  return (
    <PreferencesQuestionnaireClient
      questions={prefQuestions}
      levelQuestions={levelQuestions}
    />
  );
}