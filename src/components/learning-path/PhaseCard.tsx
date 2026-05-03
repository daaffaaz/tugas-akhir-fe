"use client";

import type { LearningPathPhase, LearningPathCourse } from "@/types/rag";

type Props = {
  phase: LearningPathPhase;
  courses: LearningPathCourse[];
  isLast: boolean;
};

export function PhaseCard({ phase, courses, isLast }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      {/* Phase Header */}
      <div className="border-l-4 border-gold bg-gradient-to-r from-[#fff9e6] to-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-gold px-2.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-wide text-dark">
                Phase {phase.phase_number}
              </span>
              <span className="rounded bg-[#f3f4f6] px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
                ~{phase.duration_weeks} weeks
              </span>
            </div>
            <h3 className="font-heading text-xl font-extrabold text-dark">
              {phase.phase_name}
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {phase.skill_progress && (
              <div className="text-right">
                <p className="font-heading text-xs font-bold text-[#6b7280]">
                  Skill coverage
                </p>
                <p className="font-heading text-lg font-extrabold text-gold">
                  {Math.round(phase.skill_progress.skill_coverage * 100)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="p-6">
        {/* Why this phase exists */}
        <div className="mb-6">
          <h4 className="mb-2 font-heading text-sm font-bold text-dark">
            💡 Mengapa phase ini ada
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
                // Find full course details by matching course_id
                const course = courses.find(
                  (c) => c.course.id === phaseCourse.course_id,
                );
                if (!course) return null;

                return (
                  <div
                    key={phaseCourse.course_id}
                    className="flex flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-body text-sm font-bold text-dark">
                          {i + 1}. {phaseCourse.title}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="rounded bg-white px-2 py-0.5 font-body text-xs font-bold text-[#6b7280]">
                            {course.course.level}
                          </span>
                          <span className="font-body text-xs text-[#6b7280]">
                            ⏱ {course.course.video_hours}h video
                          </span>
                          <span className="font-body text-xs text-[#6b7280]">
                            💰{" "}
                            {Number(course.course.price) === 0
                              ? "Free"
                              : `${course.course.price} ${course.course.currency}`}
                          </span>
                          <span className="font-body text-xs text-[#6b7280]">
                            ⭐ {course.course.rating}
                          </span>
                        </div>
                      </div>
                      {course.is_completed && (
                        <span className="shrink-0 text-gold">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs italic text-[#6b7280]">
                      {phaseCourse.match_reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {phase.learning_objectives &&
          phase.learning_objectives.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-2 font-heading text-sm font-bold text-dark">
                🎯 Learning Objectives
              </h4>
              <ul className="space-y-1">
                {phase.learning_objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-body text-sm text-[#4b5563]"
                  >
                    <span className="mt-1 text-gold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Milestones */}
        {phase.milestones && phase.milestones.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 font-heading text-sm font-bold text-dark">
              🏆 Milestones
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
            <h4 className="mb-2 font-heading text-sm font-bold text-dark">
              🔧 Practice Projects
            </h4>
            <ul className="space-y-1">
              {phase.practice_projects.map((project, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-body text-sm text-[#4b5563]"
                >
                  <span className="mt-1 text-gold">•</span>
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Gained */}
        {phase.skill_progress && phase.skill_progress.skills_gained.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 font-heading text-sm font-bold text-dark">
              📈 Skills gained
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
            <h4 className="mb-2 font-heading text-xs font-extrabold uppercase tracking-widest text-[#6b7280]">
              🔄 Transition ke phase selanjutnya
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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
