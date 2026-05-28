"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  getRagLearningPath,
  toggleCourseComplete,
  bulkUpdatePathCourses,
} from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { RagLearningPathResponse } from "@/types/rag";
import { type AugmentedCourse } from "@/components/learning-path/PhaseCard";
import {
  PhaseTabSlider,
  type PhaseGroup,
} from "@/components/learning-path/PhaseTabSlider";
import { PathOverviewCard } from "@/components/learning-path/PathOverviewCard";
import { ReplaceCourseModal } from "@/components/learning-path/ReplaceCourseModal";
import { RegeneratePathModal } from "@/components/learning-path/RegeneratePathModal";
import { AddCourseToPathModal, type AvailablePhase } from "@/components/learning-path/AddCourseToPathModal";
import { DeleteConfirmDialog } from "@/components/learning-path/DeleteConfirmDialog";
import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { showBadgeAwarded } from "@/components/badges/BadgeAwardedToast";
import { toast } from "@/context/ToastContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = { pathId: string };

// ─── Utilities ───────────────────────────────────────────────────────────────

function buildAugmented(path: RagLearningPathResponse): AugmentedCourse[] {
  const phases = path.questionnaire_snapshot?.phases ?? [];

  // Map by course_id from snapshot (for original AI-assigned courses)
  const courseIdMap = new Map<
    string,
    { phaseName: string; matchReason: string; learningObjectives: string[] }
  >();
  // Map by phase_number (fallback for manually added courses not in snapshot)
  const phaseNumberMap = new Map<
    number,
    { phaseName: string; learningObjectives: string[] }
  >();

  for (const phase of phases) {
    phaseNumberMap.set(phase.phase_number, {
      phaseName: phase.phase_name,
      learningObjectives: phase.learning_objectives,
    });
    for (const pc of phase.courses) {
      courseIdMap.set(pc.course_id, {
        phaseName: phase.phase_name,
        matchReason: pc.match_reason,
        learningObjectives: phase.learning_objectives,
      });
    }
  }

  return [...path.courses]
    .sort((a, b) => a.position - b.position)
    .map((course) => {
      const fromSnapshot = courseIdMap.get(course.course.id);
      if (fromSnapshot) {
        return { ...course, ...fromSnapshot };
      }
      // Manually added course: resolve phaseName from phase_number field
      const fromPhase =
        course.phase_number != null
          ? phaseNumberMap.get(course.phase_number)
          : undefined;
      return {
        ...course,
        phaseName: fromPhase?.phaseName,
        matchReason: undefined,
        learningObjectives: fromPhase?.learningObjectives,
      };
    });
}

