import { apiFetch, ApiError } from "./client";
import {
  RagRecommendResponse,
  RagLearningPathResponse,
  CourseRecommendation,
  QuestionnaireRequiredError,
  RegeneratePathRequest,
  ReplaceCourseRequest,
  ApplyReplacementRequest,
  AddCourseToPathRequest,
  ReplaceCourseResponse,
  SimilarCoursesResponse,
  RegeneratePathResponse,
  LearningPathListItem,
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

// ─── Learning Path — List & Detail ─────────────────────────────────────────

/** GET /api/rag/learning-paths/ — list all user paths */
export async function getLearningPathList(
  page = 1,
  pageSize = 10,
): Promise<{ results: LearningPathListItem[]; total: number; page: number; page_size: number }> {
  return apiFetch<{ results: LearningPathListItem[]; total: number; page: number; page_size: number }>(
    `/api/rag/learning-paths/?page=${page}&page_size=${pageSize}`,
    { auth: true },
  );
}

/** GET /api/rag/learning-paths/{id}/ — get single path detail (AI-generated) */
export async function getRagLearningPath(
  id: string,
): Promise<RagLearningPathResponse> {
  return apiFetch<RagLearningPathResponse>(
    `/api/rag/learning-paths/${id}/`,
    { auth: true },
  );
}

// ─── Learning Path — Edit Operations ─────────────────────────────────────

/** POST /api/rag/learning-paths/{id}/regenerate/ — regenerate entire path */
export async function regenerateLearningPath(
  id: string,
  payload: RegeneratePathRequest = {},
): Promise<RegeneratePathResponse> {
  try {
    return await apiFetch<RegeneratePathResponse>(
      `/api/rag/learning-paths/${id}/regenerate/`,
      {
        method: "POST",
        body: payload,
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

/** POST /api/rag/learning-paths/{id}/courses/{course_id}/replace/ — get replacement candidates */
export async function getReplacementCandidates(
  pathId: string,
  courseId: string,
  payload: ReplaceCourseRequest = {},
): Promise<ReplaceCourseResponse> {
  try {
    return await apiFetch<ReplaceCourseResponse>(
      `/api/rag/learning-paths/${pathId}/courses/${courseId}/replace/`,
      {
        method: "POST",
        body: payload,
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

/** PATCH /api/rag/learning-paths/{id}/courses/{course_id}/ — apply replacement or delete */
export async function applyCourseReplacement(
  pathId: string,
  courseId: string,
  payload: ApplyReplacementRequest | { action: "delete" },
): Promise<{ detail: string; learning_path?: RagLearningPathResponse; deleted_position?: number }> {
  return apiFetch(
    `/api/rag/learning-paths/${pathId}/courses/${courseId}/`,
    {
      method: "PATCH",
      body: payload,
      auth: true,
    },
  );
}

/** DELETE /api/rag/learning-paths/{id}/courses/{course_id}/ — delete a course */
export async function deleteCourseFromPath(
  pathId: string,
  courseId: string,
): Promise<{ detail: string; position: number }> {
  return apiFetch<{ detail: string; position: number }>(
    `/api/rag/learning-paths/${pathId}/courses/${courseId}/`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}

/** POST /api/rag/learning-paths/{id}/courses/add/ — add course to path */
export async function addCourseToPath(
  pathId: string,
  payload: AddCourseToPathRequest,
): Promise<RagLearningPathResponse> {
  return apiFetch<RagLearningPathResponse>(
    `/api/rag/learning-paths/${pathId}/courses/add/`,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}

/** GET /api/rag/learning-paths/{id}/courses/{course_id}/similar/ — get similar courses */
export async function getSimilarCourses(
  pathId: string,
  courseId: string,
  limit = 10,
): Promise<SimilarCoursesResponse> {
  return apiFetch<SimilarCoursesResponse>(
    `/api/rag/learning-paths/${pathId}/courses/${courseId}/similar/?limit=${limit}`,
    { auth: true },
  );
}

/** POST /api/rag/learning-paths/courses/{id}/toggle-complete/ — toggle course completion */
export async function toggleCourseComplete(
  courseId: string,
): Promise<{ is_completed: boolean }> {
  return apiFetch<{ is_completed: boolean }>(
    `/api/rag/learning-paths/courses/${courseId}/toggle-complete/`,
    { method: "POST", auth: true },
  );
}

/** PATCH /api/rag/learning-paths/{id}/courses/reorder/ — reorder courses by position */
export async function reorderPathCourses(
  pathId: string,
  courseIds: string[],
): Promise<void> {
  await apiFetch(
    `/api/rag/learning-paths/${pathId}/courses/reorder/`,
    {
      method: "PATCH",
      body: { course_ids: courseIds },
      auth: true,
    },
  );
}
