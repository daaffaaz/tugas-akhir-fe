"use client";

import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import type { CareerPossibility } from "@/types/recommendations";

// ─── Confidence Mapping ──────────────────────────────────────────────────────

const CONFIDENCE_MAP: Array<{ min: number; label: string; cls: string }> = [
  { min: 0.7, label: "Tinggi", cls: "bg-emerald-100 text-emerald-700" },
  { min: 0.4, label: "Sedang", cls: "bg-amber-100 text-amber-700" },
  { min: 0, label: "Rendah", cls: "bg-gray-100 text-gray-600" },
];

function getConfidenceBucket(confidence: number) {
  return CONFIDENCE_MAP.find((c) => confidence >= c.min) ?? CONFIDENCE_MAP[2];
}

// ─── Icons (inline SVG, aria-hidden) ─────────────────────────────────────────

function BriefcaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  career: CareerPossibility;
  isGenerating: boolean;
  onGenerate: () => void;
};

export function CareerPossibilityCard({ career, isGenerating, onGenerate }: Props) {
  const bucket = getConfidenceBucket(career.confidence);
  const hasCourses = career.suggested_courses.length > 0;

  return (
    <div className="rounded-xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#1c1c1c]">
            <BriefcaseIcon />
          </span>
          <h3 className="font-heading text-xl font-bold text-[#1c1c1c]">
            {career.role}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            bucket.cls,
          )}
        >
          {bucket.label}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 font-body text-sm leading-relaxed text-[#374151]">
        {career.description}
      </p>

      {/* Suggested courses */}
      {hasCourses && (
        <>
          <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
            Course yang disarankan
          </p>
          <div className="mb-4 space-y-2">
            {career.suggested_courses.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#f0f0f0] p-2 transition hover:border-gold/40 hover:bg-gold-soft/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.thumbnail_url}
                  alt=""
                  className="size-12 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-body text-sm font-semibold text-[#1c1c1c]">
                    {c.title}
                  </p>
                  <p className="font-body text-xs text-[#6b7280]">
                    {c.platform}
                    {c.level ? ` · ${c.level}` : ""}
                    {c.duration ? ` · ${c.duration}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[#6b7280]">
                  <ExternalLinkIcon />
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className={cn(
          primaryGoldCtaClass(
            "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-heading text-sm font-bold",
          ),
        )}
      >
        {isGenerating ? (
          <>
            <SpinnerIcon />
            Membuat jalur belajar...
          </>
        ) : (
          <>Buat jalur belajar ini →</>
        )}
      </button>
    </div>
  );
}
