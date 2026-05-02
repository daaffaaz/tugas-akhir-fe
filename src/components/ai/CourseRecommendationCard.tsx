"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AIExplanationBadge } from "./AIExplanationBadge";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import type { CourseRecommendation } from "@/types/rag";

interface CourseRecommendationCardProps {
  recommendation: CourseRecommendation;
  onSaveToggle: (id: string) => void;
  regenerateCount?: number;
}

function PlatformBadge({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <span className="inline-block rounded border border-[#e5e7eb] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
      {name}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };
  const cls = colorMap[level] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={cn("inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", cls)}>
      {level}
    </span>
  );
}

function StarRating({ rating, reviewsCount }: { rating: string; reviewsCount: number }) {
  const r = parseFloat(rating);
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.5;
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < full || (i === full && hasHalf)} />
        ))}
      </span>
      <span className="text-[#6b7280]">
        {r.toFixed(1)} ({reviewsCount.toLocaleString()} reviews)
      </span>
    </span>
  );
}

function formatPrice(price: string, currency: string) {
  const num = parseFloat(price);
  if (isNaN(num) || num === 0) return "Gratis";
  if (currency === "IDR") {
    return `IDR ${num.toLocaleString("id-ID")}`;
  }
  return `${currency} ${num.toFixed(2)}`;
}

export function CourseRecommendationCard({
  recommendation,
  onSaveToggle,
  regenerateCount = 0,
}: CourseRecommendationCardProps) {
  const { course_obj: course, ai_explanation, match_score, best_for, potential_gaps, is_saved, regenerate_count } = recommendation;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
      {/* Thumbnail */}
      {course.thumbnail_url && !imgError && (
        <div className="relative h-44 w-full overflow-hidden bg-[#e5e7eb]">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="size-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {imgError && (
        <div className="flex h-44 w-full items-center justify-center bg-[#f3f4f6] text-[#9ca3af]">
          <ImageIcon />
        </div>
      )}

      <div className="p-5">
        {/* Meta badges */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {course.platform?.name && <PlatformBadge name={course.platform.name} />}
          <LevelBadge level={course.level} />
          {regenerate_count > 0 && (
            <span className="inline-block rounded bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-bold text-[#6b7280]">
              Regenerated {regenerate_count}x
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 font-heading text-base font-bold leading-tight text-[#1c1c1c]">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="mb-2 font-body text-sm text-[#6b7280]">{course.instructor}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <StarRating rating={course.rating} reviewsCount={course.reviews_count} />
        </div>

        {/* Duration + Price */}
        <div className="mb-4 flex flex-wrap items-center gap-3 font-body text-sm text-[#4b5563]">
          {course.duration && (
            <span className="flex items-center gap-1">
              <ClockIcon /> {course.duration}
            </span>
          )}
          {course.video_hours && (
            <span className="flex items-center gap-1">
              <PlayIcon /> {parseFloat(course.video_hours).toFixed(0)} hours
            </span>
          )}
          <span className="ml-auto font-bold text-[#1c1c1c]">
            {formatPrice(course.price, course.currency)}
          </span>
        </div>

        {/* AI Explanation */}
        <div className="mb-4">
          <AIExplanationBadge
            aiExplanation={ai_explanation}
            matchScore={match_score}
            bestFor={best_for}
            potentialGaps={potential_gaps}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveToggle(recommendation.id)}
            className={cn(
              "flex items-center gap-2 rounded border px-4 py-2.5 font-heading text-sm font-bold transition-colors",
              is_saved
                ? "border-gold bg-gold text-[#121212]"
                : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-gold hover:text-[#121212]",
            )}
          >
            <BookmarkIcon filled={is_saved} />
            {is_saved ? "Tersimpan" : "Simpan"}
          </button>

          {course.url && (
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                primaryGoldCtaClass("flex items-center gap-2 rounded px-4 py-2.5 font-heading text-sm font-bold"),
              )}
            >
              <ExternalLinkIcon />
              Lihat di {course.platform?.name ?? "Platform"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "#fbbf24" : "none"}
      stroke="#fbbf24"
      strokeWidth="2"
      className="mr-0.5"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}