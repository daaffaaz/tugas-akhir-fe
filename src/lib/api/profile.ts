import { apiFetch } from "./client";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
};

/**
 * Fetches the authenticated user's profile.
 * The backend middleware blocks this endpoint if the questionnaire
 * has not been completed yet, returning a 4xx error.
 */
export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/users/profile/", { auth: true });
}
