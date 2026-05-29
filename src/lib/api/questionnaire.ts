import { apiFetch } from "./client";

/**
 * Section label the backend uses for the 3 level-assessment questions
 * (Qa1–Qa3). Must match the `section` value returned by /api/questions/
 * exactly, including the em-dash (—).
 */
export const LEVEL_SECTION = "SUB-BAGIAN A — LEVEL SIGNAL";

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
  /** 1-based ordering across the whole questionnaire. */
  order_number?: number;
  /** Logical grouping label, e.g. "PROFIL & DEMOGRAFI". */
  section?: string;
  /** Stable machine key for this question, e.g. "age_group". */
  variable_key?: string;
};

export type QuestionnaireAnswer = {
  question_id: string;
  answer_option: string;
};

export type StoredQuestionnaireAnswer = {
  id: string;
  question_id: string;
  order_number: number;
  answer_option: string;
  submitted_at: string;
};

type QuestionsApiResponse =
  | ApiQuestion[]
  | {
      next?: string | null;
      results?: ApiQuestion[];
    };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function toPath(urlOrPath: string): string {
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    const u = new URL(urlOrPath);
    return `${u.pathname}${u.search}`;
  }
  return urlOrPath;
}

/**
 * Fetches all questionnaire questions from the public API.
 * Results are cached server-side for 1 hour via Next.js extended fetch.
 */
export async function getQuestions(): Promise<ApiQuestion[]> {
  const first = await apiFetch<QuestionsApiResponse>("/api/questions/", {
    next: { revalidate: 3600 },
  } as RequestInit);

  if (Array.isArray(first)) return first;
  if (!first || !Array.isArray(first.results)) return [];

  const all = [...first.results];
  let nextUrl = first.next ?? null;

  while (nextUrl) {
    const path = toPath(nextUrl);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) break;
    const page = (await response.json()) as QuestionsApiResponse;
    if (!page || Array.isArray(page) || !Array.isArray(page.results)) break;
    all.push(...page.results);
    nextUrl = page.next ?? null;
  }

  return all;
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

/**
 * Fetches the authenticated user's stored questionnaire answers.
 * Returns an empty array if the user hasn't submitted yet.
 */
export async function getUserAnswers(): Promise<StoredQuestionnaireAnswer[]> {
  return apiFetch<StoredQuestionnaireAnswer[]>("/api/users/questionnaire/", {
    auth: true,
  });
}

/**
 * Updates one or more stored answers. Only include the changed answers.
 * Requires the questionnaire to have been submitted first via POST.
 */
export async function patchUserAnswers(
  answers: QuestionnaireAnswer[],
): Promise<StoredQuestionnaireAnswer[]> {
  return apiFetch<StoredQuestionnaireAnswer[]>("/api/users/questionnaire/", {
    method: "PATCH",
    body: answers,
    auth: true,
  });
}

export type ComputeLevelResponse = {
  level: string;
  score: number;
  signals: {
    programming_familiarity: string;
    domain_comfort: string;
    formal_preparation: string;
  };
};

/**
 * Computes the user's level from their answers to the 3 level assessment questions.
 */
export async function computeLevel(
  answers: QuestionnaireAnswer[],
): Promise<ComputeLevelResponse> {
  return apiFetch<ComputeLevelResponse>("/api/questionnaires/compute-level/", {
    method: "POST",
    body: { answers },
    auth: true,
  });
}
