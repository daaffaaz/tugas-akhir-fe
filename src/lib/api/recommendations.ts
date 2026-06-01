import { apiFetch } from "./client";
import type { RagLearningPathResponse } from "@/types/rag";
import type { NextStepsResponse } from "@/types/recommendations";

// ─── Next Steps Recommendation ──────────────────────────────────────────────

/**
 * GET /api/recommendations/next-steps/
 * Return 2-4 career possibilities (eksploratif) + 3-5 suggested courses per
 * karier, berdasarkan course yang sudah ditandai selesai.
 *
 * Empty state: kalau user belum ada completed course, return 200 dengan
 * `career_possibilities: []` (bukan 404) — FE cukup treat empty array.
 */
export async function getNextStepRecommendations(): Promise<NextStepsResponse> {
  return apiFetch<NextStepsResponse>("/api/recommendations/next-steps/", {
    auth: true,
  });
}

// ─── Generate Learning Path From Career ─────────────────────────────────────

export interface PostGenerateFromCareerPayload {
  /** Nama karier dari card rekomendasi (mis. "Data Analyst"). WAJIB. */
  career_focus: string;
  /** Optional — list UUID course yang sudah selesai. BE sudah punya via auth. */
  based_on_courses?: string[];
}

/**
 * POST /api/learning-paths/generate-from-career/
 * Buat learning path baru yang terfokus pada karier yang dipilih user.
 * Response 201 = `RagLearningPathResponse` shape (sama dengan generate-roadmap).
 */
export async function generateLearningPathFromCareer(
  payload: PostGenerateFromCareerPayload,
): Promise<RagLearningPathResponse> {
  return apiFetch<RagLearningPathResponse>(
    "/api/learning-paths/generate-from-career/",
    { method: "POST", body: payload, auth: true },
  );
}
