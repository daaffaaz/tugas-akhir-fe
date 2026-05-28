import { apiFetch, ApiError } from "./client";
import { QuestionnaireRequiredError } from "@/types/rag";
import type {
  BadgeCatalogResponse,
  LearningPathBadgesResponse,
  UserBadge,
} from "@/types/badges";

/**
 * GET /api/badges/ — full catalog (24 badge) dengan flag `is_earned` per badge
 * untuk user saat ini. Cocok untuk halaman "all badges".
 */
export async function getBadgeCatalog(): Promise<BadgeCatalogResponse> {
  try {
    return await apiFetch<BadgeCatalogResponse>("/api/badges/", { auth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}

/**
 * GET /api/users/me/badges/ — daftar UserBadge yang user sudah miliki, di-sort
 * `earned_at` descending (terbaru di atas). Tidak ada pagination.
 */
export async function getMyBadges(): Promise<UserBadge[]> {
  try {
    return await apiFetch<UserBadge[]>("/api/users/me/badges/", { auth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}

/**
 * GET /api/learning-paths/<uuid:pk>/badges/ — daftar badge yang di-earn user
 * via learning path tertentu. 404 kalau path bukan milik user.
 */
export async function getLearningPathBadges(
  pathId: string,
): Promise<LearningPathBadgesResponse> {
  try {
    return await apiFetch<LearningPathBadgesResponse>(
      `/api/learning-paths/${pathId}/badges/`,
      { auth: true },
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new QuestionnaireRequiredError();
    }
    throw err;
  }
}
