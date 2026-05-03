"use client";

import { useState } from "react";
import type { LearningPathPhase, LearningPathCourse } from "@/types/rag";
import { cn } from "@/lib/utils";

type Props = {
  phase: LearningPathPhase;
  courses: LearningPathCourse[];
  isLast: boolean;
  onReplace?: (courseId: string, courseTitle: string) => void;
  onRemove?: (courseId: string) => void;
};

export function PhaseCard({ phase, courses, isLast, onReplace, onRemove }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      {/* Phase Header */}
      <div className="border-l-4 border-gold bg-gradient-to-r from-[#fff9e6] to-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-gold px-2.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-dark">
                Phase {phase.phase_number}
              </span>
              <span className="rounded bg-[#f3f4f6] px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
                ~{phase.duration_weeks} weeks
              </span>
              {phase.courses.length > 0 && (
                <span className="rounded bg-[#1c1c1c] px-2.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-white">
                  {phase.courses.length} courses
                </span>
              )}
            </div>
            <h3 className="font-heading text-xl font-extrabold text-dark">
              {phase.phase_name}
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {phase.skill_progress && (
              <div className="text-right">
                <p className="font-heading text-[10px] font-bold text-[#6b7280]">
                  Skill coverage
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${Math.round(phase.skill_progress.skill_coverage * 100)}%` }}
                    />
                  </div>
                  <p className="font-heading text-sm font-extrabold text-gold">
                    {Math.round(phase.skill_progress.skill_coverage * 100)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="p-6">
        {/* Why this phase exists */}
        <div className="mb-6">
          <h4 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-dark">
            <span className="text-base">💡</span> Mengapa phase ini ada
          </h4>
          <p className="font-body text-sm leading-relaxed text-[#4b5563]">
            {phase.phase_reason}
          </p>
        </div>

        {/* Courses */}
        {phase.courses.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 font-heading text-sm font-bold text-dark">
              📚 Courses ({phase.courses.length})
            </h4>
            <div className="space-y-3">
              {phase.courses.map((phaseCourse, i) => {
                const course = courses.find(
                  (c) => c.course.id === phaseCourse.course_id,
                );
                if (!course) return null;

                return (
                  <PhaseCourseTile
                    key={phaseCourse.course_id}
                    index={i + 1}
                    phaseCourse={phaseCourse}
                    course={course}
                    onReplace={
                      onReplace
                        ? () => onReplace(course.course.id, phaseCourse.title)
                        : undefined
                    }
                    onRemove={
                      onRemove ? () => onRemove(course.course.id) : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {phase.learning_objectives &&
          phase.learning_objectives.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-dark">
                <span className="text-base">🎯</span> Learning Objectives
              </h4>
              <ul className="space-y-1">
                {phase.learning_objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-body text-sm text-[#4b5563]"
                  >
                    <span className="mt-1 shrink-0 text-gold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Milestones */}
        {phase.milestones && phase.milestones.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-dark">
              <span className="text-base">🏆</span> Milestones
            </h4>
            <div className="flex flex-wrap gap-2">
              {phase.milestones.map((milestone, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 font-body text-xs font-bold text-dark"
                >
                  <span className="text-gold">✓</span>
                  {milestone}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Practice Projects */}
        {phase.practice_projects && phase.practice_projects.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-dark">
              <span className="text-base">🔧</span> Practice Projects
            </h4>
            <ul className="space-y-1">
              {phase.practice_projects.map((project, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-body text-sm text-[#4b5563]"
                >
                  <span className="mt-1 shrink-0 text-gold">•</span>
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Gained */}
        {phase.skill_progress && phase.skill_progress.skills_gained.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-dark">
              <span className="text-base">📈</span> Skills gained
            </h4>
            <div className="flex flex-wrap gap-2">
              {phase.skill_progress.skills_gained.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 font-body text-xs font-bold text-[#4b5563]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transition to next phase */}
        {!isLast && phase.transition_to_next && (
          <div className="rounded-lg border-l-4 border-gold bg-[#f9fafb] p-4">
            <h4 className="mb-2 flex items-center gap-2 font-heading text-xs font-extrabold uppercase tracking-widest text-[#6b7280]">
              <span className="text-base">🔄</span> Transition ke phase selanjutnya
            </h4>
            <p className="font-body text-sm leading-relaxed text-[#4b5563]">
              {phase.transition_to_next}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Phase Course Tile ────────────────────────────────────────────────────────

interface PhaseCourseTileProps {
  index: number;
  phaseCourse: { course_id: string; title: string; match_reason: string };
  course: LearningPathCourse;
  onReplace?: () => void;
  onRemove?: () => void;
}

function PhaseCourseTile({ index, phaseCourse, course, onReplace, onRemove }: PhaseCourseTileProps) {
  const [expanded, setExpanded] = useState(false);

  const levelLabel = course.course.level?.toUpperCase() ?? "";
  const hrs = course.course.video_hours
    ? `${Math.round(parseFloat(course.course.video_hours))}h`
    : "";

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      {/* Tile header */}
      <div
        className="flex cursor-pointer items-center justify-between gap-3 p-4 hover:bg-[#fafafa]"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start gap-3">
          {/* Completion indicator */}
          <div
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold",
              course.is_completed
                ? "border-gold bg-gold text-[#1c1c1c]"
                : "border-[#d1d5db] bg-white text-transparent",
            )}
          >
            {course.is_completed && <CheckIcon size={10} />}
          </div>

          {/* Index + Title + meta */}
          <div className="min-w-0 flex-1">
            <p className="font-body text-sm font-bold text-dark">
              {index}. {phaseCourse.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#6b7280]">
              {levelLabel && (
                <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5 font-bold uppercase">
                  {levelLabel}
                </span>
              )}
              {hrs && <span>⏱ {hrs} video</span>}
              {course.course.rating && parseFloat(course.course.rating) > 0 && (
                <span>⭐ {parseFloat(course.course.rating).toFixed(1)}</span>
              )}
              {parseFloat(course.course.price) === 0 ? (
                <span>💰 Gratis</span>
              ) : (
                <span>
                  💰 {course.course.currency}{" "}
                  {parseFloat(course.course.price).toLocaleString("id-ID")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: actions + chevron */}
        <div className="flex items-center gap-2">
          {/* Inline action buttons */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {onReplace && (
              <button
                type="button"
                onClick={onReplace}
                className="flex items-center gap-1 rounded border border-[#e5e7eb] bg-white px-2 py-1 font-body text-[10px] font-bold text-[#6b7280] transition-colors hover:border-[#9ca3af] hover:text-[#1c1c1c]"
              >
                <RefreshIcon />
                Replace
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 rounded border border-red-200 bg-white px-2 py-1 font-body text-[10px] font-bold text-red-400 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-500"
              >
                <TrashIcon />
                Remove
              </button>
            )}
          </div>

          {/* Expand chevron */}
          <span
            className={cn(
              "shrink-0 text-[#9ca3af] transition-transform",
              expanded && "rotate-180",
            )}
          >
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {/* Expanded: AI explanation + details */}
      {expanded && (
        <div className="border-t border-[#f0f0f0] px-4 pb-4 pt-3">
          {/* AI Insight badge */}
          <div className="mb-3 rounded border-l-4 border-gold bg-gold-light/20 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5">
              <SparkleIcon />
              <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-dark">
                AI Insight
              </span>
              <span className="ml-auto font-heading text-[10px] font-bold text-[#9ca3af]">
                match reason
              </span>
            </div>
            <p className="font-body text-xs leading-relaxed text-[#374151]">
              {phaseCourse.match_reason}
            </p>
          </div>

          {/* Additional course info */}
          {course.course.instructor && (
            <p className="font-body text-xs text-[#6b7280]">
              Instructor: <span className="font-bold text-[#4b5563]">{course.course.instructor}</span>
            </p>
          )}
          {course.course.url && (
            <a
              href={course.course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-body text-xs text-blue-600 hover:underline"
            >
              🔗 Lihat di platform
              <ExternalIcon />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1c"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <circle cx="19" cy="4" r="1" fill="#0c335a" />
      <circle cx="5" cy="18" r="1" fill="#0c335a" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
