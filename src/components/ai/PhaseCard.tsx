"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import type { LearningPathPhase, LearningPathCourse } from "@/types/rag";

interface PhaseCardProps {
  phase: LearningPathPhase;
  courses: LearningPathCourse[];
  isLast?: boolean;
}

function MatchReasonPill({ reason }: { reason: string }) {
  return (
    <span className="inline-block rounded bg-gold-light/50 px-2 py-0.5 text-[10px] italic text-[#4b5563]">
      {reason}
    </span>
  );
}

function SkillProgressBar({ coverage }: { coverage: number }) {
  const pct = Math.round(coverage * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[#6b7280]">
        <span className="font-bold uppercase tracking-wide">Skill Coverage</span>
        <span className="font-bold text-[#1c1c1c]">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PhaseCard({ phase, courses, isLast = false }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded border border-[#e5e7eb] bg-white shadow-sm">
      {/* Phase header */}
      <div className="border-b border-[#e5e7eb] bg-[#fafafa] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-full font-heading text-sm font-extrabold",
              isLast ? "bg-[#1c1c1c] text-gold" : "bg-gold text-[#121212]",
            )}>
              {phase.phase_number}
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#1c1c1c]">
                {phase.phase_name}
              </h3>
              <p className="font-body text-xs text-[#6b7280]">
                ~{phase.duration_weeks} weeks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded p-2 text-[#9ca3af] transition-colors hover:bg-gray-100"
            aria-label={expanded ? "Collapse phase" : "Expand phase"}
          >
            <ChevronIcon className={cn("size-5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-4">
          {/* Phase reason */}
          {phase.phase_reason && (
            <div className="mb-4 rounded border-l-4 border-gold bg-gold-light/30 px-4 py-3">
              <div className="mb-1 flex items-center gap-2">
                <LightbulbIcon />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121212]">
                  Why this phase exists
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#121212]">
                {phase.phase_reason}
              </p>
            </div>
          )}

          {/* Courses */}
          {phase.courses.length > 0 && (
            <div className="mb-4 space-y-3">
              <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
                Courses ({phase.courses.length})
              </h4>
              {phase.courses.map((pc, i) => {
                const lpCourse = courses.find(
                  (lc) => lc.course.id === pc.course_id,
                );
                return (
                  <div key={pc.course_id} className="flex items-start gap-4 rounded border border-[#f3f4f6] bg-[#fafafa] p-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5e7eb] font-heading text-xs font-bold text-[#6b7280]">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-bold text-[#1c1c1c]">
                        {pc.title}
                      </p>
                      {pc.match_reason && (
                        <div className="mt-1">
                          <MatchReasonPill reason={pc.match_reason} />
                        </div>
                      )}
                      {lpCourse?.course && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
                          <span className="flex items-center gap-1">
                            <StarIcon />
                            {lpCourse.course.rating}
                          </span>
                          <span>{lpCourse.course.level}</span>
                          {lpCourse.course.video_hours && (
                            <span className="flex items-center gap-1">
                              <ClockIcon />
                              {parseFloat(lpCourse.course.video_hours).toFixed(0)}h
                            </span>
                          )}
                          {lpCourse.course.price && parseFloat(lpCourse.course.price) > 0 && (
                            <span className="font-bold text-[#1c1c1c]">
                              {lpCourse.course.currency === "IDR"
                                ? `IDR ${parseFloat(lpCourse.course.price).toLocaleString("id-ID")}`
                                : `${lpCourse.course.currency} ${lpCourse.course.price}`}
                            </span>
                          )}
                          {lpCourse.course.url && (
                            <a
                              href={lpCourse.course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto flex items-center gap-1 font-bold text-[#0c335a] hover:underline"
                            >
                              <ExternalLinkIcon />
                              Buka
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Milestones */}
          {phase.milestones.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 font-heading text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
                Milestones
              </h4>
              <ul className="space-y-1">
                {phase.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Projects */}
          {phase.practice_projects.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 font-heading text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
                Practice Projects
              </h4>
              <ul className="space-y-1">
                {phase.practice_projects.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#e5e7eb]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skill progress */}
          {phase.skill_progress.skills_gained.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {phase.skill_progress.skills_gained.map((skill) => (
                  <span key={skill} className="inline-block rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-bold text-[#4b5563]">
                    {skill}
                  </span>
                ))}
              </div>
              <SkillProgressBar coverage={phase.skill_progress.skill_coverage} />
            </div>
          )}

          {/* Transition to next phase */}
          {phase.transition_to_next && (
            <div className="rounded border border-[#d1d5db] bg-[#f9fafb] px-4 py-3">
              <div className="mb-1 flex items-center gap-2">
                <ArrowRightIcon />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Transition to next phase
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#4b5563]">
                {phase.transition_to_next}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────��─────────────────────────────────────────────────────

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="none" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}