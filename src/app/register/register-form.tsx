"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { loginWithGoogle, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getProfile } from "@/lib/api/profile";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgGoogle =
  "https://www.figma.com/api/mcp/asset/65e94bb4-ce48-4d68-b394-b14c68102d34";
const imgEye =
  "https://www.figma.com/api/mcp/asset/3f25ef02-70e8-4e66-be7b-8429dfa51909";

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) return;

    if (password !== passwordConfirm) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = await register({
        email,
        password,
        password_confirm: passwordConfirm,
        full_name: `${firstName} ${lastName}`.trim(),
      });
      signIn(
        { id: result.id, email: result.email, full_name: result.full_name },
        result.access,
        result.refresh,
      );
      router.push("/questionnaire");
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
            Buat Akun Baru
          </h1>
          <div className="flex flex-wrap items-baseline gap-1 font-body text-base font-medium text-dark/70">
            <span>Sudah punya akun?</span>
            <Link
              href="/login"
              className="border-b-2 border-gold font-medium text-dark"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold uppercase tracking-wide text-dark">
                Nama Depan
              </label>
              <input
                type="text"
                autoComplete="given-name"
                required
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 font-body text-base text-dark placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold uppercase tracking-wide text-dark">
                Nama Belakang
              </label>
              <input
                type="text"
                autoComplete="family-name"
                required
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 font-body text-base text-dark placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-bold uppercase tracking-wide text-dark">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="j.doe@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 font-body text-base text-dark placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-bold uppercase tracking-wide text-dark">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 pr-10 font-body text-base text-dark placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-gold/40"
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

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-bold uppercase tracking-wide text-dark">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded border-0 bg-[rgba(229,229,224,0.5)] px-4 py-3 pr-10 font-body text-base text-dark placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                aria-label={
                  showPasswordConfirm ? "Sembunyikan sandi" : "Tampilkan sandi"
                }
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

          <label className="flex cursor-pointer items-start gap-3 py-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              className="mt-0.5 size-4 shrink-0 rounded-sm border border-[#6b7280] bg-[rgba(229,229,224,0.5)] accent-gold"
            />
            <span className="font-body text-sm text-dark">
              Saya menyetujui{" "}
              <span className="font-bold">Ketentuan Layanan</span> dan{" "}
              <span className="font-bold">Kebijakan Privasi</span> mengenai
              penggunaan data
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !acceptedTerms}
            className={cn(
              primaryGoldCtaClass(),
              "relative w-full rounded py-4 shadow-[0px_10px_15px_-3px_rgba(255,206,0,0.2)]",
            )}
          >
            <span className="font-heading text-sm font-extrabold uppercase tracking-widest">
              {submitting ? "Mendaftar…" : "Daftar Sekarang"}
            </span>
          </button>

          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-border-soft" />
            <span className="font-body text-xs font-bold uppercase tracking-wider text-dark/50">
              Or join with
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

        <footer className="space-y-4 border-t border-border-soft pt-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dark/50">
            Dukungan
          </p>
          <p className="text-center text-[10px] tracking-wide text-dark/40">
            © 2026 PersonaLearn
          </p>
        </footer>
      </div>
    </div>
  );
}
