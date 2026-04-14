import { QUESTIONNAIRE_STORAGE_KEY } from "@/lib/questionnaire-data";
import type { ApiQuestion, QuestionnaireAnswer } from "@/lib/api/questionnaire";

/**
 * Stored as { [questionUUID]: "A" | "B" | "C" | ... }
 */
export type StoredAnswers = Record<string, string>;

export function loadAnswers(): StoredAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StoredAnswers;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function saveAnswer(questionId: string, optionKey: string): void {
  if (typeof window === "undefined") return;
  const prev = loadAnswers();
  prev[questionId] = optionKey;
  localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(prev));
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUESTIONNAIRE_STORAGE_KEY);
}

/**
 * Builds the submission payload expected by POST /api/users/questionnaire/.
 * Only includes questions that have a stored answer.
 */
export function buildSubmissionPayload(
  questions: ApiQuestion[],
): QuestionnaireAnswer[] {
  const answers = loadAnswers();
  return questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => ({
      question_id: q.id,
      answer_option: answers[q.id],
    }));
}
