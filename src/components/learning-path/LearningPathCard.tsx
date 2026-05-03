"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearningPathListItem } from "@/types/rag";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LearningPathCard({ path }: { path: LearningPathListItem }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-l-4 border-gold p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-extrabold text-[#1c1c1c]">
                  {path.title}
                </h3>
                {path.regenerate_count > 0 && (
                  <span className="rounded-full bg-[#f3f4f6] px-2.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                    Regenerated {path.regenerate_count}x
                  </span>
                )}
                {path.is_saved && (
                  <span className="text-gold" title="Saved">
                    <BookmarkIcon />
                  </span>
                )}
              </div>
              <p className="mt-1 font-body text-sm text-muted">
                {path.topic_input}
              </p>
              <p className="mt-1 font-body text-xs text-[#9ca3af]">
                {formatDate(path.created_at)} &middot; {path.completed_courses}/
                {path.total_courses} kursus selesai
              </p>
              <div className="mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-[#e5e7eb]">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${path.progress_percentage}%` }}
                />
              </div>
              <p className="mt-1 font-heading text-xs font-bold text-muted">
                {path.progress_percentage}% selesai
              </p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={primaryGoldCtaClassSoftDisabled(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-body text-sm font-bold shadow-sm",
            )}
          >
            {open ? "Sembunyikan" : "Detail"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={cn("transition-transform", open && "rotate-180")}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link
            href={`/learning-path/${path.id}/modify`}
            className={primaryGoldCtaClassSoftDisabled(
              "inline-flex rounded-lg px-5 py-2.5 font-body text-sm font-bold shadow-sm",
            )}
          >
            Kelola
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#f0f0f0] bg-[#fafafa] p-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af]">
                Total Kursus
              </p>
              <p className="font-heading text-xl font-extrabold text-dark">
                {path.total_courses}
              </p>
            </div>
            <div>
              <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af]">
                Selesai
              </p>
              <p className="font-heading text-xl font-extrabold text-dark">
                {path.completed_courses}
              </p>
            </div>
            <div>
              <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af]">
                Regenerasi
              </p>
              <p className="font-heading text-xl font-extrabold text-dark">
                {path.regenerate_count}x
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function BookmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
