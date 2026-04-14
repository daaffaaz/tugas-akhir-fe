"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { login, loginWithGoogle } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getProfile } from "@/lib/api/profile";
import { setTokens } from "@/lib/auth-storage";
import {
  primaryCtaIconHover,
  primaryGoldCtaClass,
} from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgGoogle =
  "https://www.figma.com/api/mcp/asset/ea27a6b3-3212-4992-b58d-02d34fad9622";
const imgEye =
  "https://www.figma.com/api/mcp/asset/99786749-3964-4884-a3de-d513d6e897a6";
const imgArrow =
  "https://www.figma.com/api/mcp/asset/84c7f18e-14ba-4f2c-b070-3de9f3b4dbc7";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const tokens = await login(email, password);

      // Store tokens temporarily so getProfile can attach the Bearer header.
      setTokens(tokens.access, tokens.refresh);

      try {
        // Profile endpoint only succeeds if the questionnaire is completed.
        const profile = await getProfile();
        signIn(
          { id: profile.id, email: profile.email, full_name: profile.full_name },
          tokens.access,
          tokens.refresh,
        );
        router.push("/learning-path");
      } catch {
        // Questionnaire not yet completed — sign in with minimal info.
        signIn({ id: "", email, full_name: "" }, tokens.access, tokens.refresh);
        router.push("/questionnaire");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    const idToken = response.credential;
    if (!idToken) {
      setError("Google token tidak valid. Silakan coba lagi.");
      return;
    }
    setError(null);
    setGoogleSubmitting(true);
    try {
      const result = await loginWithGoogle(idToken);
      try {
        const profile = await getProfile();
        signIn(
          { id: profile.id, email: profile.email, full_name: profile.full_name },
          result.access,
          result.refresh,
        );
        router.push("/learning-path");
      } catch {
        signIn(
          { id: result.id, email: result.email, full_name: result.full_name },
          result.access,
          result.refresh,
        );
        router.push("/questionnaire");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Google Sign-In gagal. Silakan coba lagi.",
      );
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-surface px-6 pb-6 pt-12 md:h-full md:min-h-screen md:px-20 md:pb-8 md:pt-16">
      <div className="flex w-full max-w-md flex-col gap-10">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-dark">
            Selamat Datang Kembali
          </h1>
          <p className="font-body text-base font-medium text-dark/70">
            Masukkan akun Anda untuk melanjutkan penyusunan jalur belajar yang
            terpersonalisasi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-bold uppercase tracking-wide text-muted-2">
              Alamat Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 font-body text-base text-dark placeholder:text-muted-2/40 outline-none ring-0 focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="font-body text-xs font-bold uppercase tracking-wide text-muted-2">
                Kata Sandi
              </label>
              <button
                type="button"
                className="font-body text-[10px] font-bold uppercase tracking-wide text-dark/50"
              >
                Lupa kata sandi?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 pr-10 font-body text-base text-dark placeholder:text-muted-2/40 outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              >
                <Image
                  src={imgEye}
                  alt=""
                  width={13}
                  height={9}
                  className="opacity-60"
                  unoptimized
                />
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded-sm border border-border-soft bg-[rgba(229,229,224,0.5)] accent-gold"
            />
            <span className="font-body text-sm font-medium text-muted-2">
              Ingat saya
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              primaryGoldCtaClass(),
              "group relative flex w-full items-center justify-center gap-2 rounded py-4 shadow-[0px_10px_15px_-3px_rgba(255,206,0,0.2)]",
            )}
          >
            <span className="font-heading text-sm font-extrabold uppercase tracking-widest">
              {submitting ? "Masuk…" : "Sign In"}
            </span>
            {!submitting && (
              <Image
                src={imgArrow}
                alt=""
                width={14}
                height={14}
                className={cn("size-[13.5px]", primaryCtaIconHover)}
                unoptimized
              />
            )}
          </button>

          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-border-soft" />
            <span className="font-body text-xs font-bold uppercase tracking-wider text-dark/50">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-border-soft" />
          </div>

          <div className="flex w-full flex-col items-center gap-3 rounded border border-border-soft bg-white px-4 py-4">
            <div className="flex items-center justify-center gap-2">
              <Image
                src={imgGoogle}
                alt=""
                width={33}
                height={33}
                className="size-[33px]"
                unoptimized
              />
              <span className="font-body text-sm font-bold text-dark">
                Google
              </span>
            </div>
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In gagal. Silakan coba lagi.")}
                text="continue_with"
                size="large"
                theme="outline"
                shape="rectangular"
                width="320"
              />
            ) : (
              <span className="font-body text-xs text-muted">
                NEXT_PUBLIC_GOOGLE_CLIENT_ID belum dikonfigurasi.
              </span>
            )}
            {googleSubmitting && (
              <span className="font-body text-xs text-muted">
                Memproses login Google...
              </span>
            )}
          </div>
        </form>

        <p className="flex flex-wrap items-center justify-center gap-1 text-center font-body text-sm font-medium text-muted-2">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="border-b-2 border-gold pb-0.5 font-bold text-dark"
          >
            Register
          </Link>
        </p>

        <footer className="space-y-4 border-t border-border-soft pt-8">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-dark/50">
            <span>Dukungan</span>
            <span>Partnerships</span>
          </div>
          <p className="text-center text-[10px] tracking-wide text-dark/40">
            © 2026 PersonaLearn.
          </p>
        </footer>
      </div>
    </div>
  );
}
