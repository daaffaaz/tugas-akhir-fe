/**
 * Auth API stubs — replace with real fetch() calls when backend is ready.
 */

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const MOCK_DELAY_MS = 400;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function login(email: string, password: string): Promise<void> {
  await delay(MOCK_DELAY_MS);
  if (typeof window !== "undefined") {
    console.info("[auth stub] login", { email, passwordLength: password.length });
  }
}

export async function register(payload: RegisterPayload): Promise<void> {
  await delay(MOCK_DELAY_MS);
  if (typeof window !== "undefined") {
    console.info("[auth stub] register", {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
  }
}
