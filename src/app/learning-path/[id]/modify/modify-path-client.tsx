"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CSS } from "@dnd-kit/utilities";
import { getRagLearningPath, toggleCourseComplete, reorderPathCourses, deleteCourseFromPath } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { RagLearningPathResponse, LearningPathCourse } from "@/types/rag";
import { ReplaceCourseModal } from "@/components/learning-path/ReplaceCourseModal";
import { PhaseCard } from "@/components/learning-path/PhaseCard";
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
  const [courses, setCourses] = useState<AugmentedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [replaceModal, setReplaceModal] = useState<{ open: boolean; courseId: string; courseTitle: string }>({
    open: false, courseId: "", courseTitle: "",
  });
  const [regenerateModal, setRegenerateModal] = useState(false);
  const [addCourseModal, setAddCourseModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const loadPath = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRagLearningPath(pathId);
      setPath(res);
      const list = buildCourseList(res);
      setCourses(list);
      setExpandedId((prev) => prev ?? list[0]?.id ?? null);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        window.location.href = "/questionnaire";
        return;
      }
      setError(err instanceof Error ? err.message : "Gagal memuat learning path.");
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => { loadPath(); }, [loadPath]);

  async function handleToggleComplete(courseId: string) {
    try {
      const res = await toggleCourseComplete(courseId);
      setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, is_completed: res.is_completed } : c));
    } catch { /* silent */ }
  }

  async function handleDeleteCourse(courseId: string) {
    try {
      await deleteCourseFromPath(pathId, courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch {
      await loadPath();
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCourses((prev) => {
      const oldIdx = prev.findIndex((c) => c.id === active.id);
      const newIdx = prev.findIndex((c) => c.id === over.id);
      const next = arrayMove(prev, oldIdx, newIdx);
      reorderPathCourses(pathId, next.map((c: AugmentedCourse) => c.id)).catch(() => {/* silent */});
      return next;
    });
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
        <Link href="/learning-path" className={primaryGoldCtaClass("rounded px-6 py-3 font-heading text-sm font-bold")}>
          &larr; Kembali ke Learning Path
        </Link>
      </div>
    );
  }

  const title = path.questionnaire_snapshot?.roadmap_title ?? path.title;
  const phases = path.questionnaire_snapshot?.phases ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body">
      <AppBar />

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-10">
        {/* Breadcrumb */}
        <Link
          href="/learning-path"
          className="inline-flex items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[1.2px] text-[#9ca3af] hover:text-[#1c1c1c]"
        >
          <ArrowLeftIcon /> Kembali
        </Link>

        {/* 12-col grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* ── Left: course list (8 cols) ── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            {/* Title row with stats */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-[28px] font-extrabold leading-none tracking-tight text-[#1c1c1c] sm:text-[36px]">
                  {title}
                </h1>
                {(path as unknown as { regenerate_count?: number }).regenerate_count != null && (
                  <span className="rounded-full bg-gold px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-dark">
                    Regen {(path as unknown as { regenerate_count: number }).regenerate_count}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-3 shadow-sm">
                <div className="text-right">
                  <p className="font-body text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                    Progress
                  </p>
                  <p className="font-heading text-lg font-extrabold text-gold">
                    {courses.filter((c) => c.is_completed).length}/{courses.length}
                  </p>
                </div>
              </div>
            </div>
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-[36px] font-extrabold tracking-[-0.9px] text-[#1c1c1c]">
                {title}
              </h1>
              <div className="rounded bg-[#1c1c1c] px-3 py-1">
                <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-white">
                  {courses.length} Courses
                </span>
              </div>
            </div>

            {/* Path metadata */}
            {path.questionnaire_snapshot && (
              <div className="flex flex-wrap gap-4 rounded-xl border border-[#e5e7eb] bg-white p-5">
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon />
                  <span className="font-body text-[#6b7280]">~{path.questionnaire_snapshot.total_duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HoursIcon />
                  <span className="font-body text-[#6b7280]">~{path.questionnaire_snapshot.total_hours_estimated}h estimated</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ChartIcon />
                  <span className="font-body text-[#6b7280]">{path.questionnaire_snapshot.difficulty_curve}</span>
                </div>
                {path.questionnaire_snapshot.target_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {path.questionnaire_snapshot.target_skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-[#e5e7eb] bg-[#fafafa] px-2.5 py-0.5 font-body text-xs font-bold text-[#4b5563]">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Overview + Tips (for AI-generated paths) */}
            {path.questionnaire_snapshot && (
              <div className="flex flex-col gap-6 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                {/* Overview */}
                {path.questionnaire_snapshot.overview && (
                  <div>
                    <h3 className="mb-2 font-heading text-sm font-extrabold uppercase tracking-wide text-dark">
                      📋 Overview
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-[#4b5563]">
                      {path.questionnaire_snapshot.overview}
                    </p>
                  </div>
                )}

                {/* Tips for success */}
                {path.questionnaire_snapshot.tips_for_success && path.questionnaire_snapshot.tips_for_success.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-heading text-sm font-extrabold uppercase tracking-wide text-dark">
                      💡 Tips for Success
                    </h3>
                    <ul className="space-y-1">
                      {path.questionnaire_snapshot.tips_for_success.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                          <span className="mt-1 shrink-0 text-gold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next steps */}
                {path.questionnaire_snapshot.next_steps_after_roadmap && path.questionnaire_snapshot.next_steps_after_roadmap.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-heading text-sm font-extrabold uppercase tracking-wide text-dark">
                      🚀 Next Steps After This Path
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {path.questionnaire_snapshot.next_steps_after_roadmap.map((step, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-[#e5e7eb] bg-[#fafafa] px-3 py-1.5 font-body text-xs font-bold text-[#4b5563]"
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Phases */}
            {phases.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-lg font-extrabold text-dark">
                  📍 Learning Phases ({phases.length})
                </h2>
                {phases.map((phase, i) => (
                  <PhaseCard
                    key={phase.phase_number}
                    phase={phase}
                    courses={path.courses}
                    isLast={i === phases.length - 1}
                    onReplace={(courseId, courseTitle) => setReplaceModal({ open: true, courseId, courseTitle })}
                    onRemove={(courseId) => handleDeleteCourse(courseId)}
                  />
                ))}
              </div>
            )}

            </div>

          {/* ── Right: sidebar (4 cols) ── */}
          <div className="hidden lg:col-span-4 lg:flex flex-col gap-6">
            {/* Manajemen Path */}
            <div className="rounded border border-[#e5e7eb] bg-white p-[33px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <p className="mb-6 font-heading text-[10px] font-extrabold uppercase tracking-[2.5px] text-[#9ca3af]">
                Manajemen Path
              </p>
              <button
                type="button"
                onClick={() => router.push("/learning-path")}
                className="flex w-full items-center justify-center gap-3 rounded bg-gold py-[17px] font-heading text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#1c1c1c] hover:bg-dark hover:text-gold"
              >
                <SaveIcon /> Simpan Perubahan
              </button>
            </div>

            {/* Catatan */}
            <div className="rounded border border-[#e5e7eb] bg-[#fff9e6] p-[33px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <div className="mb-3 flex items-center gap-3">
                <InfoIcon />
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#1c1c1c]">
                  Catatan
                </p>
              </div>
              <p className="font-body text-[14px] font-medium leading-[22.75px] text-[#1c1c1c]">
                Modul dapat diubah urutan dengan menarik indikator di sebelah kiri. Semua perubahan akan disimpan sebagai draf sebelum path disave.
              </p>
            </div>

            {/* Regenerate */}
            <button
              type="button"
              onClick={() => setRegenerateModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white px-4 py-3 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
            >
              <RefreshIcon /> Regenerate Path
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#ededed] bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-12 font-body text-[12px] font-bold uppercase tracking-[0.3px] text-[#4a4a4a]">
          <p>© 2024 PersonaLearn IT. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-[#1c1c1c]">Legal</span>
            <span className="cursor-pointer hover:text-[#1c1c1c]">Support</span>
            <span className="cursor-pointer hover:text-[#1c1c1c]">Privacy Policy</span>
            <span className="cursor-pointer hover:text-[#1c1c1c]">Terms of Service</span>
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

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableCourseRow(props: CourseRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.course.id });
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

// ─── Course Row ───────────────────────────────────────────────────────────────

interface CourseRowProps {
  course: AugmentedCourse;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onReplace: () => void;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
}

function CourseRow({ course, index, expanded, onToggle, onDelete, onToggleComplete, onReplace, dragListeners, dragAttributes }: CourseRowProps) {
  const isCompleted = course.is_completed;
  const isActive = expanded;
  const num = String(index + 1).padStart(2, "0");
  const levelLabel = (course.phaseName ?? course.course.level ?? "").toUpperCase();
  const hrs = course.course.video_hours ? `${Math.round(parseFloat(course.course.video_hours))}H` : "";
  const metaLine = [levelLabel, hrs].filter(Boolean).join(" · ");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-start gap-6">
      {/* Number badge column */}
      <div className="flex h-[68px] w-[48px] shrink-0 flex-col items-start pt-5">
        <div className={cn(
          "flex size-[48px] items-center justify-center rounded font-heading text-[12px] font-extrabold",
          isActive
            ? "border border-gold bg-gold text-[#1c1c1c]"
            : "border border-[#ededed] bg-white text-[#9ca3af]",
        )}>
          {num}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">

        {/* Expanded card header */}
        {expanded ? (
          <div className="relative flex items-center justify-between p-[21px]">
            {/* Drag handle with tooltip */}
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

            {/* Chevron (expand/collapse) */}
            <button type="button" onClick={onToggle} className="ml-4 shrink-0">
              <ChevronDownIcon />
            </button>

            {/* Title + meta */}
            <div className="ml-4 flex min-w-0 flex-1 flex-col gap-1">
              <p className="font-body text-[18px] font-bold leading-[28px] text-[#121212]">{course.course.title}</p>
              {metaLine && (
                <p className="font-body text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">{metaLine}</p>
              )}
            </div>

            {/* Trash */}
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
          /* Collapsed card */
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between p-[25px] text-left"
          >
            <div className="flex items-center gap-5">
              {/* Drag handle */}
              <div
                className="cursor-grab touch-none active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                {...dragListeners}
                {...dragAttributes}
              >
                <DragDotsSmIcon />
              </div>

              {/* Completion checkbox */}
              <div
                onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
                className={cn(
                  "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border-2",
                  isCompleted ? "border-gold bg-gold" : "border-[#d1d5db] bg-white",
                )}
              >
                {isCompleted && <CheckIcon />}
              </div>

              {/* Title + meta */}
              <div className="flex flex-col gap-[5.5px]">
                <p className="font-body text-[18px] font-bold leading-[22.5px] text-[#1c1c1c]">{course.course.title}</p>
                {metaLine && (
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                      {levelLabel}
                    </span>
                    {levelLabel && hrs && <span className="size-1 rounded-full bg-[#e5e7eb]" />}
                    <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                      {hrs}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Trash */}
            <div
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="flex cursor-pointer items-center justify-center p-2 text-[#9ca3af] hover:text-red-500"
            >
              <TrashIcon />
            </div>
          </button>
        )}

        {/* Expandable section */}
        {expanded && (
          <div className="pl-[56px] pt-4">
            <div className="border-t border-[#f3f4f6] pt-[17px]">
              <div className="rounded border border-[#e5e7eb] bg-[#f9fafb] p-[25px]">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  {course.course.thumbnail_url ? (
                    <div className="hidden sm:block w-[192px] shrink-0 overflow-hidden rounded bg-[#e5e7eb]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={course.course.thumbnail_url} alt={course.course.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="hidden sm:block w-[192px] shrink-0 rounded bg-[#e5e7eb]" />
                  )}

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      {/* AI Insight */}
                      {course.matchReason && (
                        <div className="rounded-br rounded-tr border-l-4 border-gold bg-[rgba(255,206,0,0.1)] py-4 pl-5 pr-4">
                          <div className="mb-[2.75px] flex items-center gap-2">
                            <SparkleIcon />
                            <span className="font-body text-[10px] font-extrabold uppercase tracking-[1px] text-[#121212]">AI Insight</span>
                          </div>
                          <p className="font-body text-[14px] font-medium leading-[22.75px] text-[#121212]">
                            {course.matchReason}
                          </p>
                        </div>
                      )}

                      {/* Title + level badge */}
                      <div className="flex items-start justify-between pt-4">
                        <div className="flex flex-col gap-1">
                          <p className="font-body text-[18px] font-bold leading-[28px] text-[#121212]">{course.course.title}</p>
                          {course.course.instructor && (
                            <p className="font-body text-[14px] font-medium leading-[20px] text-[#4b5563]">
                              Instructor: {course.course.instructor}
                            </p>
                          )}
                        </div>
                        {levelLabel && (
                          <div className="shrink-0 rounded border border-[#e5e7eb] bg-white px-[9px] py-[5px]">
                            <span className="font-body text-[12px] font-bold uppercase tracking-[0.6px] text-[#6b7280]">{levelLabel}</span>
                          </div>
                        )}
                      </div>

                      {/* Rating + price */}
                      <div className="flex items-center gap-4">
                        {course.course.rating && parseFloat(course.course.rating) > 0 && (
                          <div className="flex items-center gap-1">
                            <StarIcon />
                            <span className="font-body text-[14px] font-bold text-[#121212]">
                              {parseFloat(course.course.rating).toFixed(1)}
                            </span>
                          </div>
                        )}
                        {course.course.price && parseFloat(course.course.price) > 0 && (
                          <>
                            <span className="font-body text-[14px] text-[#d1d5db]">|</span>
                            <span className="font-body text-[14px] font-bold text-[#121212]">
                              {course.course.currency === "IDR"
                                ? `IDR ${parseFloat(course.course.price).toLocaleString("id-ID")}`
                                : `$${parseFloat(course.course.price).toFixed(2)}`}
                            </span>
                          </>
                        )}
                      </div>

                      {/* What you'll learn */}
                      {course.learningObjectives && course.learningObjectives.length > 0 && (
                        <div className="flex flex-col gap-2 pt-2">
                          <p className="font-body text-[12px] font-bold uppercase tracking-[0.6px] text-[#121212]">
                            What You&apos;ll Learn:
                          </p>
                          <div className="flex flex-col gap-[3.5px]">
                            {course.learningObjectives.slice(0, 3).map((obj, i) => (
                              <p key={i} className="font-body text-[14px] text-[#4b5563]">{obj}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      {course.course.video_hours && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                          <div className="flex items-center gap-1">
                            <ClockIcon />
                            <span className="font-body text-[12px] font-bold text-[#6b7280]">
                              {Math.round(parseFloat(course.course.video_hours))}h total
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PlayCircleIcon />
                            <span className="font-body text-[12px] font-bold text-[#6b7280]">
                              {Math.round(parseFloat(course.course.video_hours))}h video
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {levelLabel && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          <div className="rounded border border-[#e5e7eb] bg-white px-[9px] py-[5px]">
                            <span className="font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">{levelLabel}</span>
                          </div>
                          {course.course.level && course.phaseName && course.course.level.toUpperCase() !== levelLabel && (
                            <div className="rounded border border-[#e5e7eb] bg-white px-[9px] py-[5px]">
                              <span className="font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">{course.course.level.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action row */}
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e5e7eb] pt-[17px]">
                      <button
                        type="button"
                        onClick={() => onReplace()}
                        className="flex items-center gap-2 rounded border border-[#e5e7eb] bg-white px-[18px] py-[14px] font-body text-[13px] font-bold text-[#6b7280] shadow-sm transition-colors hover:border-[#9ca3af] hover:text-[#1c1c1c]"
                      >
                        <RefreshIcon />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => isCompleted ? onToggleComplete() : onToggleComplete()}
                        className={cn(
                          "rounded border-2 border-transparent px-[26px] py-[14px] font-body text-[14px] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
                          isCompleted ? "bg-green-500 text-white" : "bg-gold text-[#121212]",
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
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

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /><circle cx="19" cy="4" r="1" fill="#121212" /><circle cx="5" cy="18" r="1" fill="#121212" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

function PlusIcon() {
  return (
    <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function HoursIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
