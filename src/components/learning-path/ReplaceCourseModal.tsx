"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { getReplacementCandidates, applyCourseReplacement } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { ReplaceCourseResponse, ReplacementCandidate } from "@/types/rag";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

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
        // Redirect to questionnaire
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
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal replace course.");
    } finally {
      setApplyingId(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Hapus course ini dari learning path?")) return;
    setDeleting(true);
    try {
      await applyCourseReplacement(pathId, courseId, { action: "delete" });
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hapus course.");
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    setContext("");
    setCandidates([]);
    setStep("search");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="w-[min(560px,95vw)] rounded-2xl bg-white p-6 font-body text-dark">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshIcon />
            <h2 className="font-heading text-xl font-extrabold text-dark">
              Replace Course
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

        {step === "search" ? (
          <>
            <p className="mb-1 text-sm text-[#6b7280]">Mengganti:</p>
            <p className="mb-4 font-bold text-dark">{courseTitle}</p>

            <div className="mb-4 space-y-1.5">
              <label className="text-sm font-bold text-[#1c1c1c]">
                Kenapa mau ganti?{" "}
                <span className="font-normal text-[#9ca3af]">(opsional)</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="terlalu panjang dan teori, saya mau yang lebih practical..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-[#f7f7f7] px-4 py-3 text-sm placeholder:text-[#c4c7c5] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loadingCandidates}
                className={primaryGoldCtaClass(
                  "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-heading text-base font-bold",
                )}
              >
                {loadingCandidates ? (
                  <>
                    <SpinnerIcon />
                    Mencari kandidat...
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Cari Replacement
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-6 py-3.5 font-heading text-sm font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                <TrashIcon />
                Hapus Course Ini
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-1 text-sm text-[#6b7280]">Mengganti:</p>
            <p className="mb-4 font-bold text-dark">{courseTitle}</p>

            {candidates.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#9ca3af]">
                Tidak ada kandidat pengganti ditemukan.
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Replacement Candidates
                </p>
                {candidates.map((c, i) => (
                  <CandidateCard
                    key={c.course_id}
                    candidate={c}
                    rank={i}
                    applying={applyingId === c.course_id}
                    onSelect={() => handleSelect(c)}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("search")}
                className="flex-1 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 font-heading text-sm font-bold text-[#6b7280] hover:bg-[#f9fafb]"
              >
                &larr; Cari Lagi
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 font-heading text-sm font-bold text-[#6b7280] hover:bg-[#f9fafb]"
              >
                Batal
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

// ─── Candidate Card ──────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  rank,
  applying,
  onSelect,
}: {
  candidate: ReplacementCandidate;
  rank: number;
  applying: boolean;
  onSelect: () => void;
}) {
  const rankLabel =
    rank === 0 ? "Best Match" : rank === 1 ? "Good Match" : "Alternative";
  const rankColor =
    rank === 0 ? "bg-gold text-[#121212]" : "bg-[#e5e7eb] text-[#6b7280]";

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", rankColor)}>
          {rankLabel}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-[#6b7280]">
          <StarIcon /> {candidate.rating?.toFixed(1) ?? "—"}
        </span>
      </div>

      <h3 className="mb-1 font-heading text-sm font-bold text-dark">{candidate.title}</h3>
      <p className="mb-2 text-xs text-[#6b7280]">
        {candidate.instructor} &bull; {candidate.platform} &bull; {candidate.level} &bull; {candidate.duration}
      </p>

      {candidate.price != null && candidate.price > 0 && (
        <p className="mb-3 text-xs font-bold text-[#1c1c1c]">
          💰 {candidate.currency}{" "}
          {candidate.currency === "IDR"
            ? candidate.price.toLocaleString("id-ID")
            : candidate.price.toFixed(2)}
        </p>
      )}

      {/* AI explanation */}
      <div className="rounded border-l-4 border-gold bg-gold-light/30 px-3 py-2">
        <div className="mb-1 flex items-center gap-1">
          <LightbulbIcon />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121212]">AI Reason</span>
        </div>
        <p className="mb-1.5 text-xs leading-relaxed text-[#121212]">{candidate.match_reason}</p>
        <p className="mb-1 text-xs font-bold text-[#374151]">
          Best for: {candidate.best_for}
        </p>
        {candidate.potential_concerns && (
          <p className="text-xs italic text-[#92400e]">
            ⚠️ {candidate.potential_concerns}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={applying}
        className={cn(
          "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-heading text-sm font-bold transition-colors",
          applying
            ? "cursor-wait border border-[#e5e7eb] bg-[#f3f4f6] text-[#9ca3af]"
            : primaryGoldCtaClass("rounded-lg"),
        )}
      >
        {applying ? (
          <>
            <SpinnerIcon />
            Applying...
          </>
        ) : (
          "Select This Replacement"
        )}
      </button>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function RefreshIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
    </svg>
  );
}