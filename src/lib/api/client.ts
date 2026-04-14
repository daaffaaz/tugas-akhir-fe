import { getAccessToken } from "@/lib/auth-storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  /** Typed body — will be JSON-serialised automatically. */
  body?: unknown;
  /** When true, attaches the stored Bearer token to the request. */
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, auth = false, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    let data: unknown;
    try {
      data = await response.json();
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const d = data as Record<string, unknown>;
        message =
          extractString(d["detail"]) ??
          extractString(d["message"]) ??
          extractFirstFieldError(d) ??
          message;
      }
    } catch {
      /* response body is not JSON — keep default message */
    }
    throw new ApiError(response.status, message, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function extractString(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0] as string;
  return undefined;
}

function extractFirstFieldError(
  obj: Record<string, unknown>,
): string | undefined {
  for (const key of Object.keys(obj)) {
    const val = extractString(obj[key]);
    if (val) return val;
  }
  return undefined;
}
