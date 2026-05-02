"use client";

import { cn } from "@/lib/utils";

interface AIExplanationBadgeProps {
  aiExplanation: string;
  matchScore: number; // 0–1
  bestFor: string;
  potentialGaps: string;
}

function MatchScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[#6b7280]">
        <span>Match Score</span>
        <span className="font-bold text-[#1c1c1c]">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#e5e7eb] bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
      {children}
    </span>
  );
}

export function AIExplanationBadge({
  aiExplanation,
  matchScore,
  bestFor,
  potentialGaps,
}: AIExplanationBadgeProps) {
  return (
    <div className="rounded border-l-4 border-gold bg-gold-light/30 px-4 py-3">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <LightbulbIcon />
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121212]">
          AI Reason
        </span>
      </div>

      {/* AI explanation text */}
      <p className="mb-3 text-sm leading-relaxed text-[#121212]">
        &ldquo;{aiExplanation}&rdquo;
      </p>

      {/* Match score + best for */}
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <MatchScoreBar score={matchScore} />
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
            Best For
          </span>
          <p className="text-xs leading-relaxed text-[#374151]">{bestFor}</p>
        </div>
      </div>

      {/* Gaps */}
      {potentialGaps && (
        <div className="space-y-1 border-t border-[#e5e7eb] pt-2">
          <div className="flex items-center gap-1.5">
            <AlertIcon />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#92400e]">
              Potential Gaps
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#92400e]">{potentialGaps}</p>
        </div>
      )}
    </div>
  );
}

function LightbulbIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0c335a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#92400e"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}