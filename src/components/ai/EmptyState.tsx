"use client";

import { primaryGoldCtaClass } from "@/lib/primary-cta";

interface EmptyStateProps {
  topic?: string;
  onTryAgain?: () => void;
}

export function EmptyState({ topic, onTryAgain }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#f3f4f6]">
        <SearchIcon />
      </div>

      <h3 className="mb-2 font-heading text-xl font-bold text-[#1c1c1c]">
        Tidak ada kursus ditemukan
      </h3>

      {topic && (
        <p className="mb-6 font-body text-sm text-[#6b7280]">
          Topik &ldquo;{topic}&rdquo; tidak memiliki kursus di database kami saat ini.
        </p>
      )}

      {/* Suggestions */}
      <div className="mb-8 max-w-sm space-y-2 rounded border border-[#e5e7eb] bg-white p-5 text-left">
        <p className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
          Saran
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
            <span className="mt-1 shrink-0 text-gold">•</span>
            Coba topik yang lebih umum:{" "}
            <span className="font-bold text-[#1c1c1c]">&ldquo;machine learning&rdquo;</span>,{" "}
            <span className="font-bold text-[#1c1c1c]">&ldquo;web development&rdquo;</span>
          </li>
          <li className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
            <span className="mt-1 shrink-0 text-gold">•</span>
            Gunakan bahasa Inggris:{" "}
            <span className="font-bold text-[#1c1c1c]">&ldquo;data science&rdquo;</span>,{" "}
            <span className="font-bold text-[#1c1c1c]">&ldquo;cloud computing&rdquo;</span>
          </li>
        </ul>
      </div>

      {onTryAgain && (
        <button
          type="button"
          onClick={onTryAgain}
          className={primaryGoldCtaClass(
            "flex items-center gap-2 rounded px-6 py-3 font-heading text-sm font-bold",
          )}
        >
          <RefreshIcon />
          Coba Topik Lain
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
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