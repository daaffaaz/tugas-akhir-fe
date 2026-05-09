"use client";

import { useState } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { LearningPathCourse, LearningPathPhase } from "@/types/rag";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AugmentedCourse extends LearningPathCourse {
  phaseName?: string;
  matchReason?: string;
  learningObjectives?: string[];
}

type PhaseCardProps = {
  phase: LearningPathPhase | null; // null untuk grup "Kursus Tambahan"
  phaseLabel: string;
  courses: AugmentedCourse[]; // sudah difilter & berurutan sesuai draft
  isLast: boolean;
  expandedCourseId: string | null;
  onToggleExpand: (courseId: string) => void;
  onToggleComplete: (courseId: string) => void;
  onDelete: (courseId: string) => void;
  onReplace: (courseId: string, courseTitle: string) => void;
};

// ─── PhaseCard ───────────────────────────────────────────────────────────────

export function PhaseCard({
  phase,
  phaseLabel,
  courses,
  isLast,
  expandedCourseId,
  onToggleExpand,
  onToggleComplete,
  onDelete,
  onReplace,
}: PhaseCardProps) {
  const [metaExpanded, setMetaExpanded] = useState(false);
  const isUnassigned = phase === null;

  const hasMeta =
    !isUnassigned &&
    Boolean(
      phase!.learning_objectives?.length ||
        phase!.milestones?.length ||
        phase!.practice_projects?.length ||
        phase!.skill_progress?.skills_gained?.length ||
        (!isLast && phase!.transition_to_next),
    );

  const skillCoverage = phase?.skill_progress?.skill_coverage ?? null;

  return (
    <section className="flex flex-col gap-4">
      {/* Phase header */}
      <div
        className={cn(
          "overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
          !isUnassigned && "border-l-4 border-l-gold",
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-4 p-6",
            !isUnassigned && "bg-gradient-to-r from-[#fff9e6] to-white",
          )}
        >
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {!isUnassigned ? (
                <>
                  <span className="rounded bg-gold px-2.5 py-1 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-dark">
                    Fase {phase!.phase_number}
                  </span>
                  {phase!.duration_weeks ? (
                    <span className="rounded bg-[#f3f4f6] px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[1px] text-[#6b7280]">
                      ~{phase!.duration_weeks} minggu
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="rounded bg-[#1c1c1c] px-2.5 py-1 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-white">
                  Tambahan
                </span>
              )}
              {courses.length > 0 && (
                <span className="rounded bg-[#1c1c1c] px-2.5 py-1 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-white">
                  {courses.length} course{courses.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl font-extrabold text-dark sm:text-2xl">
              {phaseLabel}
            </h2>
          </div>
          {skillCoverage !== null && (
            <div className="hidden shrink-0 sm:block">
              <p className="mb-1 text-right font-heading text-[10px] font-bold uppercase tracking-[1px] text-[#6b7280]">
                Skill coverage
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.round(skillCoverage * 100)}%` }}
                  />
                </div>
                <span className="font-heading text-sm font-extrabold text-gold">
                  {Math.round(skillCoverage * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Phase reason (always visible) */}
        {!isUnassigned && phase!.phase_reason && (
          <div className="border-t border-[#f3f4f6] px-6 py-4">
            <p className="font-body text-[14px] leading-[22px] text-[#4b5563]">
              <span className="font-bold text-[#1c1c1c]">
                Mengapa fase ini ada:{" "}
              </span>
              {phase!.phase_reason}
            </p>
          </div>
        )}

        {/* Collapsible metadata */}
        {hasMeta && (
          <>
            <button
              type="button"
              onClick={() => setMetaExpanded((s) => !s)}
              className="flex w-full items-center justify-between gap-3 border-t border-[#f3f4f6] px-6 py-3 text-left transition-colors hover:bg-[#fafafa]"
            >
              <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#6b7280]">
                {metaExpanded
                  ? "Sembunyikan detail fase"
                  : "Tampilkan detail fase (objectives, milestones, projects)"}
              </span>
              <span
                className={cn(
                  "text-[#9ca3af] transition-transform",
                  metaExpanded && "rotate-180",
                )}
              >
                <ChevronDownIcon />
              </span>
            </button>
            {metaExpanded && (
              <div className="space-y-5 border-t border-[#f3f4f6] bg-[#fafafa] px-6 py-5">
                {phase!.learning_objectives?.length > 0 && (
                  <MetaSection
                    label="Learning Objectives"
                    items={phase!.learning_objectives}
                  />
                )}
                {phase!.milestones?.length > 0 && (
                  <div>
                    <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
                      Milestones
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase!.milestones.map((m, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 font-body text-xs font-bold text-dark"
                        >
                          <FlagIcon /> {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {phase!.practice_projects?.length > 0 && (
                  <MetaSection
                    label="Practice Projects"
                    items={phase!.practice_projects}
                  />
                )}
                {phase!.skill_progress?.skills_gained?.length > 0 && (
                  <div>
                    <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
                      Skills Gained
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase!.skill_progress.skills_gained.map((s, i) => (
                        <span
                          key={i}
                          className="rounded border border-[#e5e7eb] bg-white px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#4b5563]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!isLast && phase!.transition_to_next && (
                  <div className="rounded-md border-l-4 border-gold bg-white p-4">
                    <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#6b7280]">
                      Transisi ke fase selanjutnya
                    </p>
                    <p className="font-body text-[14px] leading-[22px] text-[#4b5563]">
                      {phase!.transition_to_next}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Course timeline list */}
      {courses.length > 0 && (
        <div className="relative flex flex-col gap-4">
          {/* Vertical timeline line */}
          <div className="pointer-events-none absolute bottom-3 left-6 top-3 w-px bg-[#e5e7eb]" />
          <SortableContext
            items={courses.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {courses.map((course, idx) => (
              <SortableCourseRow
                key={course.id}
                course={course}
                index={idx}
                phaseObjectives={phase?.learning_objectives}
                expanded={expandedCourseId === course.id}
                onToggle={() => onToggleExpand(course.id)}
                onDelete={() => onDelete(course.id)}
                onToggleComplete={() => onToggleComplete(course.id)}
                onReplace={() =>
                  onReplace(course.course.id, course.course.title)
                }
              />
            ))}
          </SortableContext>
        </div>
      )}
    </section>
  );
}

function MetaSection({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 font-body text-[14px] text-[#4b5563]"
          >
            <span className="mt-[6px] size-1.5 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sortable Course Row ────────────────────────────────────────────────────

interface CourseRowProps {
  course: AugmentedCourse;
  index: number; // 0-based, di-render sebagai 01, 02, …
  phaseObjectives?: string[];
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onReplace: () => void;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
}

function SortableCourseRow(props: Omit<CourseRowProps, "dragListeners" | "dragAttributes">) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.course.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <CourseRow {...props} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
}

function CourseRow({
  course,
  index,
  phaseObjectives,
  expanded,
  onToggle,
  onDelete,
  onToggleComplete,
  onReplace,
  dragListeners,
  dragAttributes,
}: CourseRowProps) {
  const isCompleted = course.is_completed;
  const num = String(index + 1).padStart(2, "0");
  const levelLabel = (course.course.level ?? "").toUpperCase();
  const hrs = course.course.video_hours
    ? `${Math.round(parseFloat(course.course.video_hours))}H`
    : "";
  const metaLine = [levelLabel, hrs].filter(Boolean).join(" · ");
  const [showTooltip, setShowTooltip] = useState(false);
  const priceNum = course.course.price ? parseFloat(course.course.price) : 0;
  const ratingNum = course.course.rating ? parseFloat(course.course.rating) : 0;

  // What you'll learn — prefer course.what_you_learn, fallback ke phaseObjectives.
  // Cast lewat `unknown` karena BE kadang return string CSV walaupun tipenya string[]
  const whatYouLearnRaw: unknown =
    course.course.what_you_learn ?? phaseObjectives;
  let whatYouLearnList: string[] | null = null;
  if (Array.isArray(whatYouLearnRaw) && whatYouLearnRaw.length > 0) {
    whatYouLearnList = whatYouLearnRaw as string[];
  } else if (
    typeof whatYouLearnRaw === "string" &&
    whatYouLearnRaw.length > 0
  ) {
    whatYouLearnList = whatYouLearnRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return (
    <div className="flex items-start gap-6">
      {/* Number badge column */}
      <div className="flex h-[68px] w-[48px] shrink-0 flex-col items-start pt-5">
        <div
          className={cn(
            "flex size-[48px] items-center justify-center rounded font-heading text-[12px] font-extrabold",
            expanded
              ? "border border-gold bg-gold text-[#1c1c1c]"
              : isCompleted
                ? "border border-gold/40 bg-gold/10 text-[#1c1c1c]"
                : "border border-[#ededed] bg-white text-[#9ca3af]",
          )}
        >
          {num}
        </div>
      </div>

      {/* Card */}
      <div className="min-w-0 flex-1 rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {expanded ? (
          // ── Expanded header ──
          <div className="relative flex items-center gap-3 p-[21px]">
            <div
              className="relative flex shrink-0 flex-col items-start"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                type="button"
                className="cursor-grab touch-none active:cursor-grabbing"
                {...dragListeners}
                {...dragAttributes}
                aria-label="Drag to reorder"
              >
                <DragDotsIcon />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-0 z-10 -translate-y-full">
                  <div className="whitespace-nowrap rounded bg-[#1f2937] px-[10px] py-[6px] font-body text-[10px] font-semibold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
                    Seret untuk mengatur urutan
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={onToggle} className="shrink-0" aria-label="Collapse">
              <ChevronDownIcon className="rotate-180" />
            </button>
            <div className="ml-2 flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate font-body text-[18px] font-bold leading-[28px] text-[#121212]">
                {course.course.title}
              </p>
              {metaLine && (
                <p className="font-body text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                  {metaLine}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onDelete}
              className="ml-2 shrink-0 p-2 text-[#9ca3af] hover:text-red-500"
              aria-label="Hapus kursus"
            >
              <TrashIcon />
            </button>
          </div>
        ) : (
          // ── Collapsed row ──
          <div className="flex w-full items-center justify-between gap-4 p-[20px]">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div
                className="cursor-grab touch-none active:cursor-grabbing"
                {...dragListeners}
                {...dragAttributes}
                aria-label="Drag to reorder"
              >
                <DragDotsSmIcon />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete();
                }}
                className={cn(
                  "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors",
                  isCompleted
                    ? "border-gold bg-gold"
                    : "border-[#d1d5db] bg-white hover:border-[#9ca3af]",
                )}
                aria-label={isCompleted ? "Tandai belum selesai" : "Tandai selesai"}
              >
                {isCompleted && <CheckIcon />}
              </button>
              <button
                type="button"
                onClick={onToggle}
                className="flex min-w-0 flex-1 flex-col items-start gap-[5.5px] text-left"
              >
                <p
                  className={cn(
                    "truncate font-body text-[18px] font-bold leading-[22.5px] text-[#1c1c1c]",
                    isCompleted && "text-[#6b7280] line-through",
                  )}
                >
                  {course.course.title}
                </p>
                {metaLine && (
                  <div className="flex items-center gap-2">
                    {levelLabel && (
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                        {levelLabel}
                      </span>
                    )}
                    {levelLabel && hrs && (
                      <span className="size-1 rounded-full bg-[#e5e7eb]" />
                    )}
                    {hrs && (
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                        {hrs}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={onDelete}
              className="shrink-0 p-2 text-[#9ca3af] hover:text-red-500"
              aria-label="Hapus kursus"
            >
              <TrashIcon />
            </button>
          </div>
        )}

        {/* Expanded body */}
        {expanded && (
          <div className="px-[21px] pb-[21px]">
            <div className="border-t border-[#f3f4f6] pt-4">
              <div className="rounded border border-[#e5e7eb] bg-[#f9fafb] p-[20px] sm:p-[25px]">
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Thumbnail */}
                  {course.course.thumbnail_url ? (
                    <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded bg-[#e5e7eb] sm:w-[192px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.course.thumbnail_url}
                        alt={course.course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full shrink-0 rounded bg-[#e5e7eb] sm:w-[192px]" />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    {/* AI Insight */}
                    {course.matchReason && (
                      <div className="rounded-r border-l-4 border-gold bg-[rgba(255,206,0,0.1)] py-3 pl-4 pr-3">
                        <div className="mb-1 flex items-center gap-2">
                          <SparkleIcon />
                          <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#121212]">
                            AI Insight
                          </span>
                        </div>
                        <p className="font-body text-[13px] font-medium leading-[20px] text-[#121212]">
                          {course.matchReason}
                        </p>
                      </div>
                    )}

                    {/* Title + level badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="font-body text-[16px] font-bold leading-[24px] text-[#121212]">
                          {course.course.title}
                        </p>
                        {course.course.instructor && (
                          <p className="font-body text-[13px] font-medium leading-[18px] text-[#4b5563]">
                            Instructor: {course.course.instructor}
                          </p>
                        )}
                      </div>
                      {levelLabel && (
                        <div className="shrink-0 rounded border border-[#e5e7eb] bg-white px-2 py-1">
                          <span className="font-body text-[10px] font-bold uppercase tracking-[0.6px] text-[#6b7280]">
                            {levelLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rating + reviews + price + platform */}
                    <div className="flex flex-wrap items-center gap-3">
                      {ratingNum > 0 && (
                        <div className="flex items-center gap-1">
                          <StarIcon />
                          <span className="font-heading text-[13px] font-bold text-[#121212]">
                            {ratingNum.toFixed(1)}
                          </span>
                          {course.course.reviews_count && course.course.reviews_count > 0 && (
                            <span className="font-body text-[12px] text-[#9ca3af]">
                              ({course.course.reviews_count.toLocaleString("id-ID")})
                            </span>
                          )}
                        </div>
                      )}
                      {priceNum > 0 ? (
                        <>
                          <span className="font-body text-[12px] text-[#d1d5db]">|</span>
                          <span className="font-heading text-[13px] font-bold text-[#121212]">
                            {course.course.currency === "IDR"
                              ? `IDR ${priceNum.toLocaleString("id-ID")}`
                              : `$${priceNum.toFixed(2)}`}
                          </span>
                        </>
                      ) : course.course.price === "0" || course.course.price === "0.00" ? (
                        <>
                          <span className="font-body text-[12px] text-[#d1d5db]">|</span>
                          <span className="font-heading text-[13px] font-bold text-green-600">
                            Gratis
                          </span>
                        </>
                      ) : null}
                      {course.course.platform?.name && (
                        <>
                          <span className="font-body text-[12px] text-[#d1d5db]">|</span>
                          <span className="rounded border border-[#e5e7eb] bg-white px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
                            {course.course.platform.name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    {course.course.description && (
                      <p className="line-clamp-3 font-body text-[13px] leading-[20px] text-[#4b5563]">
                        {course.course.description}
                      </p>
                    )}

                    {/* What You'll Learn */}
                    {whatYouLearnList && whatYouLearnList.length > 0 && (
                      <div>
                        <p className="mb-1.5 font-heading text-[10px] font-extrabold uppercase tracking-[0.6px] text-[#121212]">
                          What You&apos;ll Learn
                        </p>
                        <div className="flex flex-col gap-1">
                          {whatYouLearnList.slice(0, 4).map((obj, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="mt-[3px] shrink-0 text-gold">
                                <CheckIconSm />
                              </span>
                              <span className="font-body text-[13px] text-[#4b5563]">
                                {obj}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    {(course.course.video_hours ||
                      course.course.duration ||
                      (course.course.reading_count && course.course.reading_count > 0) ||
                      (course.course.assignment_count &&
                        course.course.assignment_count > 0)) && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {course.course.video_hours && (
                          <Stat
                            icon={<PlayIcon />}
                            value={`${Math.round(parseFloat(course.course.video_hours))}h video`}
                          />
                        )}
                        {course.course.duration && (
                          <Stat icon={<CalendarIcon />} value={course.course.duration} />
                        )}
                        {course.course.reading_count && course.course.reading_count > 0 && (
                          <Stat
                            icon={<BookIcon />}
                            value={`${course.course.reading_count} readings`}
                          />
                        )}
                        {course.course.assignment_count && course.course.assignment_count > 0 && (
                          <Stat
                            icon={<TaskIcon />}
                            value={`${course.course.assignment_count} assignments`}
                          />
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {course.course.tags && course.course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {course.course.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-[#e5e7eb] bg-white px-2 py-1 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action row */}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] pt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={onReplace}
                          className="flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-3 py-2 font-body text-[12px] font-bold text-[#6b7280] transition-colors hover:border-[#9ca3af] hover:text-[#1c1c1c]"
                        >
                          <RefreshIcon /> Replace
                        </button>
                        {course.course.url && (
                          <a
                            href={course.course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-3 py-2 font-body text-[12px] font-bold text-[#6b7280] transition-colors hover:border-[#9ca3af] hover:text-[#1c1c1c]"
                          >
                            <ExternalIcon /> Buka
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={onToggleComplete}
                        className={cn(
                          "rounded border-2 border-transparent px-5 py-2.5 font-body text-[13px] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors",
                          isCompleted
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gold text-[#121212] hover:bg-dark hover:text-gold",
                        )}
                      >
                        {isCompleted ? "✓ Selesai" : "Selesai dipelajari"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="font-body text-[12px] font-bold text-[#6b7280]">{value}</span>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DragDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="7" cy="5" r="1.5" fill="#9ca3af" />
      <circle cx="13" cy="5" r="1.5" fill="#9ca3af" />
      <circle cx="7" cy="10" r="1.5" fill="#9ca3af" />
      <circle cx="13" cy="10" r="1.5" fill="#9ca3af" />
      <circle cx="7" cy="15" r="1.5" fill="#9ca3af" />
      <circle cx="13" cy="15" r="1.5" fill="#9ca3af" />
    </svg>
  );
}

function DragDotsSmIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
      <circle cx="3" cy="3" r="1.5" fill="#9ca3af" />
      <circle cx="7" cy="3" r="1.5" fill="#9ca3af" />
      <circle cx="3" cy="8" r="1.5" fill="#9ca3af" />
      <circle cx="7" cy="8" r="1.5" fill="#9ca3af" />
      <circle cx="3" cy="13" r="1.5" fill="#9ca3af" />
      <circle cx="7" cy="13" r="1.5" fill="#9ca3af" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1c"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckIconSm() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#121212"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#f59e0b"
      stroke="#f59e0b"
      strokeWidth="0.5"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="#6b7280" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
