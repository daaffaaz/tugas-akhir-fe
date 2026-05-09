"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { getSimilarCourses, addCourseToPath } from "@/lib/api/rag";
import { toast } from "@/context/ToastContext";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { SimilarCourse } from "@/types/rag";
import { cn } from "@/lib/utils";

export interface AvailablePhase {
  phase_number: number;
  phase_name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  pathId: string;
  courseId?: string;
  onAdded: () => void;
  availablePhases?: AvailablePhase[];
}

export function AddCourseToPathModal({
  open,
  onClose,
  pathId,
  courseId,
  onAdded,
  availablePhases = [],
}: Props) {
  const [courses, setCourses] = useState<SimilarCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // null = tambahan tanpa fase
  const [selectedPhase, setSelectedPhase] = useState<number | null>(
    availablePhases[0]?.phase_number ?? null,
  );
  const [phaseDropdownOpen, setPhaseDropdownOpen] = useState(false);
  const phaseDropdownRef = useRef<HTMLDivElement>(null);

  // Sync default saat availablePhases berubah (pertama kali open)
  useEffect(() => {
    setSelectedPhase(availablePhases[0]?.phase_number ?? null);
  }, [availablePhases]);

  // Close dropdown saat klik luar
  useEffect(() => {
    if (!phaseDropdownOpen) return;
    function onOutside(e: MouseEvent) {
      if (phaseDropdownRef.current && !phaseDropdownRef.current.contains(e.target as Node)) {
        setPhaseDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [phaseDropdownOpen]);

  // Load similar courses saat modal dibuka
  useEffect(() => {
    if (!open) {
      setCourses([]);
      setError(null);
      setLoaded(false);
      setSearchQuery("");
      return;
    }

    if (loaded) return;

    if (!courseId) {
      setLoaded(true);
      return;
    }

    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const res = await getSimilarCourses(pathId, courseId!, 15);
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
      await addCourseToPath(pathId, {
        course_id: course.course_id,
        phase_number: selectedPhase ?? undefined,
      });
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

  const showSearch = courses.length > 5;

  // Label fase yang dipilih
  const selectedPhaseLabel =
    selectedPhase === null
      ? "Kursus Tambahan"
      : `Fase ${selectedPhase}${availablePhases.find((p) => p.phase_number === selectedPhase)?.phase_name ? ` — ${availablePhases.find((p) => p.phase_number === selectedPhase)!.phase_name}` : ""}`;

  const selectedPhaseDesc =
    selectedPhase === null
      ? "Course ditambahkan di paling akhir tanpa fase"
      : `Course disisipkan di akhir Fase ${selectedPhase}`;

  return (
    <Dialog open={open} onClose={handleClose} hideTitleRow className="max-w-[680px]">
      <div className="font-body text-[#1c1c1c]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#f3f4f6] px-7 pb-5 pt-7">
          <div>
            <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#9ca3af]">
              Tambah Kursus
            </p>
            <h2 className="font-heading text-[22px] font-extrabold leading-tight tracking-tight text-[#1c1c1c]">
              Pilih kursus untuk ditambahkan
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#1c1c1c]"
            aria-label="Tutup"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Phase selector strip */}
        <div className="flex items-center gap-4 border-b border-[#f3f4f6] bg-[#fafafa] px-7 py-4">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
              Tujuan fase
            </p>
            <p className="font-body text-[13px] text-[#6b7280]">
              {selectedPhaseDesc}
            </p>
          </div>

          {/* Phase dropdown */}
          <div className="relative shrink-0" ref={phaseDropdownRef}>
            <button
              type="button"
              onClick={() => setPhaseDropdownOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2.5 rounded border px-4 py-2.5 font-heading text-[13px] font-extrabold text-[#1c1c1c] transition-colors",
                phaseDropdownOpen
                  ? "border-gold bg-gold"
                  : "border-[#e5e7eb] bg-white hover:border-gold",
              )}
            >
              <PhaseIcon />
              <span className="max-w-[160px] truncate">{selectedPhaseLabel}</span>
              <ChevronDownIcon open={phaseDropdownOpen} />
            </button>

            {phaseDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-64 overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.1)]">
                {/* Phase options */}
                {availablePhases.map((phase) => {
                  const isSelected = selectedPhase === phase.phase_number;
                  return (
                    <button
                      key={phase.phase_number}
                      type="button"
                      onClick={() => { setSelectedPhase(phase.phase_number); setPhaseDropdownOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                        isSelected
                          ? "bg-gold"
                          : "hover:bg-[#f9fafb]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full font-heading text-[10px] font-extrabold",
                          isSelected
                            ? "bg-[#1c1c1c] text-gold"
                            : "bg-[#f3f4f6] text-[#6b7280]",
                        )}
                      >
                        {phase.phase_number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "font-heading text-[11px] font-extrabold uppercase tracking-[0.5px]",
                          isSelected ? "text-[#1c1c1c]" : "text-[#1c1c1c]",
                        )}>
                          Fase {phase.phase_number}
                        </p>
                        <p className="truncate font-body text-[12px] text-[#6b7280]">
                          {phase.phase_name}
                        </p>
                      </div>
                      {isSelected && <CheckSmallIcon />}
                    </button>
                  );
                })}

                {/* Divider + "Tambahan" option */}
                {availablePhases.length > 0 && (
                  <div className="border-t border-[#f3f4f6]" />
                )}
                <button
                  type="button"
                  onClick={() => { setSelectedPhase(null); setPhaseDropdownOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                    selectedPhase === null ? "bg-gold" : "hover:bg-[#f9fafb]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full font-heading text-[11px] font-extrabold",
                      selectedPhase === null
                        ? "bg-[#1c1c1c] text-gold"
                        : "bg-[#f3f4f6] text-[#6b7280]",
                    )}
                  >
                    +
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-[11px] font-extrabold uppercase tracking-[0.5px] text-[#1c1c1c]">
                      Kursus Tambahan
                    </p>
                    <p className="font-body text-[12px] text-[#6b7280]">
                      Di luar fase, ditambah di akhir
                    </p>
                  </div>
                  {selectedPhase === null && <CheckSmallIcon />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[58vh] overflow-y-auto px-7 py-6">
          {/* Search */}
          {showSearch && (
            <div className="relative mb-5">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau instruktur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-[#e5e7eb] bg-white py-2.5 pl-9 pr-4 font-body text-[14px] text-[#1c1c1c] placeholder:text-[#9ca3af] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <SpinnerIcon size={24} />
              <p className="font-body text-[14px] text-[#9ca3af]">Memuat rekomendasi kursus...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && <ErrorBox message={error} />}

          {/* Empty */}
          {!loading && loaded && filteredCourses.length === 0 && !error && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af]">
                <SearchIcon />
              </div>
              <p className="font-body text-[14px] font-bold text-[#1c1c1c]">
                {searchQuery ? "Tidak ada kursus yang cocok" : "Tidak ada rekomendasi ditemukan"}
              </p>
              <p className="max-w-xs font-body text-[13px] text-[#6b7280]">
                {searchQuery
                  ? "Coba kata kunci yang berbeda."
                  : "Sistem tidak menemukan kursus serupa untuk path ini."}
              </p>
            </div>
          )}

          {/* Course list */}
          {!loading && filteredCourses.length > 0 && (
            <div className="flex flex-col gap-4">
              {loaded && (
                <div className="flex items-center justify-between">
                  <p className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                    Rekomendasi Kursus
                  </p>
                  <span className="rounded bg-[#1c1c1c] px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-white">
                    {filteredCourses.length} kursus
                  </span>
                </div>
              )}
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  adding={addingId === course.course_id}
                  disabled={addingId !== null && addingId !== course.course_id}
                  onAdd={() => handleAdd(course)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[#f3f4f6] bg-[#fafafa] px-7 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
          >
            Tutup
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({
  course,
  adding,
  disabled,
  onAdd,
}: {
  course: SimilarCourse;
  adding: boolean;
  disabled: boolean;
  onAdd: () => void;
}) {
  const formattedPrice =
    course.price != null && course.price > 0
      ? course.currency === "IDR"
        ? `IDR ${course.price.toLocaleString("id-ID")}`
        : `$${course.price.toFixed(2)}`
      : null;
  const isFree = course.price === 0 || course.price == null;

  return (
    <article className="rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex gap-4 p-5">
        {/* Thumbnail */}
        {course.thumbnail_url ? (
          <div className="h-[72px] w-[100px] shrink-0 overflow-hidden rounded bg-[#e5e7eb]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        ) : (
          <div className="flex h-[72px] w-[100px] shrink-0 items-center justify-center rounded bg-[#e5e7eb] text-[#9ca3af]">
            <BookIcon />
          </div>
        )}

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {course.platform && (
              <span className="rounded border border-[#e5e7eb] bg-white px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">
                {course.platform}
              </span>
            )}
            {course.level && (
              <span className="rounded border border-[#e5e7eb] bg-white px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">
                {course.level}
              </span>
            )}
          </div>
          <h3 className="font-body text-[15px] font-bold leading-[21px] text-[#1c1c1c] line-clamp-2">
            {course.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {course.instructor && (
              <span className="font-body text-[12px] text-[#6b7280]">{course.instructor}</span>
            )}
            {course.rating != null && (
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="font-heading text-[12px] font-bold text-[#1c1c1c]">
                  {course.rating.toFixed(1)}
                </span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span className="font-body text-[12px] text-[#6b7280]">{course.duration}</span>
              </div>
            )}
            <span className={cn("ml-auto font-heading text-[12px] font-bold", isFree ? "text-emerald-600" : "text-[#1c1c1c]")}>
              {isFree ? "Gratis" : formattedPrice}
            </span>
          </div>
        </div>

        {/* Add button */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onAdd}
            disabled={adding || disabled}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] transition-colors",
              adding
                ? "cursor-wait bg-[#f3f4f6] text-[#9ca3af]"
                : disabled
                  ? "cursor-not-allowed bg-[#f3f4f6] text-[#9ca3af]"
                  : "bg-gold text-[#1c1c1c] hover:bg-dark hover:text-gold",
            )}
          >
            {adding ? <><SpinnerIcon size={12} /> Menambahkan...</> : <><PlusIcon /> Tambah</>}
          </button>
        </div>
      </div>
    </article>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3">
      <span className="mt-[2px] shrink-0 text-red-500"><WarningIcon /></span>
      <p className="font-body text-[13px] leading-[18px] text-red-600">{message}</p>
    </div>
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function PhaseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinnerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
