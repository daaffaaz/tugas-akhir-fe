import { apiFetch } from "./client";

export type RegisterPayload = {
  email: string;
  password: string;
  password_confirm: string;
  full_name: string;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  id: string;
  email: string;
  full_name: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login/", {
    method: "POST",
    body: { email, password },
  });
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register/", {
    method: "POST",
    body: payload,
  });
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/google/", {
    method: "POST",
    body: { id_token: idToken },
  });
}

export async function refreshAccessToken(
  refresh: string,
): Promise<{ access: string }> {
  return apiFetch<{ access: string }>("/api/auth/token/refresh/", {
    method: "POST",
    body: { refresh },
  });
}
