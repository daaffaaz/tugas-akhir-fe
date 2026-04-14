"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearningPathSummary, ModuleStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";

function PathIcon({ iconKey }: { iconKey: LearningPathSummary["iconKey"] }) {
  const common = "size-5 text-[#4b5563]";
  if (iconKey === "shield") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (iconKey === "brain") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4a3.5 3.5 0 0 0-3.5 3.5V9h-1A2.5 2.5 0 0 0 5 11.5v1A2.5 2.5 0 0 0 7.5 15H9v1.5A3.5 3.5 0 0 0 12.5 20h1A3.5 3.5 0 0 0 17 16.5V15h1.5A2.5 2.5 0 0 0 21 12.5v-1A2.5 2.5 0 0 0 18.5 9H17V7.5A3.5 3.5 0 0 0 13.5 4h-1.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ModuleTile({
  title,
  status,
  progressPercent,
  coursesRemaining,
  badge,
}: {
  title: string;
  status: ModuleStatus;
  progressPercent?: number;
  coursesRemaining?: number;
  badge?: string;
}) {
  const isDone = status === "completed";
  const isFocus = status === "in_progress";
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm",
        isFocus && "border-gold ring-1 ring-gold/40",
        isLocked && "opacity-60",
        !isFocus && !isLocked && "border-[#e5e7eb]",
      )}
    >
      {badge ? (
        <span
          className={cn(
            "w-fit rounded px-2 py-0.5 font-heading text-[9px] font-extrabold uppercase tracking-wide",
            isDone && "bg-[#1c1c1c] text-white",
            isFocus && "bg-gold text-dark",
            isLocked && "bg-[#e5e7eb] text-[#4b5563]",
          )}
        >
          {badge}
        </span>
      ) : null}
      <div className="flex items-start gap-2">
        {isDone ? (
          <span className="mt-0.5 text-gold" aria-hidden>
            &#10003;
          </span>
        ) : isLocked ? (
          <svg
            className="mt-0.5 size-4 shrink-0 text-[#9ca3af]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-gold/20 text-dark">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
        <p className="font-body text-sm font-bold text-[#1c1c1c]">{title}</p>
      </div>
      {isFocus && typeof progressPercent === "number" ? (
        <div>
          <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {typeof coursesRemaining === "number" ? (
            <p className="font-body text-xs text-muted">
              {coursesRemaining} kursus lagi
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function LearningPathCard({ path }: { path: LearningPathSummary }) {
  const [open, setOpen] = useState(path.id === "path-backend");
  const hasModules = path.modules.length > 0;

  return (
    <article className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-l-4 border-gold p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
            <PathIcon iconKey={path.iconKey} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-extrabold text-[#1c1c1c]">
                {path.title}
              </h3>
              <span className="rounded bg-[#e5e7eb] px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#4b5563]">
                {path.difficulty}
              </span>
            </div>
            {path.lastActivityLabel ? (
              <p className="mt-1 font-body text-sm text-muted">
                {path.lastActivityLabel}
              </p>
            ) : path.subtitle ? (
              <p className="mt-1 font-body text-sm text-muted">{path.subtitle}</p>
            ) : null}
            <div className="mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${path.progressPercent}%` }}
              />
            </div>
            <p className="mt-1 font-heading text-xs font-bold text-muted">
              {path.progressPercent}% selesai
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end lg:flex-row lg:items-center">
          {hasModules ? (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={primaryGoldCtaClassSoftDisabled(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-body text-sm font-bold shadow-sm",
              )}
            >
              {open ? "View details" : "Lihat detail"}
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
          ) : (
            <Link
              href={`/learning-path/${path.id}/modify`}
              className={primaryGoldCtaClassSoftDisabled(
                "inline-flex rounded-lg px-5 py-2.5 font-body text-sm font-bold shadow-sm",
              )}
            >
              Kelola path
            </Link>
          )}
        </div>
      </div>
      {open && hasModules ? (
        <div className="grid gap-6 border-t border-[#f0f0f0] bg-[#fafafa] p-6 md:grid-cols-2">
          <div>
            <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
              Deskripsi
            </p>
            <p className="font-body text-sm leading-relaxed text-[#374151]">
              {path.description ??
                "Jalur ini dirancang untuk membantu kamu menguasai topik secara bertahap."}
            </p>
            {path.completionTarget ? (
              <div className="mt-4 rounded border border-[#e5e7eb] bg-white p-4">
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af]">
                  Tujuan selesai
                </p>
                <p className="mt-1 font-body text-sm font-bold text-dark">
                  {path.completionTarget}
                </p>
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-3 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
              Modul utama
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {path.modules.map((m) => (
                <ModuleTile
                  key={m.id}
                  title={m.title}
                  status={m.status}
                  progressPercent={m.progressPercent}
                  coursesRemaining={m.coursesRemaining}
                  badge={m.badge}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
