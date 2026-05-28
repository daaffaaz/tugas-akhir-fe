"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMyBadges } from "@/lib/api/badges";
import { QuestionnaireRequiredError } from "@/types/rag";
import { BADGE_CATEGORIES, type UserBadge, type BadgeCategory } from "@/types/badges";
import { UserBadgeCard } from "./BadgeCard";
import { BadgeIcon } from "./BadgeIcon";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_LABEL_OVERRIDE: Partial<Record<BadgeCategory, string>> = {
  ml_ai: "Machine Learning",
};

function groupBadges(list: UserBadge[]): Map<BadgeCategory, UserBadge[]> {
  const map = new Map<BadgeCategory, UserBadge[]>();
  for (const ub of list) {
    const key = ub.badge.category;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ub);
  }
  return map;
}

// ─── MyBadgesSection ─────────────────────────────────────────────────────────

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

  const grouped = useMemo(() => groupBadges(badges), [badges]);
  const earnedCount = badges.length;

  // Loading skeleton
  if (loading) {
    return (
      <section
        className={cn(
          "rounded border border-[#e0e0e0] bg-white p-8 shadow-sm",
          className,
        )}
        aria-busy="true"
      >
        <BadgesHeader earnedCount={null} />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4"
            >
              <div className="size-[72px] rounded-full bg-[#e5e7eb]" />
              <div className="h-3 w-20 rounded bg-[#e5e7eb]" />
              <div className="h-2 w-12 rounded bg-[#f3f4f6]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className={cn(
          "rounded border border-red-200 bg-red-50 p-8 shadow-sm",
          className,
        )}
      >
        <BadgesHeader earnedCount={null} />
        <p className="mt-4 font-body text-sm text-red-600">{error}</p>
      </section>
    );
  }

  // Empty state
  if (earnedCount === 0) {
    return (
      <section
        className={cn(
          "rounded border border-[#e0e0e0] bg-white p-8 shadow-sm",
          className,
        )}
      >
        <BadgesHeader earnedCount={0} />
        <div className="mt-6 flex flex-col items-center gap-4 rounded border border-dashed border-[#e5e7eb] bg-[#fafafa] px-6 py-10 text-center">
          {/* Decorative locked sample */}
          <BadgeIcon category="frontend" level="pemula" locked size={72} />
          <div className="max-w-md">
            <p className="font-heading text-sm font-extrabold text-[#1c1c1c]">
              Belum ada badge yang diraih
            </p>
            <p className="mt-1 font-body text-xs leading-relaxed text-[#6b7280]">
              Selesaikan kursus di learning path-mu untuk mendapatkan badge
              sesuai kategori & level course. Setiap kursus selesai bisa
              memunculkan badge baru.
            </p>
          </div>
          <Link
            href="/learning-path"
            className="rounded bg-gold px-5 py-2 font-heading text-[11px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c] hover:bg-dark hover:text-gold"
          >
            Mulai belajar
          </Link>
        </div>
      </section>
    );
  }

  // Grouped display
  const categoriesWithBadges = BADGE_CATEGORIES.filter((cat) =>
    grouped.has(cat),
  );

  return (
    <section
      className={cn(
        "rounded border border-[#e0e0e0] bg-white p-8 shadow-sm",
        className,
      )}
    >
      <BadgesHeader earnedCount={earnedCount} />

      <div className="mt-6 space-y-7">
        {categoriesWithBadges.map((cat) => {
          const items = grouped.get(cat)!;
          // Ambil label dari first badge (semua badge di kategori sama akan punya label sama)
          const label =
            CATEGORY_LABEL_OVERRIDE[cat] ?? items[0]?.badge.category_label ?? cat;
          return (
            <div key={cat}>
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-[#f3f4f6] pb-2">
                <h3 className="font-heading text-[13px] font-extrabold text-[#1c1c1c]">
                  {label}
                </h3>
                <span className="font-body text-[10px] font-bold uppercase tracking-[1px] text-[#9ca3af]">
                  {items.length} badge
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map((ub) => (
                  <UserBadgeCard key={ub.id} userBadge={ub} size="md" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Header sub-component ────────────────────────────────────────────────────

function BadgesHeader({ earnedCount }: { earnedCount: number | null }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-[#1f2937]">
        <span className="text-gold">&#9679;</span> Badge & Pencapaian
      </h2>
      {earnedCount !== null && (
        <span className="rounded-full bg-gold/15 px-3 py-1 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c]">
          {earnedCount} dari 24 diraih
        </span>
      )}
    </div>
  );
}
