"use client";

import { useRouter } from "next/navigation";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

interface QuestionnaireGuardProps {
  onRedirect?: () => void;
}

export function QuestionnaireGuard({ onRedirect }: QuestionnaireGuardProps) {
  const router = useRouter();

  const handleRedirect = () => {
    onRedirect?.();
    router.push("/questionnaire");
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {/* Illustration */}
      <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-gold-light">
        <ClipboardIcon />
      </div>

      <h2 className="mb-3 font-heading text-2xl font-bold text-[#1c1c1c]">
        Selesaikan Kuesioner Dulu
      </h2>
      <p className="mb-2 max-w-md font-body text-base text-[#4b5563]">
        Fitur AI membutuhkan informasi profil belajar kamu untuk memberikan
        rekomendasi yang personal.
      </p>
      <p className="mb-8 max-w-md font-body text-sm text-[#9ca3af]">
        Kuesioner hanya butuh sekitar 5 menit dan terdiri dari 32 pertanyaan.
      </p>

      <button
        type="button"
        onClick={handleRedirect}
        className={primaryGoldCtaClass(
          "flex items-center gap-2 rounded px-8 py-4 font-heading text-base font-bold",
        )}
      >
        <ArrowRightIcon />
        Mulai Kuesioner
      </button>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}