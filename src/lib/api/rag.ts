import { apiFetch, ApiError } from "./client";
import {
  RagRecommendResponse,
  RagLearningPathResponse,
  CourseRecommendation,
  QuestionnaireRequiredError,
} from "@/types/rag";

// ─── Course Recommendation ────────────────────────────────────────────────

export interface PostRecommendPayload {
  topic: string;
  additional_context?: string;
  count?: number;
  regenerate?: boolean;
}

/** POST /api/rag/recommend/ — generate or regenerate course recommendations */
export async function postRecommend(
  payload: PostRecommendPayload,
): Promise<RagRecommendResponse> {
  try {
    return await apiFetch<RagRecommendResponse>("/api/rag/recommend/", {
      method: "POST",
      body: payload,
      auth: true,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}

// ─── Saved Recommendations ───────────────────────────────────────────────

export interface GetRecommendationsParams {
  topic?: string;
  is_saved?: boolean;
  page?: number;
  page_size?: number;
}

/** GET /api/rag/recommendations/ — list saved recommendations */
export async function getRecommendations(
  params: GetRecommendationsParams = {},
): Promise<{ results: CourseRecommendation[]; count: number }> {
  const qs = new URLSearchParams();
  if (params.topic !== undefined) qs.set("topic", params.topic);
  if (params.is_saved !== undefined) qs.set("is_saved", String(params.is_saved));
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.page_size !== undefined)
    qs.set("page_size", String(params.page_size));

  const query = qs.toString();
  return apiFetch<{ results: CourseRecommendation[]; count: number }>(
    `/api/rag/recommendations/${query ? `?${query}` : ""}`,
    { auth: true },
  );
}

/** PATCH /api/rag/recommendations/{id}/ — toggle saved status */
export async function patchRecommendation(
  id: string,
  is_saved: boolean,
): Promise<CourseRecommendation> {
  try {
    return await apiFetch<CourseRecommendation>(
      `/api/rag/recommendations/${id}/`,
      {
        method: "PATCH",
        body: { is_saved },
        auth: true,
      },
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}

// ─── Learning Path ─────────────────────────────────────────────────────────

export interface PostGenerateRoadmapPayload {
  topic: string;
  count?: number;
}

/** POST /api/rag/generate-roadmap/ — generate AI learning path */
export async function postGenerateRoadmap(
  payload: PostGenerateRoadmapPayload,
): Promise<RagLearningPathResponse> {
  try {
    return await apiFetch<RagLearningPathResponse>("/api/rag/generate-roadmap/", {
      method: "POST",
      body: payload,
      auth: true,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}
