"use client";

import { ContextTextarea } from "./ContextTextarea";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

interface RegenerateSectionProps {
  contextValue: string;
  onContextChange: (v: string) => void;
  onRegenerate: () => void;
  disabled?: boolean;
  error?: string | null;
}

export function RegenerateSection({
  contextValue,
  onContextChange,
  onRegenerate,
  disabled,
  error,
}: RegenerateSectionProps) {
  return (
    <div className="space-y-4 rounded border border-[#e5e7eb] bg-[#fafafa] p-5">
      <p className="font-heading text-sm font-bold text-[#1c1c1c]">
        🔄 Regenerate — wajib isi konteks
      </p>

      <ContextTextarea
        value={contextValue}
        onChange={onContextChange}
        disabled={disabled}
        placeholder="Saya mau kursus hands-on yang pendek..."
        error={error ?? undefined}
      />

      <button
        type="button"
        onClick={onRegenerate}
        disabled={disabled || !contextValue.trim()}
        className={primaryGoldCtaClass(
          "flex w-full items-center justify-center gap-2 rounded px-6 py-3 font-heading text-sm font-bold",
          disabled && "cursor-not-allowed",
        )}
      >
        {disabled ? (
          <>
            <SpinnerIcon />
            Generating...
          </>
        ) : (
          <>
            <RefreshIcon />
            Regenerate
          </>
        )}
      </button>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}