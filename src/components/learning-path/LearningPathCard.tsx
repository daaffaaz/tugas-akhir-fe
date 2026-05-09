"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearningPathListItem } from "@/types/rag";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";

function formatDuration(weeks?: number | null): string {
  if (!weeks) return "";
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.round(weeks / 4);
  return months === 1 ? "~1 month" : `~${months} months`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Baru saja";
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function ComputerIcon() {
  return (
    <svg className="size-5 text-[#4b5563]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LearningPathCard({ path }: { path: LearningPathListItem }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      {/* Main row */}
      <div className="flex flex-col gap-4 border-l-4 border-gold p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          {/* Icon */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
            <ComputerIcon />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-extrabold text-[#1c1c1c]">
                {path.title}
              </h3>
              {path.difficulty && (
                <span className="rounded bg-[#e5e7eb] px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#4b5563]">
                  {path.difficulty}
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-[#6b7280]">
              <span>{path.total_courses} courses</span>
              <span className="text-[#d1d5db]">•</span>
              <span>{path.completed_courses} completed</span>
              {path.total_duration_weeks && (
                <>
                  <span className="text-[#d1d5db]">•</span>
                  <span>{formatDuration(path.total_duration_weeks)}</span>
                </>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${path.progress_percentage}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="font-heading text-xs font-bold text-[#6b7280]">
                {path.progress_percentage}% selesai
              </p>
              <p className="font-body text-xs text-[#9ca3af]">
                {formatDate(path.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end lg:flex-row lg:items-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              primaryGoldCtaClassSoftDisabled(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-body text-sm font-bold shadow-sm",
              ),
            )}
          >
            {open ? "Tutup" : "Detail"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={cn("transition-transform", open && "rotate-180")}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            href={`/learning-path/${path.id}/modify`}
            className={cn(
              primaryGoldCtaClassSoftDisabled(
                "inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-body text-sm font-bold shadow-sm text-[#1c1c1c]",
              ),
            )}
          >
            Kelola
          </Link>
        </div>
      </div>

      {/* Expandable detail section */}
      {open && (
        <div className="border-t border-[#f0f0f0] bg-[#fafafa] p-6">
          {path.topic_input && (
            <div className="mb-4">
              <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
                Topik
              </p>
              <p className="font-body text-sm text-[#374151]">{path.topic_input}</p>
            </div>
          )}

          {path.description && (
            <div className="mb-4">
              <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
                Deskripsi
              </p>
              <p className="font-body text-sm leading-relaxed text-[#374151]">
                {path.description}
              </p>
            </div>
          )}

          {path.target_skills && path.target_skills.length > 0 && (
            <div>
              <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
                Target Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {path.target_skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 font-body text-xs font-bold text-[#4b5563]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
