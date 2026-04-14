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
