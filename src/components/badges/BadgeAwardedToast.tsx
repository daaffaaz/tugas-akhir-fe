"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types/badges";
import { BadgeIcon } from "./BadgeIcon";

// ─── Event bus ───────────────────────────────────────────────────────────────

const EVENT_AWARDED = "badge:awarded";
const EVENT_DISMISS = "badge:dismiss";

interface AwardedPayload {
  id: string;
  badge: Badge;
  duration: number;
}

/**
 * Trigger fancy celebration toast untuk badge baru yang di-earn.
 * Aman dipanggil dari mana saja di FE (akan no-op kalau provider belum mount).
 */
export function showBadgeAwarded(badge: Badge, opts?: { duration?: number }) {
  if (typeof window === "undefined") return;
  const id = `award-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  window.dispatchEvent(
    new CustomEvent(EVENT_AWARDED, {
      detail: {
        id,
        badge,
        duration: opts?.duration ?? 6000,
      } satisfies AwardedPayload,
    }),
  );
}

function dispatchDismiss(id: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_DISMISS, { detail: { id } }));
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface ActiveToast extends AwardedPayload {
  closing: boolean;
}

export function BadgeAwardedToastProvider() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const onAwarded = (e: Event) => {
      const detail = (e as CustomEvent<AwardedPayload>).detail;
      if (!detail) return;
      setToasts((prev) => [...prev, { ...detail, closing: false }]);
    };

    const onDismiss = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail ?? { id: "" };
      // Mark closing first to play exit animation, then remove after 300ms
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, closing: true } : t)),
      );
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 320);
    };

    window.addEventListener(EVENT_AWARDED, onAwarded);
    window.addEventListener(EVENT_DISMISS, onDismiss);
    return () => {
      window.removeEventListener(EVENT_AWARDED, onAwarded);
      window.removeEventListener(EVENT_DISMISS, onDismiss);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Badge baru"
      className="pointer-events-none fixed bottom-6 right-6 z-[10000] flex w-[360px] flex-col gap-3"
    >
      {toasts.map((t) => (
        <BadgeAwardedToastItem
          key={t.id}
          payload={t}
          onDismiss={() => dispatchDismiss(t.id)}
        />
      ))}
    </div>
  );
}

// ─── Single toast item ───────────────────────────────────────────────────────

function BadgeAwardedToastItem({
  payload,
  onDismiss,
}: {
  payload: ActiveToast;
  onDismiss: () => void;
}) {
  const { badge, duration, closing } = payload;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0 || closing) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        onDismiss();
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [duration, closing, onDismiss]);

  // 8 sparkle ticks radiating around the badge — only render once on mount
  const sparkleAngles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => (i * 360) / 8),
    [],
  );

  return (
    <div
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-xl border border-gold/40 bg-white shadow-[0_18px_40px_-12px_rgba(255,206,0,0.45),0_4px_12px_rgba(0,0,0,0.08)]",
        closing ? "animate-badge-toast-out" : "animate-badge-toast-in",
      )}
    >
      {/* Soft gold gradient background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(255,206,0,0.18) 0%, rgba(255,206,0,0) 60%)",
        }}
      />

      <div className="relative flex items-start gap-4 px-5 py-4">
        {/* Badge icon with sparkle burst */}
        <div className="relative flex shrink-0 items-center justify-center">
          {/* Sparkles */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {sparkleAngles.map((rot, i) => (
              <span
                key={i}
                className="animate-sparkle-burst absolute block size-1.5 rounded-full bg-gold"
                style={
                  {
                    "--rot": `${rot}deg`,
                    animationDelay: `${i * 0.04}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className="animate-badge-pop-in relative">
            <BadgeIcon
              category={badge.category}
              level={badge.level}
              iconUrl={badge.icon_url}
              size={68}
              glow
              shine
            />
          </div>
        </div>

        {/* Text content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
          <p className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-gold">
            Badge Baru Diraih!
          </p>
          <p className="font-heading text-[16px] font-extrabold leading-tight text-[#1c1c1c]">
            {badge.name}
          </p>
          <p className="line-clamp-2 font-body text-[12px] leading-snug text-[#4b5563]">
            {badge.description}
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#1c1c1c]"
          aria-label="Tutup notifikasi"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 w-full bg-[#f3f4f6]">
        <div
          className="h-full bg-gradient-to-r from-gold to-amber-400 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