function buildPhaseGroups(
  path: RagLearningPathResponse,
  draftCourses: AugmentedCourse[],
): PhaseGroup[] {
  const phases = path.questionnaire_snapshot?.phases ?? [];
  const groups: PhaseGroup[] = [];

  for (const phase of phases) {
    // Group by phase_number field on the course — authoritative for both AI and manually added
    const phaseCourses = draftCourses.filter(
      (c) => c.phase_number === phase.phase_number,
    );
    groups.push({
      phase,
      phaseLabel: phase.phase_name,
      courses: phaseCourses,
    });
  }

  // Courses with phase_number === null are unassigned
  const unassigned = draftCourses.filter((c) => c.phase_number === null);
  if (unassigned.length > 0) {
    groups.push({
      phase: null,
      phaseLabel: "Kursus Tambahan",
      courses: unassigned,
    });
  }

  return groups;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ModifyPathClient({ pathId }: Props) {
  const [path, setPath] = useState<RagLearningPathResponse | null>(null);
  const [serverCourses, setServerCourses] = useState<AugmentedCourse[]>([]);
  const [draftCourses, setDraftCourses] = useState<AugmentedCourse[]>([]);
  const [draftDeletedIds, setDraftDeletedIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [replaceModal, setReplaceModal] = useState<{
    open: boolean;
    courseId: string;
    courseTitle: string;
  }>({ open: false, courseId: "", courseTitle: "" });
  const [regenerateModal, setRegenerateModal] = useState(false);
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    courseId: string;
    courseTitle: string;
  }>({ open: false, courseId: "", courseTitle: "" });

  const draftDeletedIdsRef = useRef(draftDeletedIds);
  const togglingIdsRef = useRef(togglingIds);

  useEffect(() => {
    draftDeletedIdsRef.current = draftDeletedIds;
  }, [draftDeletedIds]);

  useEffect(() => {
    togglingIdsRef.current = togglingIds;
  }, [togglingIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const loadPath = useCallback(
    async (opts?: { preserveDraft?: boolean }) => {
      if (!opts?.preserveDraft) {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await getRagLearningPath(pathId);
        setPath(res);
        const list = buildAugmented(res);
        setServerCourses(list);

        if (opts?.preserveDraft) {
          const existingIds = new Set(list.map((c) => c.id));
          const prevDeleted = draftDeletedIdsRef.current;
          const nextDeleted = new Set(
            [...prevDeleted].filter((id) => existingIds.has(id)),
          );
          setDraftDeletedIds(nextDeleted);
          setDraftCourses(list);
        } else {
          setDraftCourses(list);
          setDraftDeletedIds(new Set());
        }

        setExpandedId((prev) => {
          if (prev && list.some((c) => c.id === prev)) return prev;
          return list[0]?.id ?? null;
        });
      } catch (err) {
        if (err instanceof QuestionnaireRequiredError) {
          window.location.href = "/questionnaire";
          return;
        }
        setError(
          err instanceof Error ? err.message : "Gagal memuat learning path.",
        );
      } finally {
        if (!opts?.preserveDraft) {
          setLoading(false);
        }
      }
    },
    [pathId],
  );

  useEffect(() => {
    loadPath();
  }, [loadPath]);

  // ─── Derived state ─────────────────────────────────────────────────────────

  const visibleDraftCourses = useMemo(
    () => draftCourses.filter((c) => !draftDeletedIds.has(c.id)),
    [draftCourses, draftDeletedIds],
  );

  const phaseGroups = useMemo<PhaseGroup[]>(
    () => (path ? buildPhaseGroups(path, visibleDraftCourses) : []),
    [path, visibleDraftCourses],
  );

  const availablePhases = useMemo<AvailablePhase[]>(
    () =>
      (path?.questionnaire_snapshot?.phases ?? []).map((p) => ({
        phase_number: p.phase_number,
        phase_name: p.phase_name,
      })),
    [path],
  );

  const isDirty = useMemo(() => {
    if (draftDeletedIds.size > 0) return true;
    const serverIds = serverCourses.map((c) => c.id);
    const draftIds = draftCourses.map((c) => c.id);
    if (serverIds.length !== draftIds.length) return true;
    for (let i = 0; i < serverIds.length; i++) {
      if (serverIds[i] !== draftIds[i]) return true;
    }
    return false;
  }, [draftDeletedIds, serverCourses, draftCourses]);

  const completedCount = visibleDraftCourses.filter((c) => c.is_completed).length;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleToggleExpand = useCallback((courseId: string) => {
    setExpandedId((prev) => (prev === courseId ? null : courseId));
  }, []);

  const handleToggleComplete = useCallback((courseId: string) => {
    // Skip kalau call sebelumnya untuk course ini masih in-flight (anti race).
    if (togglingIdsRef.current.has(courseId)) return;

    // Capture state sebelumnya untuk rollback kalau API fail.
    let previousIsCompleted: boolean | null = null;
    setDraftCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        previousIsCompleted = c.is_completed;
        return { ...c, is_completed: !c.is_completed };
      }),
    );
    // Mirror perubahan ke serverCourses agar isDirty tidak salah deteksi.
    setServerCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, is_completed: !c.is_completed } : c,
      ),
    );

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.add(courseId);
      return next;
    });

    void (async () => {
      try {
        const res = await toggleCourseComplete(courseId);

        // Sinkronkan state dengan response (untuk konsistensi end-to-end).
        setDraftCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, is_completed: res.is_completed }
              : c,
          ),
        );
        setServerCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, is_completed: res.is_completed }
              : c,
          ),
        );

        // Celebration toast untuk badge baru.
        for (const badge of res.badges?.awarded ?? []) {
          showBadgeAwarded(badge);
        }
        // Info toast non-blocking untuk badge yg sudah dimiliki.
        for (const badge of res.badges?.already_owned ?? []) {
          toast.info(
            `Kamu sudah punya badge ${badge.name} dari course sebelumnya.`,
          );
        }
      } catch (err) {
        // Rollback optimistic update.
        if (previousIsCompleted !== null) {
          const rollback = previousIsCompleted;
          setDraftCourses((prev) =>
            prev.map((c) =>
              c.id === courseId ? { ...c, is_completed: rollback } : c,
            ),
          );
          setServerCourses((prev) =>
            prev.map((c) =>
              c.id === courseId ? { ...c, is_completed: rollback } : c,
            ),
          );
        }
        toast.error(
          err instanceof Error
            ? err.message
            : "Gagal memperbarui status course.",
        );
      } finally {
        setTogglingIds((prev) => {
          if (!prev.has(courseId)) return prev;
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      }
    })();
  }, []);

  const confirmDelete = useCallback(
    (courseId: string) => {
      setDraftDeletedIds((prev) => {
        const next = new Set(prev);
        next.add(courseId);
        return next;
      });
      if (expandedId === courseId) setExpandedId(null);
    },
    [expandedId],
  );

  const requestDelete = useCallback(
    (courseId: string) => {
      const course = draftCourses.find((c) => c.id === courseId);
      setDeleteConfirm({
        open: true,
        courseId,
        courseTitle: course?.course.title ?? "kursus ini",
      });
    },
    [draftCourses],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const findGroup = (id: string) =>
        phaseGroups.find((g) => g.courses.some((c) => c.id === id));
      const sourceGroup = findGroup(String(active.id));
      const targetGroup = findGroup(String(over.id));
      if (!sourceGroup || !targetGroup || sourceGroup !== targetGroup) {
        // Cross-phase drag tidak diijinkan untuk menjaga integritas phase mapping
        return;
      }

      setDraftCourses((prev) => {
        const oldIdx = prev.findIndex((c) => c.id === active.id);
        const newIdx = prev.findIndex((c) => c.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return prev;
        return arrayMove(prev, oldIdx, newIdx);
      });
    },
    [phaseGroups],
  );

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Cek apakah ada perubahan struktural (delete atau reorder)
      const serverVisibleIds = serverCourses
        .map((c) => c.id)
        .filter((id) => !draftDeletedIds.has(id));
      const draftVisibleIds = visibleDraftCourses.map((c) => c.id);
      const isStructurallyDirty =
        draftDeletedIds.size > 0 ||
        serverVisibleIds.length !== draftVisibleIds.length ||
        serverVisibleIds.some((id, i) => id !== draftVisibleIds[i]);

      // Bulk-update: atomic replace seluruh daftar courses (delete implicit + reorder).
      // Toggle completion sudah committed instantly per click (lihat handleToggleComplete).
      if (isStructurallyDirty) {
        await bulkUpdatePathCourses(pathId, {
          courses: visibleDraftCourses.map((c, i) => ({
            course_id: c.course.id,
            position: i + 1,
            phase_number: c.phase_number,
            is_manually_added: c.is_manually_added,
          })),
        });
      }

      await loadPath();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan.",
      );
    } finally {
      setSaving(false);
    }
  }, [
    saving,
    draftDeletedIds,
    visibleDraftCourses,
    serverCourses,
    pathId,
    loadPath,
  ]);

  const handleDiscard = useCallback(() => {
    setDraftCourses(serverCourses);
    setDraftDeletedIds(new Set());
    setSaveError(null);
  }, [serverCourses]);

  const handleReplace = useCallback((courseId: string, courseTitle: string) => {
    setReplaceModal({ open: true, courseId, courseTitle });
  }, []);

  // ─── Render guards ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfdfd]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-gold" />
          <p className="font-body text-sm text-[#9ca3af]">
            Memuat learning path...
          </p>
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfdfd]">
        <p className="mb-4 font-body text-sm text-red-500">
          {error ?? "Path tidak ditemukan."}
        </p>
        <Link
          href="/learning-path"
          className={primaryGoldCtaClass(
            "rounded px-6 py-3 font-heading text-sm font-bold",
          )}
        >
          ← Kembali ke Learning Path
        </Link>
      </div>
    );
  }

  const pathTitle =
    path.questionnaire_snapshot?.roadmap_title ?? path.title;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body">
      <AppBar />

      <div
        className={`mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-8 sm:py-10 ${isDirty ? "pb-24" : ""}`}
      >
        {/* Breadcrumb */}
        <Link
          href="/learning-path"
          className="inline-flex items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[1.2px] text-[#9ca3af] hover:text-[#1c1c1c]"
        >
          <ArrowLeftIcon /> Kembali
        </Link>

        {/* Grid layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Left: course list */}
          <div className="flex flex-col gap-8 lg:col-span-8">
            <PathOverviewCard
              path={path}
              courseCount={visibleDraftCourses.length}
              completedCount={completedCount}
            />

            {/* Phase tab slider with single top-level DndContext */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <PhaseTabSlider
                phaseGroups={phaseGroups}
                expandedCourseId={expandedId}
                onToggleExpand={handleToggleExpand}
                onToggleComplete={handleToggleComplete}
                onDelete={requestDelete}
                onReplace={handleReplace}
              />
            </DndContext>

            {/* Tambah kursus */}
            <button
              type="button"
              onClick={() => setAddCourseModal(true)}
              className="flex w-full items-center justify-center gap-3 rounded border border-[#e5e7eb] bg-white py-[21px] font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c] transition-colors hover:border-[#1c1c1c]"
            >
              <PlusIcon /> Tambah Kursus
            </button>
          </div>

          {/* Right: sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Manajemen Learning Path */}
            <div className="rounded border border-[#e5e7eb] bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]">
              <div className="mb-5 flex items-center justify-between gap-2">
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[2.5px] text-[#9ca3af]">
                  Manajemen Learning Path
                </p>
                {isDirty && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-amber-800">
                    Belum disimpan
                  </span>
                )}
              </div>

              {saveError && (
                <p className="mb-3 font-body text-[12px] text-red-600">
                  {saveError}
                </p>
              )}

              <button
                type="button"
                onClick={() => setRegenerateModal(true)}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white py-[14px] font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c] disabled:opacity-50"
              >
                <RefreshIcon /> Regenerate Path
              </button>
            </div>

            {/* Catatan */}
            <div className="rounded border border-[#e5e7eb] bg-[#fff9e6] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]">
              <div className="mb-3 flex items-center gap-3">
                <InfoIcon />
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#1c1c1c]">
                  Catatan
                </p>
              </div>
              <p className="font-body text-[14px] font-medium leading-[22.75px] text-[#1c1c1c]">
                Modul dapat diubah urutan dengan menarik indikator di sebelah
                kiri (dalam fase yang sama). Perubahan disimpan sebagai draf —
                klik <strong>Simpan Perubahan</strong> untuk commit ke server.
              </p>
            </div>

            {/* Tips & Langkah Selanjutnya (collapsible) */}
            <TipsSidebarCard
              tips={path.questionnaire_snapshot?.tips_for_success ?? []}
              nextSteps={
                path.questionnaire_snapshot?.next_steps_after_roadmap ?? []
              }
            />
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e7eb] bg-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
            <span className="rounded-full bg-amber-100 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-amber-800">
              Belum disimpan
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {!saving && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="flex items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white px-5 py-3 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
                >
                  <UndoIcon /> Batal Perubahan
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-3 rounded bg-gold px-6 py-3 font-heading text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#1c1c1c] transition-colors hover:bg-dark hover:text-gold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gold disabled:hover:text-[#1c1c1c]"
              >
                {saving ? <SpinnerIcon /> : <SaveIcon />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

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
            confirmDelete(replaceModal.courseId);
            setReplaceModal((m) => ({ ...m, open: false }));
          }}
        />
      )}
      {regenerateModal && (
        <RegeneratePathModal
          open={regenerateModal}
          onClose={() => setRegenerateModal(false)}
          pathId={pathId}
          title={pathTitle}
          onRegenerated={loadPath}
        />
      )}
      {addCourseModal && (
        <AddCourseToPathModal
          open={addCourseModal}
          onClose={() => setAddCourseModal(false)}
          pathId={pathId}
          courseId={visibleDraftCourses[0]?.course.id}
          onAdded={() => loadPath({ preserveDraft: true })}
          availablePhases={availablePhases}
        />
      )}
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onClose={() =>
          setDeleteConfirm((s) => ({ ...s, open: false }))
        }
        onConfirm={() => confirmDelete(deleteConfirm.courseId)}
        courseName={deleteConfirm.courseTitle}
      />
    </div>
  );
}

