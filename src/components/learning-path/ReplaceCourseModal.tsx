"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import {
  getReplacementCandidates,
  applyCourseReplacement,
  deleteCourseFromPath,
} from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { ReplacementCandidate } from "@/types/rag";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  pathId: string;
  courseId: string;
  courseTitle: string;
  onReplaced: () => void;
  onDeleted: () => void;
}

export function ReplaceCourseModal({
  open,
  onClose,
  pathId,
  courseId,
  courseTitle,
  onReplaced,
  onDeleted,
}: Props) {
  const [context, setContext] = useState("");
  const [candidates, setCandidates] = useState<ReplacementCandidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"search" | "results">("search");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSearch() {
    setLoadingCandidates(true);
    setError(null);
    try {
      const res = await getReplacementCandidates(pathId, courseId, {
        additional_context: context || undefined,
        count: 5,
      });
      setCandidates(res.candidates);
      setStep("results");
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        onClose();
        window.location.href = "/questionnaire";
        return;
      }
      setError(err instanceof Error ? err.message : "Gagal mencari kandidat.");
    } finally {
      setLoadingCandidates(false);
    }
  }

  async function handleSelect(candidate: ReplacementCandidate) {
    setApplyingId(candidate.course_id);
    try {
      await applyCourseReplacement(pathId, courseId, {
        new_course_id: candidate.course_id,
        replacement_reason: context || undefined,
      });
      onReplaced();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal replace course.");
    } finally {
      setApplyingId(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCourseFromPath(pathId, courseId);
      onDeleted();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hapus course.");
      setDeleting(false);
    }
  }

  function handleClose() {
    setContext("");
    setCandidates([]);
    setStep("search");
    setError(null);
    setConfirmDelete(false);
    setDeleting(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      hideTitleRow
      className="max-w-[760px]"
    >
      <div className="font-body text-[#1c1c1c]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#f3f4f6] px-7 pb-5 pt-7">
          <div>
            <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#9ca3af]">
              Replace Course
            </p>
            <h2 className="font-heading text-[22px] font-extrabold leading-tight tracking-tight text-[#1c1c1c]">
              Ganti kursus ini dengan rekomendasi AI
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

        {/* Original course strip */}
        <div className="border-b border-[#f3f4f6] bg-[#fafafa] px-7 py-4">
          <p className="mb-1 font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
            Kursus yang akan diganti
          </p>
          <p className="truncate font-body text-[16px] font-bold text-[#1c1c1c]">
            {courseTitle}
          </p>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-7 py-6">
          {step === "search" ? (
            <>
              {/* Context */}
              <div className="mb-5">
                <label className="mb-2 block font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#1c1c1c]">
                  Konteks Pencarian
                  <span className="ml-2 font-normal normal-case tracking-normal text-[#9ca3af]">
                    (opsional)
                  </span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Misalnya: kursus ini terlalu teori, saya ingin yang lebih praktis dengan project hands-on..."
                  rows={3}
                  className="w-full resize-none rounded border border-[#e5e7eb] bg-white px-4 py-3 font-body text-[14px] text-[#1c1c1c] placeholder:text-[#9ca3af] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>

              {/* Catatan box */}
              <div className="mb-6 rounded border border-[#e5e7eb] bg-[#fff9e6] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <SparkleIcon />
                  <p className="font-heading text-[10px] font-extrabold uppercase tracking-[2px] text-[#1c1c1c]">
                    Cara kerja
                  </p>
                </div>
                <p className="font-body text-[13px] leading-[20px] text-[#1c1c1c]">
                  AI akan mencari 5 kursus alternatif yang relevan dengan fase
                  pembelajaran Anda. Konteks tambahan membantu menemukan
                  pengganti yang lebih sesuai dengan preferensi.
                </p>
              </div>

              {error && <ErrorBox message={error} />}

              {/* Action row */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={loadingCandidates || deleting}
                  className="flex items-center justify-center gap-2 rounded border border-red-200 bg-white px-5 py-[13px] font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-red-500 transition-colors hover:border-red-500 hover:bg-red-50 disabled:opacity-50 sm:order-1"
                >
                  <TrashIcon /> Hapus Saja
                </button>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loadingCandidates}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-gold px-5 py-[13px] font-heading text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#1c1c1c] transition-colors hover:bg-dark hover:text-gold disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gold disabled:hover:text-[#1c1c1c] sm:order-2"
                >
                  {loadingCandidates ? (
                    <>
                      <SpinnerIcon /> Mencari kandidat...
                    </>
                  ) : (
                    <>
                      <SearchIcon /> Cari Replacement
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {candidates.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af]">
                    <SearchIcon />
                  </div>
                  <p className="font-body text-[14px] font-bold text-[#1c1c1c]">
                    Tidak ada kandidat ditemukan
                  </p>
                  <p className="max-w-xs font-body text-[13px] text-[#6b7280]">
                    Coba ubah konteks pencarian atau cari ulang dengan kata
                    kunci yang lebih spesifik.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
                      Kandidat Pengganti
                    </p>
                    <span className="rounded bg-[#1c1c1c] px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-white">
                      {candidates.length} hasil
                    </span>
                  </div>
                  {candidates.map((c, i) => (
                    <CandidateCard
                      key={c.course_id}
                      candidate={c}
                      rank={i}
                      applying={applyingId === c.course_id}
                      disabled={applyingId !== null && applyingId !== c.course_id}
                      onSelect={() => handleSelect(c)}
                    />
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-4">
                  <ErrorBox message={error} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer (results step) */}
        {step === "results" && (
          <div className="flex flex-col gap-3 border-t border-[#f3f4f6] bg-[#fafafa] px-7 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setStep("search");
                setCandidates([]);
              }}
              className="flex items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
            >
              <ArrowLeftIcon /> Cari Lagi
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center justify-center gap-2 rounded border border-[#e5e7eb] bg-white px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="mx-7 max-w-md rounded border border-[#e5e7eb] bg-white p-6 shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.1)]">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                <TrashIcon />
              </div>
              <div>
                <p className="mb-1 font-heading text-[16px] font-extrabold text-[#1c1c1c]">
                  Hapus kursus ini?
                </p>
                <p className="font-body text-[13px] leading-[20px] text-[#6b7280]">
                  Kursus akan dihapus permanen dari learning path ini. Aksi ini
                  tidak bisa dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="flex-1 rounded border border-[#e5e7eb] bg-white px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#6b7280] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded bg-red-500 px-4 py-2.5 font-heading text-[11px] font-extrabold uppercase tracking-[1.2px] text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <SpinnerIcon /> Menghapus...
                  </>
                ) : (
                  <>
                    <TrashIcon /> Ya, Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// ─── Candidate Card ──────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  rank,
  applying,
  disabled,
  onSelect,
}: {
  candidate: ReplacementCandidate;
  rank: number;
  applying: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const rankLabel =
    rank === 0 ? "Best Match" : rank === 1 ? "Good Match" : "Alternative";

  const formattedPrice =
    candidate.price != null && candidate.price > 0
      ? candidate.currency === "IDR"
        ? `IDR ${candidate.price.toLocaleString("id-ID")}`
        : `$${candidate.price.toFixed(2)}`
      : null;
  const isFree = candidate.price === 0;

  return (
    <article
      className={cn(
        "rounded border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-shadow",
        rank === 0 && "ring-1 ring-gold/40",
        !disabled && "hover:shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.1)]",
      )}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {/* Thumbnail */}
        {candidate.thumbnail_url ? (
          <div className="aspect-video w-full shrink-0 overflow-hidden rounded bg-[#e5e7eb] sm:aspect-[4/3] sm:w-[160px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={candidate.thumbnail_url}
              alt={candidate.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full shrink-0 rounded bg-[#e5e7eb] sm:aspect-[4/3] sm:w-[160px]" />
        )}

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {/* Top row: rank badge + price */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded px-2 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px]",
                rank === 0
                  ? "bg-gold text-[#1c1c1c]"
                  : "bg-[#f3f4f6] text-[#6b7280]",
              )}
            >
              {rankLabel}
            </span>
            {candidate.level && (
              <span className="rounded border border-[#e5e7eb] bg-white px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">
                {candidate.level}
              </span>
            )}
            {candidate.platform && (
              <span className="rounded border border-[#e5e7eb] bg-white px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#6b7280]">
                {candidate.platform}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-body text-[16px] font-bold leading-[22px] text-[#1c1c1c]">
            {candidate.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {candidate.instructor && (
              <span className="font-body text-[12px] text-[#6b7280]">
                {candidate.instructor}
              </span>
            )}
            {candidate.rating != null && candidate.rating > 0 && (
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="font-heading text-[12px] font-bold text-[#1c1c1c]">
                  {candidate.rating.toFixed(1)}
                </span>
              </div>
            )}
            {candidate.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span className="font-body text-[12px] text-[#6b7280]">
                  {candidate.duration}
                </span>
              </div>
            )}
            {(formattedPrice || isFree) && (
              <span
                className={cn(
                  "font-heading text-[12px] font-bold",
                  isFree ? "text-green-600" : "text-[#1c1c1c]",
                )}
              >
                {isFree ? "Gratis" : formattedPrice}
              </span>
            )}
          </div>

          {/* AI Insight */}
          <div className="rounded-r border-l-4 border-gold bg-[rgba(255,206,0,0.1)] py-3 pl-4 pr-3">
            <div className="mb-1.5 flex items-center gap-2">
              <SparkleIcon />
              <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-[#1c1c1c]">
                AI Insight
              </span>
            </div>
            <p className="font-body text-[13px] leading-[20px] text-[#1c1c1c]">
              {candidate.match_reason}
            </p>
            {candidate.best_for && (
              <p className="mt-2 font-body text-[12px] leading-[18px] text-[#374151]">
                <span className="font-bold">Best for: </span>
                {candidate.best_for}
              </p>
            )}
            {candidate.potential_concerns && (
              <div className="mt-2 flex items-start gap-1.5 rounded bg-amber-100/60 px-2 py-1.5">
                <span className="mt-[1px] shrink-0 text-amber-700">
                  <WarningIcon />
                </span>
                <p className="font-body text-[12px] italic leading-[18px] text-amber-800">
                  {candidate.potential_concerns}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {candidate.url && (
              <a
                href={candidate.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-3 py-2 font-body text-[12px] font-bold text-[#6b7280] transition-colors hover:border-[#9ca3af] hover:text-[#1c1c1c]"
              >
                <ExternalLinkIcon /> Lihat di Platform
              </a>
            )}
            <button
              type="button"
              onClick={onSelect}
              disabled={applying || disabled}
              className={cn(
                "ml-auto flex items-center justify-center gap-2 rounded px-4 py-2 font-heading text-[12px] font-extrabold uppercase tracking-[1.2px] transition-colors",
                applying
                  ? "cursor-wait bg-[#f3f4f6] text-[#9ca3af]"
                  : disabled
                    ? "cursor-not-allowed bg-[#f3f4f6] text-[#9ca3af]"
                    : "bg-gold text-[#1c1c1c] hover:bg-dark hover:text-gold",
              )}
            >
              {applying ? (
                <>
                  <SpinnerIcon /> Menerapkan...
                </>
              ) : (
                <>
                  <CheckIcon /> Pilih Pengganti
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3">
      <span className="mt-[2px] shrink-0 text-red-500">
        <WarningIcon />
      </span>
      <p className="font-body text-[13px] leading-[18px] text-red-600">
        {message}
      </p>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function SpinnerIcon() {
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
      className="animate-spin"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="#f59e0b"
      stroke="#f59e0b"
      strokeWidth="0.5"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1c"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CheckIcon() {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
