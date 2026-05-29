"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMyBadges } from "@/lib/api/badges";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { UserBadge } from "@/types/badges";
import { BadgeIcon } from "./BadgeIcon";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEarnedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── MyBadgesSection (compact profile variant) ───────────────────────────────

interface Props {
  className?: string;
  /** Pre-fetched badges; if not provided, akan fetch sendiri. */
  initialBadges?: UserBadge[];
}

export function MyBadgesSection({ className, initialBadges }: Props) {
  const [badges, setBadges] = useState<UserBadge[]>(initialBadges ?? []);
  const [loading, setLoading] = useState(initialBadges === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBadges !== undefined) return;
    let cancelled = false;
    getMyBadges()
      .then((list) => {
        if (cancelled) return;
        setBadges(list);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof QuestionnaireRequiredError) {
          window.location.href = "/questionnaire";
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat badge.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialBadges]);

  const earnedCount = badges.length;

  // Loading skeleton — compact
  if (loading) {
    return (
      <section
        className={cn(
          "rounded border border-[#e0e0e0] bg-white p-5 shadow-sm",
          className,
        )}
        aria-busy="true"
      >
        <BadgesHeader earnedCount={null} />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="size-12 animate-pulse rounded-full bg-[#e5e7eb]"
            />
          ))}
        </div>
      </section>
    );
  }

  // Error state — compact
  if (error) {
    return (
      <section
        className={cn(
          "rounded border border-red-200 bg-red-50 px-5 py-4 shadow-sm",
          className,
        )}
      >
        <BadgesHeader earnedCount={null} />
        <p className="mt-2 font-body text-xs text-red-600">{error}</p>
      </section>
    );
  }

  // Empty state — compact (inline horizontal)
  if (earnedCount === 0) {
    return (
      <section
        className={cn(
          "rounded border border-[#e0e0e0] bg-white p-5 shadow-sm",
          className,
        )}
      >
        <BadgesHeader earnedCount={0} />
        <div className="mt-3 flex items-center gap-4">
          <div className="flex -space-x-1.5">
            <BadgeIcon category="frontend" level="pemula" locked size={36} />
            <BadgeIcon category="ml_ai" level="menengah" locked size={36} />
            <BadgeIcon category="cybersecurity" level="mahir" locked size={36} />
          </div>
          <p className="flex-1 font-body text-[12px] leading-snug text-[#6b7280]">
            Belum ada badge. Selesaikan kursus di learning path untuk meraih
            badge pertamamu.
          </p>
          <Link
            href="/learning-path"
            className="shrink-0 rounded bg-gold px-3 py-1.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c] hover:bg-dark hover:text-gold"
          >
            Mulai
          </Link>
        </div>
      </section>
    );
  }

  // Earned display — flat compact strip
  return (
    <section
      className={cn(
        "rounded border border-[#e0e0e0] bg-white p-5 shadow-sm",
        className,
      )}
    >
      <BadgesHeader earnedCount={earnedCount} />

      <div className="mt-3 flex flex-wrap gap-2">
        {badges.map((ub) => (
          <BadgeTile key={ub.id} userBadge={ub} />
        ))}
      </div>
    </section>
  );
}

// ─── Compact badge tile (icon + hover tooltip) ───────────────────────────────

function BadgeTile({ userBadge }: { userBadge: UserBadge }) {
  const { badge, earned_at } = userBadge;
  return (
    <div
      className="group relative"
      title={`${badge.name} • ${badge.level_label}`}
    >
      <BadgeIcon
        category={badge.category}
        level={badge.level}
        iconUrl={badge.icon_url}
        size={48}
        className="transition-transform group-hover:scale-110"
      />
      {/* Hover tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded bg-[#1c1c1c] px-2.5 py-1.5 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        <p className="font-heading text-[11px] font-extrabold text-white">
          {badge.name}
        </p>
        <p className="font-body text-[9px] font-bold uppercase tracking-wide text-gold/90">
          {badge.level_label} · {formatEarnedDate(earned_at)}
        </p>
      </div>
    </div>
  );
}

// ─── Header sub-component (compact) ──────────────────────────────────────────

function BadgesHeader({ earnedCount }: { earnedCount: number | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-heading text-[13px] font-extrabold text-[#1f2937]">
        <span className="text-gold">&#9679;</span> Badge & Pencapaian
      </h2>
      {earnedCount !== null && (
        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c]">
          {earnedCount} / 24
        </span>
      )}
    </div>
  );
}
