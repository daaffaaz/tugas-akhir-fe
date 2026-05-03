"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRagLearningPath, toggleCourseComplete } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { RagLearningPathResponse, LearningPathCourse } from "@/types/rag";
import { ReplaceCourseModal } from "@/components/learning-path/ReplaceCourseModal";
import { RegeneratePathModal } from "@/components/learning-path/RegeneratePathModal";
import { AddCourseToPathModal } from "@/components/learning-path/AddCourseToPathModal";
import { AppBar } from "@/components/layout/AppBar";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

type Props = { pathId: string };

interface AugmentedCourse extends LearningPathCourse {
  phaseName?: string;
  matchReason?: string;
  learningObjectives?: string[];
}

function buildCourseList(path: RagLearningPathResponse): AugmentedCourse[] {
  const phases = path.questionnaire_snapshot?.phases ?? [];
  const phaseMap = new Map<string, { phaseName: string; matchReason: string; learningObjectives: string[] }>();
  for (const phase of phases) {
    for (const pc of phase.courses) {
      phaseMap.set(pc.course_id, {
        phaseName: phase.phase_name,
        matchReason: pc.match_reason,
        learningObjectives: phase.learning_objectives,
      });
    }
  }
  return [...path.courses]
    .sort((a, b) => a.position - b.position)
    .map((course) => {
      const info = phaseMap.get(course.course.id) ?? phaseMap.get(course.id);
      return { ...course, phaseName: info?.phaseName, matchReason: info?.matchReason, learningObjectives: info?.learningObjectives };
    });
}

