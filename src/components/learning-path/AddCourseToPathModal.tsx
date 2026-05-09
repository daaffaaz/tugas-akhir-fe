"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { getSimilarCourses, addCourseToPath } from "@/lib/api/rag";
import { toast } from "@/context/ToastContext";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { SimilarCourse } from "@/types/rag";
import { primaryGoldCtaClass, primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  pathId: string;
  courseId?: string;
  onAdded: () => void;
  currentCourseCount?: number;
}

export function AddCourseToPathModal({
  open,
  onClose,
  pathId,
  courseId,
  onAdded,
  currentCourseCount = 0,
}: Props) {
  const [courses, setCourses] = useState<SimilarCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<number>(currentCourseCount + 1);

  // Sync default position when currentCourseCount changes
  useEffect(() => {
    setSelectedPosition(currentCourseCount + 1);
  }, [currentCourseCount]);

  useEffect(() => {
    if (!open) {
      setCourses([]);
      setError(null);
      setLoaded(false);
      setSearchQuery("");
      return;
    }

    if (loaded) return;

    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const res = await getSimilarCourses(pathId, courseId ?? "", 15);
        setCourses(res.courses);
        setLoaded(true);
      } catch (err) {
        if (err instanceof QuestionnaireRequiredError) {
          onClose();
          window.location.href = "/questionnaire";
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat kursus serupa.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [open, loaded, pathId, courseId, onClose]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.instructor ?? "").toLowerCase().includes(q),
    );
  }, [courses, searchQuery]);

  async function handleAdd(course: SimilarCourse) {
    setAddingId(course.course_id);
    try {
      const position = selectedPosition > 0 ? selectedPosition : undefined;
      await addCourseToPath(pathId, { course_id: course.course_id, position });
      toast.success("Kursus berhasil ditambahkan ✓");
      onAdded();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal tambah kursus.");
    } finally {
      setAddingId(null);
    }
  }

  function handleClose() {
    setSearchQuery("");
    onClose();
  }

  function formatPrice(price: number | null, currency: string) {
    if (price == null || price === 0) return "Gratis";
    if (currency === "IDR") return `IDR ${price.toLocaleString("id-ID")}`;
    return `${currency} ${price.toFixed(2)}`;
  }

  const maxPosition = currentCourseCount + 1;
  const showSearch = courses.length > 5;

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="w-[min(580px,95vw)] rounded-2xl bg-white p-6 font-body text-dark">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusIcon />
            <h2 className="font-heading text-xl font-extrabold text-dark">
              Tambah Kursus
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-2 text-[#9ca3af] hover:bg-[#f3f4f6]"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mb-4 text-sm text-[#6b7280]">
          Pilih kursus yang ingin ditambahkan ke learning path kamu.
        </p>

        {/* Position selector */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
          <LocationIcon />
          <label htmlFor="insert-position" className="font-body text-sm font-medium text-[#374151]">
            Sisipkan di posisi
          </label>
          <select
            id="insert-position"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(Number(e.target.value))}
            className="ml-auto rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 font-body text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {Array.from({ length: maxPosition }, (_, i) => i + 1).map((pos) => (
              <option key={pos} value={pos}>
                {pos === maxPosition ? `${pos} (akhir)` : `${pos}`}
              </option>
            ))}
          </select>
        </div>

        {/* Search filter — hanya tampil jika ada banyak courses */}
        {showSearch && (
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Cari kursus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2.5 pl-9 pr-4 font-body text-sm text-dark placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <SpinnerIcon />
            <span className="ml-3 text-sm text-[#9ca3af]">Memuat kursus...</span>
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && loaded && filteredCourses.length === 0 && !error && (
          <div className="py-12 text-center text-sm text-[#9ca3af]">
            {searchQuery ? "Tidak ada kursus yang cocok dengan pencarian." : "Tidak ada kursus serupa ditemukan."}
          </div>
        )}

        {!loading && filteredCourses.length > 0 && (
          <div className="mb-5 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {filteredCourses.map((course) => (
              <div
                key={course.course_id}
                className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
              >
                {course.thumbnail_url ? (
                  <div className="h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-[#e5e7eb]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-[#e5e7eb]">
                    <CoursePlaceholderIcon />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-sm font-bold leading-tight text-dark">
                    {course.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#6b7280]">
                    {course.instructor ?? ""} &bull; {course.platform} &bull;{" "}
                    {course.level}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#6b7280]">
                    {course.rating != null && (
                      <span className="flex items-center gap-0.5 font-bold">
                        ⭐ {course.rating.toFixed(1)}
                      </span>
                    )}
                    <span>{course.duration}</span>
                    <span className="ml-auto font-bold text-[#1c1c1c]">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(course)}
                  disabled={addingId === course.course_id}
                  className={cn(
                    addingId === course.course_id
                      ? primaryGoldCtaClassSoftDisabled("shrink-0 rounded-lg border px-3 py-2 text-xs font-bold")
                      : primaryGoldCtaClass("shrink-0 rounded-lg border px-3 py-2 text-xs font-bold"),
                  )}
                >
                  {addingId === course.course_id ? "..." : "+ Tambah"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-3 font-heading text-sm font-bold text-[#6b7280] hover:bg-[#f9fafb]"
          >
            Tutup
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CoursePlaceholderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
