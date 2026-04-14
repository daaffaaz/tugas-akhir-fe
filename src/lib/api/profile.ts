import { apiFetch } from "./client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  questionnaire_completed_at: string | null;
  created_at: string;
};

export type ProfileUpdatePayload = {
  full_name?: string;
  avatar_url?: string | null;
};

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetches the authenticated user's profile.
 * The backend middleware blocks this endpoint if the questionnaire
 * has not been completed yet, returning a 4xx error.
 */
export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/users/profile/", { auth: true });
}

/**
 * Partially updates the authenticated user's profile.
 * Only `full_name` and `avatar_url` are accepted by the current backend.
 * Extended preference fields are stored separately in localStorage
 * until the backend /api/users/preferences/ endpoint is available.
 */
export async function updateProfile(
  payload: ProfileUpdatePayload,
): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/users/profile/", {
    method: "PATCH",
    body: payload,
    auth: true,
  });
}
