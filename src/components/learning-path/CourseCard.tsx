"use client";

import { useState } from "react";
import type { LearningPathCourseItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { DeleteConfirmDialog } from "@/components/learning-path/DeleteConfirmDialog";

type Props = {
  course: LearningPathCourseItem;
  isFirst: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onDelete?: (course: LearningPathCourseItem) => void;
};

export function CourseCard({
  course,
  isFirst,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hasDetails = !!course.thumbnailUrl;

  return (
    <div
      className="relative flex gap-6"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex w-12 shrink-0 flex-col items-center pt-5">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded border text-xs font-extrabold",
            isFirst
              ? "border-gold bg-gold text-[#1c1c1c]"
              : "border-[#ededed] bg-white text-[#9ca3af]",
          )}
        >
          {String(course.order).padStart(2, "0")}
        </div>
      </div>

      <div
        className={cn(
          "relative z-[1] flex min-w-0 flex-1 flex-col rounded border border-[#e5e7eb] bg-white shadow-sm transition-colors",
          isDragging && "border-gold bg-gold-light/40",
        )}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {/* Header - always visible, clickable to expand */}
        <div
          className="flex items-center justify-between gap-4 p-5"
          role="button"
          tabIndex={0}
          onClick={() => hasDetails && setExpanded((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (hasDetails) setExpanded((v) => !v);
            }
          }}
          aria-expanded={expanded}
          style={{ cursor: hasDetails ? "pointer" : "default" }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex flex-col items-center gap-0.5 text-[#9ca3af]">
              <Tooltip content="Tarik untuk ubah urutan" side="right">
                <span
                  className="cursor-grab select-none active:cursor-grabbing"
                >
                  <GripIcon />
                </span>
              </Tooltip>
            </div>
            <div className="min-w-0">
              <p className="font-body text-lg font-bold text-[#1c1c1c]">
                {course.title}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9ca3af]">
                <span>{course.level}</span>
                <span className="size-1 rounded-full bg-[#e5e7eb]" />
                <span>{course.duration}</span>
              </p>
            </div>
          </div>

          {hasDetails && (
            <button
              type="button"
              className="shrink-0 rounded p-2 text-[#9ca3af] transition-transform duration-200 hover:bg-gray-50"
              aria-label={expanded ? "Collapse details" : "Expand details"}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            >
              <ChevronIcon
                className={cn(
                  "size-5 transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              />
            </button>
          )}
          <button
            type="button"
            className="shrink-0 rounded p-2 text-[#9ca3af] hover:bg-red-50 hover:text-red-600"
            aria-label="Hapus kursus"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <TrashIcon />
          </button>
        </div>

        {/* Expanded details */}
        {expanded && hasDetails && (
          <div className="border-t border-[#f3f4f6] px-[21px] pb-5 pt-4">
            <div className="ml-14 flex gap-6">
              {course.thumbnailUrl && (
                <div className="h-48 w-48 shrink-0 overflow-hidden rounded bg-[#e5e7eb]">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {course.price !== undefined && course.price !== null && (
                  <div className="mb-3 flex items-center gap-1 text-sm font-bold text-[#1c1c1c]">
                    <StarIcon className="size-4 text-[#fbbf24]" />
                    <span>{course.rating ?? "—"}</span>
                    <span className="font-normal text-[#6b7280]">
                      ({course.reviewCount?.toLocaleString() ?? "—"} reviews)
                    </span>
                    <span className="mx-2 text-[#d1d5db]">|</span>
                    <span>${course.price.toFixed(2)}</span>
                  </div>
                )}

                {course.aiInsight && (
                  <div className="mb-3 rounded border-l-4 border-gold bg-gold-light/30 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[#0c335a]">
                        <LightbulbIcon />
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121212]">
                        AI INSIGHT
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#121212]">
                      {course.aiInsight}
                    </p>
                  </div>
                )}

                {course.description && (
                  <p className="mb-3 text-sm leading-relaxed text-[#4b5563]">
                    {course.description}
                  </p>
                )}

                {course.whatYoullLearn && course.whatYoullLearn.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
                      What you&apos;ll learn:
                    </p>
                    <ul className="space-y-1 text-sm text-[#4b5563]">
                      {course.whatYoullLearn.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d1d5db]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-[#6b7280]">
                  {course.totalHours && (
                    <span className="flex items-center gap-1">
                      <ClockIcon className="size-4" />
                      {course.totalHours}
                    </span>
                  )}
                  {course.videoHours && (
                    <span className="flex items-center gap-1">
                      <PlayIcon className="size-4" />
                      {course.videoHours}
                    </span>
                  )}
                  {course.readings && (
                    <span className="flex items-center gap-1">
                      <BookIcon className="size-4" />
                      {course.readings}
                    </span>
                  )}
                  {course.assignments && (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="size-4" />
                      {course.assignments}
                    </span>
                  )}
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-end border-t border-[#e5e7eb] pt-4">
                  <button
                    type="button"
                    className="rounded border-2 border-gold bg-gold px-6 py-3 font-heading text-sm font-bold text-[#121212] shadow-sm hover:border-[#121212] hover:bg-[#121212] hover:text-gold"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => onDelete?.(course)}
        courseName={course.title}
      />
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="7" cy="3" r="1.5" />
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="7" cy="8" r="1.5" />
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="7" cy="13" r="1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}