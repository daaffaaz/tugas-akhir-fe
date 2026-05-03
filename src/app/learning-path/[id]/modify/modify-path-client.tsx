"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRagLearningPath, toggleCourseComplete } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { RagLearningPathResponse, LearningPathPhase, LearningPathCourse } from "@/types/rag";
import { ReplaceCourseModal } from "@/components/learning-path/ReplaceCourseModal";
import { RegeneratePathModal } from "@/components/learning-path/RegeneratePathModal";
import { AddCourseToPathModal } from "@/components/learning-path/AddCourseToPathModal";
import { Tooltip } from "@/components/ui/Tooltip";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

type Props = {
  pathId: string;
};

export function ModifyPathClient({ pathId }: Props) {
  const router = useRouter();
  const [path, setPath] = useState<RagLearningPathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [replaceModal, setReplaceModal] = useState<{
    open: boolean;
    courseId: string;
    courseTitle: string;
  }>({ open: false, courseId: "", courseTitle: "" });
  const [regenerateModal, setRegenerateModal] = useState(false);
  const [addCourseModal, setAddCourseModal] = useState(false);

  async function loadPath() {
    setLoading(true);
    setError(null);
    try {
      const res = await getRagLearningPath(pathId);
      setPath(res);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        window.location.href = "/questionnaire";
        return;
      }
      setError(err instanceof Error ? err.message : "Gagal memuat learning path.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPath();
  }, [pathId]);

  async function handleToggleComplete(courseId: string) {
    try {
      const res = await toggleCourseComplete(courseId);
      // Update local state
      setPath((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          courses: prev.courses.map((c) =>
            c.id === courseId
              ? { ...c, is_completed: res.is_completed }
              : c,
          ),
        };
      });
    } catch {
      // Silently fail
    }
  }

  async function handleDeleteCourse(courseId: string) {
    setPath((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        courses: prev.courses.filter((c) => c.id !== courseId),
      };
    });
    // Refresh to get updated positions
    await loadPath();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfdfd]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-gold" />
          <p className="font-body text-sm text-[#9ca3af]">Memuat learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfdfd]">
        <p className="mb-4 font-body text-sm text-red-500">{error ?? "Path tidak ditemukan."}</p>
        <Link href="/learning-path" className={primaryGoldCtaClass("rounded-lg px-6 py-3 font-heading text-sm font-bold")}>
          &larr; Kembali ke Learning Path
        </Link>
      </div>
    );
  }

  const phases = path.questionnaire_snapshot?.phases ?? [];
  const isEmpty = phases.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-10 md:px-8">
        {/* Back nav */}
        <nav className="mb-6">
          <Link
            href="/learning-path"
            className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-[#9ca3af] hover:text-dark"
          >
            <span aria-hidden>&larr;</span> Kembali
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <MapPinIcon />
              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                AI Learning Path
              </span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-dark md:text-4xl">
              {path.questionnaire_snapshot?.roadmap_title ?? path.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 font-body text-sm text-[#6b7280]">
              {path.questionnaire_snapshot?.total_duration_weeks && (
                <span className="flex items-center gap-1">
                  <ClockIcon /> ~{path.questionnaire_snapshot.total_duration_weeks} weeks
                </span>
              )}
              {path.questionnaire_snapshot?.total_hours_estimated && (
                <span className="flex items-center gap-1">
                  <PlayIcon /> ~{path.questionnaire_snapshot.total_hours_estimated}h estimated
                </span>
              )}
              {path.questionnaire_snapshot?.difficulty_curve && (
                <span className="flex items-center gap-1">
                  <ChartIcon /> {path.questionnaire_snapshot.difficulty_curve}
                </span>
              )}
              <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-xs font-bold">
                {path.courses.length} courses
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tooltip content="Regenerate seluruh path" side="top">
              <button
                type="button"
                onClick={() => setRegenerateModal(true)}
                className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 font-heading text-xs font-bold text-[#6b7280] shadow-sm hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
              >
                <RefreshIcon /> Regenerate Path
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Overview */}
        {path.questionnaire_snapshot?.overview && (
          <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-gradient-to-r from-[#fff9e6] to-white p-6">
            <p className="font-body text-sm leading-relaxed text-[#4b5563]">
              {path.questionnaire_snapshot.overview}
            </p>
            {path.questionnaire_snapshot.target_skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.questionnaire_snapshot.target_skills.map((skill) => (
                  <span key={skill} className="inline-block rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-bold text-[#4b5563]">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phases */}
        {phases.length > 0 ? (
          <div className="mb-8 space-y-6">
            {phases.map((phase, phaseIdx) => (
              <PhaseSection
                key={phase.phase_number}
                phase={phase}
                phaseIndex={phaseIdx}
                allCourses={path.courses}
                onReplace={(courseId, title) =>
                  setReplaceModal({ open: true, courseId, courseTitle: title })
                }
                onDelete={handleDeleteCourse}
                onToggleComplete={handleToggleComplete}
                isLast={phaseIdx === phases.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="mb-8 space-y-4">
            {path.courses.map((course, idx) => (
              <AICourseRow
                key={course.id}
                course={course}
                index={idx}
                onReplace={() =>
                  setReplaceModal({
                    open: true,
                    courseId: course.id,
                    courseTitle: course.course.title,
                  })
                }
                onDelete={handleDeleteCourse}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {/* Tips */}
        {path.questionnaire_snapshot?.tips_for_success?.length > 0 && (
          <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-6">
            <h3 className="mb-3 font-heading text-base font-bold text-dark">Tips for Success</h3>
            <ul className="space-y-2">
              {path.questionnaire_snapshot.tips_for_success.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                  <span className="mt-1 shrink-0 text-gold">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next steps */}
        {path.questionnaire_snapshot?.next_steps_after_roadmap?.length > 0 && (
          <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-6">
            <h3 className="mb-3 font-heading text-base font-bold text-dark">Next Steps After This Roadmap</h3>
            <ul className="space-y-2">
              {path.questionnaire_snapshot.next_steps_after_roadmap.map((step, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                  <ArrowIcon />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Course CTA */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAddCourseModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e5e7eb] bg-white py-5 font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#6b7280] hover:border-gold hover:text-[#1c1c1c] sm:w-auto sm:px-8"
          >
            <PlusIcon />
            Tambah Kursus
          </button>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRegenerateModal(true)}
            className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-5 py-3 font-heading text-sm font-bold text-[#6b7280] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
          >
            <RefreshIcon /> Regenerate Path
          </button>
          <button
            type="button"
            onClick={() => router.push("/learning-path")}
            className={primaryGoldCtaClass("flex items-center gap-2 rounded-xl px-5 py-3 font-heading text-sm font-bold")}
          >
            <SaveIcon /> Simpan & Selesai
          </button>
        </div>
      </div>

      <footer className="mt-auto border-t border-[rgba(209,209,209,0.35)] bg-[#fdfdfd]">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-8 py-12 text-[11px] font-bold uppercase tracking-wide text-[#4a4a4a] md:flex-row md:items-center">
          <p>© 2024 PersonaLearn. All rights reserved.</p>
          <div className="flex flex-wrap gap-8">
            <span className="cursor-pointer hover:text-dark">Legal</span>
            <span className="cursor-pointer hover:text-dark">Support</span>
            <span className="cursor-pointer hover:text-dark">Privacy policy</span>
            <span className="cursor-pointer hover:text-dark">Terms of service</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {replaceModal.open && (
        <ReplaceCourseModal
          open={replaceModal.open}
          onClose={() => setReplaceModal((m) => ({ ...m, open: false }))}
          pathId={pathId}
          courseId={replaceModal.courseId}
          courseTitle={replaceModal.courseTitle}
          onReplaced={loadPath}
          onDeleted={() => {
            handleDeleteCourse(replaceModal.courseId);
            setReplaceModal((m) => ({ ...m, open: false }));
          }}
        />
      )}

      {regenerateModal && (
        <RegeneratePathModal
          open={regenerateModal}
          onClose={() => setRegenerateModal(false)}
          pathId={pathId}
          title={path.questionnaire_snapshot?.roadmap_title ?? path.title}
          onRegenerated={loadPath}
        />
      )}

      {addCourseModal && (
        <AddCourseToPathModal
          open={addCourseModal}
          onClose={() => setAddCourseModal(false)}
          pathId={pathId}
          onAdded={loadPath}
        />
      )}
    </div>
  );
}

// ─── Phase Section ──────────────────────────────────────────────────────────

function PhaseSection({
  phase,
  phaseIndex,
  allCourses,
  onReplace,
  onDelete,
  onToggleComplete,
  isLast,
}: {
  phase: LearningPathPhase;
  phaseIndex: number;
  allCourses: LearningPathCourse[];
  onReplace: (courseId: string, title: string) => void;
  onDelete: (courseId: string) => void;
  onToggleComplete: (courseId: string) => void;
  isLast: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      {/* Phase header */}
      <div className="flex items-center gap-4 border-b border-[#e5e7eb] bg-[#fafafa] px-6 py-4">
        <div className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-extrabold",
          isLast ? "bg-[#1c1c1c] text-gold" : "bg-gold text-[#121212]",
        )}>
          {phase.phase_number}
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-base font-bold text-dark">
            {phase.phase_name}
          </h2>
          <p className="font-body text-xs text-[#6b7280]">
            ~{phase.duration_weeks} weeks
          </p>
        </div>
        <span className="shrink-0 rounded bg-[#f3f4f6] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6b7280]">
          {phase.courses.length} courses
        </span>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* Phase reason */}
        {phase.phase_reason && (
          <div className="mb-4 rounded border-l-4 border-gold bg-gold-light/30 px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <LightbulbIcon />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121212]">Why this phase</span>
            </div>
            <p className="text-sm leading-relaxed text-[#121212]">{phase.phase_reason}</p>
          </div>
        )}

        {/* Courses from phase */}
        <div className="space-y-3">
          {phase.courses.map((pc, i) => {
            const lpCourse = allCourses.find((c) => c.course.id === pc.course_id);
            return (
              <AICourseRow
                key={pc.course_id}
                course={
                  lpCourse ?? {
                    id: pc.course_id,
                    course: {
                      id: pc.course_id,
                      title: pc.title,
                      instructor: "",
                      rating: "0",
                      level: "",
                      video_hours: "",
                      price: "",
                      currency: "IDR",
                      url: "",
                      thumbnail_url: "",
                    },
                    position: i,
                    is_completed: false,
                    completed_at: null,
                    is_manually_added: false,
                  }
                }
                index={i}
                matchReason={pc.match_reason}
                onReplace={() => onReplace(pc.course_id, pc.title)}
                onDelete={() => onDelete(pc.course_id)}
                onToggleComplete={() => onToggleComplete(pc.course_id)}
              />
            );
          })}
        </div>

        {/* Milestones */}
        {phase.milestones.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#6b7280]">Milestones</p>
            <ul className="space-y-1">
              {phase.milestones.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#4b5563]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transition to next */}
        {phase.transition_to_next && (
          <div className="mt-4 rounded border border-[#d1d5db] bg-[#f9fafb] px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5">
              <ArrowIcon />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b7280]">Transition</span>
            </div>
            <p className="text-sm leading-relaxed text-[#4b5563]">{phase.transition_to_next}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Course Row ─────────────────────────────────────────────────────────

function AICourseRow({
  course,
  index,
  matchReason,
  onReplace,
  onDelete,
  onToggleComplete,
}: {
  course: LearningPathCourse;
  index: number;
  matchReason?: string;
  onReplace: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompleted = course.is_completed;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      {/* Index */}
      <div className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold",
        isCompleted ? "bg-green-500 text-white" : "bg-[#e5e7eb] text-[#6b7280]",
      )}>
        {isCompleted ? (
          <CheckIcon />
        ) : (
          String(index + 1).padStart(2, "0")
        )}
      </div>

      {/* Course info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-sm font-bold text-dark">{course.course.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
          {course.course.instructor && <span>{course.course.instructor}</span>}
          {course.course.rating && parseFloat(course.course.rating) > 0 && (
            <span>⭐ {parseFloat(course.course.rating).toFixed(1)}</span>
          )}
          {course.course.level && <span>{course.course.level}</span>}
          {course.course.video_hours && (
            <span>{parseFloat(course.course.video_hours).toFixed(0)}h</span>
          )}
          {course.course.price && parseFloat(course.course.price) > 0 && (
            <span className="font-bold text-[#1c1c1c]">
              {course.course.currency === "IDR"
                ? `IDR ${parseFloat(course.course.price).toLocaleString("id-ID")}`
                : `${course.course.currency} ${course.course.price}`}
            </span>
          )}
        </div>
        {matchReason && (
          <p className="mt-1.5 rounded bg-gold-light/50 px-2.5 py-1 text-xs italic text-[#4b5563]">
            💡 {matchReason}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Detail link */}
        <Tooltip content="Detail Kursus" side="top">
          <Link
            href={`/course-catalog/${course.course.id}`}
            className="flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#9ca3af] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
          >
            <InfoIcon />
          </Link>
        </Tooltip>

        {/* Toggle complete */}
        <Tooltip content={isCompleted ? "Undo Complete" : "Mark Complete"} side="top">
          <button
            type="button"
            onClick={onToggleComplete}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg border text-sm transition-colors",
              isCompleted
                ? "border-green-300 bg-green-50 text-green-600 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                : "border-[#e5e7eb] text-[#9ca3af] hover:border-green-300 hover:bg-green-50 hover:text-green-600",
            )}
          >
            {isCompleted ? <CheckIcon /> : <CheckIcon />}
          </button>
        </Tooltip>

        {/* Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#9ca3af] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
          >
            <MenuIcon />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => { onReplace(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-body text-sm text-[#4b5563] hover:bg-[#f9fafb]"
                >
                  <RefreshSmallIcon /> Replace
                </button>
                <button
                  type="button"
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-body text-sm text-red-500 hover:bg-red-50"
                >
                  <TrashSmallIcon /> Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App Bar ────────────────────────────────────────────────────────────────

function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f0f0] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4 px-6">
        <Link href="/" className="font-heading text-xl font-extrabold tracking-tight text-dark">
          PersonaLearn
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/learning-path" className="font-heading text-sm font-semibold text-dark">
            Learning Path
          </Link>
          <Link href="/course-catalog" className="font-heading text-sm font-semibold text-[#4a4a4a] hover:text-dark">
            Courses
          </Link>
          <Link href="/ai/course-recommendation" className="font-heading text-sm font-semibold text-[#4a4a4a] hover:text-dark">
            AI Recommendations
          </Link>
        </nav>
        <Link href="/profile" className="rounded-full bg-[#f0f0f0] px-3 py-1.5 font-body text-xs font-bold text-[#4a4a4a] hover:bg-[#e0e0e0]">
          Profile
        </Link>
      </div>
    </header>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────

function AppBarIcon() { return null; }

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
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

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function RefreshSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TrashSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}