export function ModifyPathClient({ pathId }: Props) {
  const router = useRouter();
  const [path, setPath] = useState<RagLearningPathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const [replaceModal, setReplaceModal] = useState<{ open: boolean; courseId: string; courseTitle: string }>({
    open: false, courseId: "", courseTitle: "",
  });
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

  useEffect(() => { loadPath(); }, [pathId]);

  async function handleToggleComplete(courseId: string) {
    try {
      const res = await toggleCourseComplete(courseId);
      setPath((prev) => {
        if (!prev) return prev;
        return { ...prev, courses: prev.courses.map((c) => c.id === courseId ? { ...c, is_completed: res.is_completed } : c) };
      });
    } catch { /* silent */ }
  }

  async function handleDeleteCourse(courseId: string) {
    setPath((prev) => {
      if (!prev) return prev;
      return { ...prev, courses: prev.courses.filter((c) => c.id !== courseId) };
    });
    await loadPath();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-gold" />
          <p className="font-body text-sm text-[#9ca3af]">Memuat learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <p className="mb-4 font-body text-sm text-red-500">{error ?? "Path tidak ditemukan."}</p>
        <Link href="/learning-path" className={primaryGoldCtaClass("rounded-lg px-6 py-3 font-heading text-sm font-bold")}>
          &larr; Kembali ke Learning Path
        </Link>
      </div>
    );
  }

  const courses = buildCourseList(path);
  const title = path.questionnaire_snapshot?.roadmap_title ?? path.title;

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-dark">
      <AppBar />

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
        {/* Back nav */}
        <Link
          href="/learning-path"
          className="mb-6 inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] hover:text-dark"
        >
          <ArrowLeftIcon /> Kembali
        </Link>

        <div className="mt-6 flex items-start gap-6">
          {/* ── Left: course list ── */}
          <div className="min-w-0 flex-1">
            {/* Title row */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-dark">
                {title}
              </h1>
              <span className="shrink-0 rounded bg-[#1c1c1c] px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-widest text-white">
                {courses.length} Courses
              </span>
            </div>

            {/* Course rows */}
            <div className="space-y-3">
              {courses.map((course, idx) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  index={idx}
                  expanded={expandedIdx === idx}
                  onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  onDelete={() => handleDeleteCourse(course.id)}
                  onToggleComplete={() => handleToggleComplete(course.id)}
                  onReplace={() => setReplaceModal({ open: true, courseId: course.id, courseTitle: course.course.title })}
                />
              ))}
            </div>

            {/* Add course */}
            <button
              type="button"
              onClick={() => setAddCourseModal(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-4 font-heading text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] transition-colors hover:border-[#1c1c1c] hover:text-dark"
            >
              <PlusIcon /> Tambah Kursus
            </button>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="w-[260px] shrink-0 space-y-3">
            {/* Manajemen Path */}
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                Manajemen Path
              </p>
              <button
                type="button"
                onClick={() => router.push("/learning-path")}
                className={primaryGoldCtaClass("flex w-full items-center justify-center gap-2 rounded-lg py-3 font-heading text-sm font-bold")}
              >
                <SaveIcon /> Simpan Perubahan
              </button>
            </div>

            {/* Catatan */}
            <div className="rounded-xl border border-[#f0e6a0] bg-[#fffdf0] p-5">
              <div className="mb-2 flex items-center gap-2">
                <InfoCircleIcon />
                <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                  Catatan
                </p>
              </div>
              <p className="font-body text-xs leading-relaxed text-[#4b5563]">
                Modul dapat diubah urutan dengan menarik indikator di sebelah kiri. Semua perubahan akan disimpan sebagai draf sebelum path disave.
              </p>
            </div>

            {/* Regenerate */}
            <button
              type="button"
              onClick={() => setRegenerateModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 font-heading text-[11px] font-bold uppercase tracking-widest text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-dark"
            >
              <RefreshIcon /> Regenerate Path
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-8 text-[11px] font-bold uppercase tracking-wide text-[#9ca3af] md:flex-row">
          <p>© 2024 PersonaLearn IT. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-dark">Legal</span>
            <span className="cursor-pointer hover:text-dark">Support</span>
            <span className="cursor-pointer hover:text-dark">Privacy Policy</span>
            <span className="cursor-pointer hover:text-dark">Terms of Service</span>
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
          onDeleted={() => { handleDeleteCourse(replaceModal.courseId); setReplaceModal((m) => ({ ...m, open: false })); }}
        />
      )}
      {regenerateModal && (
        <RegeneratePathModal
          open={regenerateModal}
          onClose={() => setRegenerateModal(false)}
          pathId={pathId}
          title={title}
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

// ─── Course Row ──────────────────────────────────────────────────────────────

function CourseRow({
  course,
  index,
  expanded,
  onToggle,
  onDelete,
  onToggleComplete,
  onReplace,
}: {
  course: AugmentedCourse;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onReplace: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");
  const isCompleted = course.is_completed;
  const levelLabel = (course.phaseName ?? course.course.level ?? "").toUpperCase();
  const hrs = course.course.video_hours ? `${Math.round(parseFloat(course.course.video_hours))}H` : "";
  const metaLine = [levelLabel, hrs].filter(Boolean).join(" · ");

  return (
    <div className="flex items-stretch">
      {/* Number badge */}
      <div
        className={cn(
          "flex w-10 shrink-0 items-center justify-center rounded-l-xl font-heading text-sm font-extrabold",
          isCompleted ? "bg-green-500 text-white" : "bg-gold text-[#121212]",
        )}
      >
        {isCompleted ? <CheckSmallIcon /> : num}
      </div>

      {/* Card */}
      <div className="flex-1 overflow-hidden rounded-r-xl border border-l-0 border-[#e5e7eb] bg-white">
        {/* Row header */}
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          <DragIcon />
          {/* Checkbox */}
          <span
            role="presentation"
            onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
            className={cn(
              "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors",
              isCompleted ? "border-green-500 bg-green-500" : "border-[#d1d5db] hover:border-gold",
            )}
          >
            {isCompleted && <CheckSmallIcon />}
          </span>
          {/* Title + meta */}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-heading text-sm font-bold text-dark">{course.course.title}</span>
            {metaLine && (
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{metaLine}</span>
            )}
          </span>
          {/* Chevron */}
          <ChevronIcon className={cn("shrink-0 text-[#9ca3af] transition-transform duration-200", expanded && "rotate-180")} />
          {/* Trash */}
          <span
            role="button"
            tabIndex={0}
            aria-label="Hapus kursus"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onDelete(); } }}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-[#d1d5db] hover:text-red-500"
          >
            <TrashIcon />
          </span>
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="border-t border-[#e5e7eb] p-4">
            <div className="flex gap-4 rounded-xl border border-[#e5e7eb] p-4 shadow-sm">
              {/* Thumbnail */}
              {course.course.thumbnail_url && (
                <div className="w-[160px] shrink-0 overflow-hidden rounded-lg bg-[#f3f4f6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.course.thumbnail_url}
                    alt={course.course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {/* AI Insight */}
                {course.matchReason && (
                  <div className="rounded-lg border border-[#f0e08a]/50 bg-[#fef9e4] p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <SparkleIcon />
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-[#8a6a00]">AI Insight</span>
                    </div>
                    <p className="font-body text-xs leading-relaxed text-[#4b5563]">{course.matchReason}</p>
                  </div>
                )}

                {/* Title + level */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-base font-bold leading-snug text-dark">{course.course.title}</h3>
                  {levelLabel && (
                    <span className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">
                      {levelLabel}
                    </span>
                  )}
                </div>

                {/* Instructor */}
                {course.course.instructor && (
                  <p className="font-body text-xs text-[#6b7280]">Instructor: {course.course.instructor}</p>
                )}

                {/* Rating + price */}
                <div className="flex flex-wrap items-center gap-3">
                  {course.course.rating && parseFloat(course.course.rating) > 0 && (
                    <span className="flex items-center gap-1 font-body text-xs font-bold text-[#4b5563]">
                      <StarIcon /> {parseFloat(course.course.rating).toFixed(1)}
                    </span>
                  )}
                  {course.course.price && parseFloat(course.course.price) > 0 && (
                    <span className="font-body text-xs font-bold text-[#1c1c1c]">
                      {course.course.currency === "IDR"
                        ? `IDR ${parseFloat(course.course.price).toLocaleString("id-ID")}`
                        : `$${parseFloat(course.course.price).toFixed(2)}`}
                    </span>
                  )}
                </div>

                {/* What you'll learn */}
                {course.learningObjectives && course.learningObjectives.length > 0 && (
                  <div>
                    <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                      What You&apos;ll Learn:
                    </p>
                    <ul className="space-y-0.5">
                      {course.learningObjectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="font-body text-xs text-[#4b5563]">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stats */}
                {course.course.video_hours && (
                  <div className="flex flex-wrap gap-4 text-xs text-[#6b7280]">
                    <span className="flex items-center gap-1"><ClockIcon /> {Math.round(parseFloat(course.course.video_hours))}h total</span>
                    <span className="flex items-center gap-1"><PlayIcon /> {Math.round(parseFloat(course.course.video_hours))}h video</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={onReplace}
                    className="flex items-center gap-1.5 rounded border border-[#e5e7eb] px-3 py-1.5 font-heading text-xs font-bold text-[#6b7280] hover:border-[#1c1c1c] hover:text-dark"
                  >
                    <RefreshSmIcon /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={onToggleComplete}
                    className={cn(
                      "rounded-lg px-4 py-2 font-heading text-xs font-bold transition-colors",
                      isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : primaryGoldCtaClass(),
                    )}
                  >
                    {isCompleted ? "✓ Selesai" : "Selesai dipelajari"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function DragIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="6" r="1.5" fill="#d1d5db" />
      <circle cx="15" cy="6" r="1.5" fill="#d1d5db" />
      <circle cx="9" cy="12" r="1.5" fill="#d1d5db" />
      <circle cx="15" cy="12" r="1.5" fill="#d1d5db" />
      <circle cx="9" cy="18" r="1.5" fill="#d1d5db" />
      <circle cx="15" cy="18" r="1.5" fill="#d1d5db" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a6a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function RefreshSmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
