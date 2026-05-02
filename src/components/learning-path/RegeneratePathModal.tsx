"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { regenerateLearningPath } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

interface Props {
  open: boolean;
  onClose: () => void;
  pathId: string;
  title: string;
  onRegenerated: () => void;
}

export function RegeneratePathModal({
  open,
  onClose,
  pathId,
  title,
  onRegenerated,
}: Props) {
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegenerate() {
    setLoading(true);
    setError(null);
    try {
      await regenerateLearningPath(pathId, {
        additional_context: context || undefined,
      });
      onRegenerated();
      onClose();
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        onClose();
        window.location.href = "/questionnaire";
        return;
      }
      setError(err instanceof Error ? err.message : "Gagal regenerate learning path.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setContext("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="w-[min(500px,95vw)] rounded-2xl bg-white p-6 font-body text-dark">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshIcon />
            <h2 className="font-heading text-xl font-extrabold text-dark">
              Regenerate Learning Path
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

        <p className="mb-4 font-body text-sm leading-relaxed text-[#4b5563]">
          Regenerate akan membuat ulang seluruh path berdasarkan topik yang sama,
          dengan mempertimbangkan konteks baru.
        </p>

        {/* Warning box */}
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-yellow-700">
            ⚠️ Catatan
          </p>
          <ul className="space-y-1 text-xs text-yellow-700">
            <li>• Courses yang sudah ditandai &ldquo;completed&rdquo; akan DIPERTAHANKAN</li>
            <li>• Courses lain akan di-regenerate</li>
            <li>• Regen count akan naik +1</li>
          </ul>
        </div>

        {/* Title being regenerated */}
        <div className="mb-4">
          <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-[#6b7280]">
            Topik
          </p>
          <p className="font-bold text-dark">{title}</p>
        </div>

        {/* Context textarea */}
        <div className="mb-5 space-y-1.5">
          <label className="text-sm font-bold text-[#1c1c1c]">
            Konteks tambahan{" "}
            <span className="font-normal text-[#9ca3af]">(opsional)</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="saya mau yang lebih fokus ke hands-on practice dan kurang teori..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-[#f7f7f7] px-4 py-3 text-sm placeholder:text-[#c4c7c5] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 font-heading text-sm font-bold text-[#6b7280] hover:bg-[#f9fafb]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={loading}
            className={cn(
              primaryGoldCtaClass(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-heading text-sm font-bold",
              ),
              loading && "cursor-wait opacity-70",
            )}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshIcon />
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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