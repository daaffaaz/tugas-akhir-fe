"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMyBadges } from "@/lib/api/badges";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { UserBadge } from "@/types/badges";
import { BadgeIcon } from "./BadgeIcon";

// ─── BadgeStrip ──────────────────────────────────────────────────────────────

interface Props {
  className?: string;
  /** Maks jumlah badge yang ditampilkan di strip. Sisanya jadi "+N". */
  maxVisible?: number;
  /** Pre-fetched badges (kalau sudah ada dari parent). Kalau undefined akan fetch sendiri. */
  initialBadges?: UserBadge[];
  /** Link tujuan "lihat semua". */
  seeAllHref?: string;
}

export function BadgeStrip({
  className,
  maxVisible = 8,
  initialBadges,
  seeAllHref = "/profile",
}: Props) {
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
          // Halaman ini biasanya sudah di-guard di tempat lain; biar tidak hard-redirect dari child.
          setError("Lengkapi questionnaire untuk melihat badge.");
          setLoading(false);
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat badge.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialBadges]);

  // Loading skeleton — compact
  if (loading) {
    return (
      <section
        className={cn(
          "rounded-xl border border-[#e5e7eb] bg-white px-8 py-6 shadow-sm",
          className,
        )}
        aria-busy="true"
      >
        <StripHeader earned={null} total={24} />
        <div className="mt-4 flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="size-14 animate-pulse rounded-full bg-[#e5e7eb]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={cn(
          "rounded-xl border border-amber-200 bg-amber-50 px-8 py-6 shadow-sm",
          className,
        )}
      >
        <StripHeader earned={null} total={24} />
        <p className="mt-2 font-body text-sm text-amber-800">{error}</p>
      </section>
    );
  }

  const earnedCount = badges.length;

  // Empty state — kompak, tetap berguna sebagai onboarding visual
  if (earnedCount === 0) {
    return (
      <section
        className={cn(
          "rounded-xl border border-[#e5e7eb] bg-white px-8 py-6 shadow-sm",
          className,
        )}
      >
        <StripHeader earned={0} total={24} />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex -space-x-2">
            <BadgeIcon category="frontend" level="pemula" locked size={44} />
            <BadgeIcon category="ml_ai" level="menengah" locked size={44} />
            <BadgeIcon category="cybersecurity" level="mahir" locked size={44} />
          </div>
          <p className="font-body text-[13px] leading-tight text-[#4b5563]">
            Belum ada badge. Selesaikan kursus di learning path untuk meraih
            badge pertamamu — ada{" "}
            <span className="font-bold text-[#1c1c1c]">24 badge</span> untuk
            di-unlock!
          </p>
        </div>
      </section>
    );
  }

  const visible = badges.slice(0, maxVisible);
  const remaining = Math.max(0, earnedCount - visible.length);

  return (
    <section
      className={cn(
        "rounded-xl border border-[#e5e7eb] bg-white px-8 py-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <StripHeader earned={earnedCount} total={24} />
        <Link
          href={seeAllHref}
          className="shrink-0 font-body text-[11px] font-bold uppercase tracking-[1px] text-[#6b7280] hover:text-[#1c1c1c]"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {visible.map((ub) => (
          <div
            key={ub.id}
            className="group relative"
            title={`${ub.badge.name} • ${ub.badge.level_label}`}
          >
            <BadgeIcon
              category={ub.badge.category}
              level={ub.badge.level}
              iconUrl={ub.badge.icon_url}
              size={56}
              className="transition-transform group-hover:scale-110"
            />
            {/* Hover label */}
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1c1c1c] px-2 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
              {ub.badge.name}
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <Link
            href={seeAllHref}
            className="flex size-14 items-center justify-center rounded-full border border-dashed border-[#e5e7eb] bg-[#fafafa] font-heading text-[12px] font-extrabold text-[#6b7280] transition-colors hover:border-gold hover:text-[#1c1c1c]"
            aria-label={`Lihat ${remaining} badge lainnya`}
          >
            +{remaining}
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── StripHeader ─────────────────────────────────────────────────────────────

function StripHeader({
  earned,
  total,
}: {
  earned: number | null;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-gold/15">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1c1c1c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.12" />
        </svg>
      </div>
      <div>
        <p className="font-heading text-base font-extrabold text-[#1c1c1c]">
          Badge Pencapaian
        </p>
        <p className="font-body text-xs text-[#6b7280]">
          {earned === null ? "Memuat..." : `${earned} dari ${total} badge diraih`}
        </p>
      </div>
    </div>
  );
}
