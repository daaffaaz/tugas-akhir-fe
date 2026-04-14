import { getAccessToken } from "@/lib/auth-storage";
import { ApiError, apiFetch } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

/**
 * All preference fields use the backend's stored codes, not display labels.
 * Empty fields are returned as null by the backend serializer.
 */
export type UserPreferences = {
  job_title: string | null;
  age_range: string | null;
  education_level: string | null;
  operating_system: string | null;
  git_skill: string | null;
  cli_level: number | null;
  logic_level: number | null;
  weekly_hours: string | null;
  study_slot: string | null;
  material_format: string | null;
  theory_practice: string | null;
  evaluation_type: string | null;
  target_role: string | null;
  main_goal: string | null;
  ram_gb: string | null;
  internet_quality: string | null;
  budget_idr: string | null;
};

// ---------------------------------------------------------------------------
// Profile
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
 * Accepts `full_name` and `avatar_url`.
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

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export async function getPreferences(): Promise<UserPreferences> {
  return apiFetch<UserPreferences>("/api/users/preferences/", { auth: true });
}

export async function updatePreferences(
  payload: Partial<UserPreferences>,
): Promise<UserPreferences> {
  return apiFetch<UserPreferences>("/api/users/preferences/", {
    method: "PATCH",
    body: payload,
    auth: true,
  });
}

// ---------------------------------------------------------------------------
// Avatar upload (multipart/form-data — cannot use apiFetch)
// ---------------------------------------------------------------------------

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const token = getAccessToken();
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${BASE_URL}/api/users/avatar/`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as Record<string, unknown>;
      const fileErr = data["file"];
      if (Array.isArray(fileErr) && typeof fileErr[0] === "string") {
        message = fileErr[0];
      }
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<{ avatar_url: string }>;
}
