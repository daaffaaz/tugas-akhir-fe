import { apiFetch } from "./client";

export type ApiQuestion = {
  /**
   * UUID that uniquely identifies this question in the database.
   * Used as the key in submission payloads.
   */
  id: string;
  /** The question text shown to the user. */
  question_text: string;
  /**
   * Answer options keyed by letter, e.g. { "A": "...", "B": "...", "C": "..." }.
   * The letter is the value sent back as `answer_option` when submitting.
   */
  options_json: Record<string, string>;
};

export type QuestionnaireAnswer = {
  question_id: string;
  answer_option: string;
};

/**
 * Fetches all questionnaire questions from the public API.
 * Results are cached server-side for 1 hour via Next.js extended fetch.
 */
export async function getQuestions(): Promise<ApiQuestion[]> {
  return apiFetch<ApiQuestion[]>("/api/questions/", {
    next: { revalidate: 3600 },
  } as RequestInit);
}

/**
 * Submits the user's questionnaire answers. Requires an authenticated user.
 */
export async function submitQuestionnaire(
  answers: QuestionnaireAnswer[],
): Promise<void> {
  return apiFetch<void>("/api/users/questionnaire/", {
    method: "POST",
    body: answers,
    auth: true,
  });
}
