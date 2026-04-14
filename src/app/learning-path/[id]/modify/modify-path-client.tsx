"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { LearningPathCourseItem, LearningPathDetail } from "@/lib/types";
import { updateLearningPath } from "@/lib/api/learning-path";
import { addCourseManual } from "@/lib/api/courses";
import { AppBar } from "@/components/layout/AppBar";
import {
  AddCourseDialog,
  type AddCourseResult,
} from "@/components/learning-path/AddCourseDialog";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

type Props = {
  initial: LearningPathDetail;
};

function reorderIds(items: LearningPathCourseItem[]): LearningPathCourseItem[] {
  return items.map((c, i) => ({ ...c, order: i + 1 }));
}

export function ModifyPathClient({ initial }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState<LearningPathCourseItem[]>(() =>
    [...initial.courses].sort((a, b) => a.order - b.order),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const title = initial.title;
  const courseCount = courses.length;

  const baseline = useMemo(
    () => [...initial.courses].sort((a, b) => a.order - b.order),
    [initial.courses],
  );

  const dirty =
    JSON.stringify(courses) !== JSON.stringify(baseline);

  function removeAt(index: number) {
    setCourses((c) => reorderIds(c.filter((_, i) => i !== index)));
  }

  function moveById(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    setCourses((prev) => {
      const sourceIndex = prev.findIndex((c) => c.id === sourceId);
      const targetIndex = prev.findIndex((c) => c.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      if (!moved) return prev;
      next.splice(targetIndex, 0, moved);
      return reorderIds(next);
    });
  }

  async function onSave() {
    setBusy(true);
    try {
      await updateLearningPath(initial.id, courses);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onAddCourse(result: AddCourseResult) {
    const order = courses.length + 1;
    let item: LearningPathCourseItem;
    if (result.kind === "catalog") {
      item = {
        id: `cat-${result.course.id}-${Date.now()}`,
        order,
        title: result.course.title,
        level: result.course.platform.toUpperCase(),
        duration: "—",
      };
    } else {
      item = {
        id: `manual-${Date.now()}`,
        order,
        title: result.draft.title,
        level: result.draft.level,
        duration: result.draft.durationLabel,
      };
      await addCourseManual(initial.id, result.draft);
    }
    setCourses((c) => [...c, item]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 grid-cols-1 gap-10 px-4 py-10 md:grid-cols-12 md:gap-10 md:px-8">
        <div className="md:col-span-8">
          <nav className="mb-6">
            <Link
              href="/learning-path"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-[#9ca3af] hover:text-dark"
            >
              <span aria-hidden>&larr;</span> Kembali
            </Link>
          </nav>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#1c1c1c] md:text-4xl">
              {title}
            </h1>
            <span className="rounded bg-[#1c1c1c] px-3 py-1 font-heading text-[10px] font-extrabold uppercase tracking-wide text-white">
              {courseCount} courses
            </span>
          </div>

          <div className="relative flex flex-col gap-4">
            <div
              className="absolute bottom-0 left-6 top-0 w-px bg-[#e5e7eb] md:left-6"
              aria-hidden
            />
            {courses.map((course, index) => {
              const isFirst = index === 0;
              return (
                <div
                  key={course.id}
                  className="relative flex gap-6"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingId) moveById(draggingId, course.id);
                    setDraggingId(null);
                  }}
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
                      "relative z-[1] flex min-w-0 flex-1 items-center justify-between gap-4 rounded border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors",
                      draggingId === course.id && "border-gold bg-gold-light/40",
                    )}
                    draggable
                    onDragStart={(e) => {
                      setDraggingId(course.id);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", course.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex flex-col items-center gap-0.5 text-[#9ca3af]">
                        <span
                          className="cursor-grab select-none active:cursor-grabbing"
                          title="Tarik untuk ubah urutan"
                        >
                          <GripIcon />
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        className="size-5 shrink-0 rounded border-[#d1d5db] accent-gold"
                        aria-label={`Pilih ${course.title}`}
                      />
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
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="shrink-0 rounded p-2 text-[#9ca3af] hover:bg-red-50 hover:text-red-600"
                      aria-label="Hapus kursus"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded border border-[#e5e7eb] bg-white py-5 font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#1c1c1c] shadow-sm hover:border-gold/50"
          >
            <PlusIcon />
            Tambah kursus
          </button>
        </div>

        <aside className="md:col-span-4 md:pt-14">
          <div className="space-y-6">
            <div className="rounded border border-[#e5e7eb] bg-white p-8 shadow-sm">
              <p className="font-heading text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9ca3af]">
                Manajemen path
              </p>
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={onSave}
                className={primaryGoldCtaClass(
                  "mt-6 flex w-full items-center justify-center gap-3 rounded px-4 py-4 font-heading text-xs font-extrabold uppercase tracking-widest",
                )}
              >
                <SaveIcon />
                Simpan perubahan
              </button>
            </div>
            <div className="rounded border border-[#e5e7eb] bg-gold-light p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <InfoIcon />
                <p className="font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#1c1c1c]">
                  Catatan
                </p>
              </div>
              <p className="mt-3 font-body text-sm font-medium leading-relaxed text-[#1c1c1c]">
                Modul dapat diubah urutan dengan drag and drop pada handle di
                sebelah kiri. Semua perubahan akan disimpan sebagai draf sebelum
                path disimpan.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-auto border-t border-[rgba(209,209,209,0.35)] bg-[#fdfdfd]">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-8 py-12 text-[11px] font-bold uppercase tracking-wide text-[#4a4a4a] md:flex-row md:items-center">
          <p>© 2024 PrecisionLearn IT. All rights reserved.</p>
          <div className="flex flex-wrap gap-8">
            <span className="cursor-pointer hover:text-dark">Legal</span>
            <span className="cursor-pointer hover:text-dark">Support</span>
            <span className="cursor-pointer hover:text-dark">
              Privacy policy
            </span>
            <span className="cursor-pointer hover:text-dark">
              Terms of service
            </span>
          </div>
        </div>
      </footer>

      <AddCourseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={onAddCourse}
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
    <svg width="14" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 21h14a2 2 0 0 0 2-2V8l-6-6H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M7 21v-8h10v8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
