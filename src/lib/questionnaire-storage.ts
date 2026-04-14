import {
  QUESTIONNAIRE_STORAGE_KEY,
  QUESTIONNAIRE_TOTAL,
} from "@/lib/questionnaire-data";

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

export function saveAnswer(stepIndex: string, optionId: string) {
  if (typeof window === "undefined") return;
  const prev = loadAnswers();
  prev[stepIndex] = optionId;
  localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(prev));
}

export function getTotalSteps() {
  return QUESTIONNAIRE_TOTAL;
}