// ─── Tips Sidebar Card ───────────────────────────────────────────────────────

function TipsSidebarCard({
  tips,
  nextSteps,
}: {
  tips: string[];
  nextSteps: string[];
}) {
  const [open, setOpen] = useState(false);
  if (tips.length === 0 && nextSteps.length === 0) return null;

  return (
    <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between gap-2 px-6 py-4 text-left transition-colors hover:bg-[#fafafa] sm:px-[33px]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <LightbulbIcon />
          <p className="font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#1c1c1c]">
            Tips & Langkah Selanjutnya
          </p>
        </div>
        <span
          className={`shrink-0 text-[#9ca3af] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <div className="space-y-5 border-t border-[#f3f4f6] px-6 py-5 sm:px-[33px]">
          {tips.length > 0 && (
            <div>
              <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
                Tips for Success
              </p>
              <ul className="space-y-1.5">
                {tips.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-body text-[13px] leading-[20px] text-[#4b5563]"
                  >
                    <span className="mt-[6px] size-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nextSteps.length > 0 && (
            <div>
              <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
                Next Steps After This Path
              </p>
              <div className="flex flex-wrap gap-2">
                {nextSteps.map((step, i) => (
                  <span
                    key={i}
                    className="rounded border border-[#e5e7eb] bg-[#fafafa] px-[9px] py-[5px] font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#4b5563]"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="10.5"
      height="10.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function ChevronDownIcon() {
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
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}
