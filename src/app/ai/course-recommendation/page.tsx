"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppBar } from "@/components/layout/AppBar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TopicInput } from "@/components/ai/TopicInput";
import { ContextTextarea } from "@/components/ai/ContextTextarea";
import { CourseRecommendationCard } from "@/components/ai/CourseRecommendationCard";
import { RegenerateSection } from "@/components/ai/RegenerateSection";
import { EmptyState } from "@/components/ai/EmptyState";
import { QuestionnaireGuard } from "@/components/ai/QuestionnaireGuard";
import { useCourseRecommendation } from "@/hooks/useCourseRecommendation";
import { QuestionnaireRequiredError } from "@/types/rag";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

const COUNT_OPTIONS = [3, 5, 10, 15, 20];

export default function CourseRecommendationPage() {
  return (
    <AuthGuard>
      <PageContent />
    </AuthGuard>
  );
}

function PageContent() {
  const { isLoading: authLoading } = useAuth();
  const [showQuestionnaireGuard, setShowQuestionnaireGuard] = useState(false);

  const {
    topic,
    setTopic,
    additionalContext,
    setAdditionalContext,
    count,
    setCount,
    recommendations,
    isLoading,
    error,
    hasGenerated,
    regenerateCount,
    generate,
    regenerate,
    toggleSaved,
    reset,
  } = useCourseRecommendation();

  const handleGenerate = async () => {
    try {
      await generate(topic, additionalContext || undefined);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        setShowQuestionnaireGuard(true);
        return;
      }
    }
  };

  const handleRegenerate = async () => {
    if (!additionalContext.trim()) return;
    try {
      await regenerate(topic, additionalContext);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        setShowQuestionnaireGuard(true);
        return;
      }
    }
  };

  const topicError = topic.length > 0 && topic.length < 3 ? "Minimal 3 karakter." : null;

  const handleGenerateClick = () => {
    // Debounce: prevent rapid double-click
    if (isLoading) return;
    handleGenerate();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="font-body text-sm text-muted">Memuat…</span>
      </div>
    );
  }

  if (showQuestionnaireGuard) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <AppBar />
        <QuestionnaireGuard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-dark">
      <AppBar />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-dark">
            AI Course Recommendation
          </h1>
          <p className="mt-2 font-body text-base text-muted">
            Dapatkan rekomendasi kursus yang dipersonalisasi berdasarkan profil
            belajar dan minat kamu.
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8 space-y-5 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <TopicInput
            value={topic}
            onChange={setTopic}
            disabled={isLoading}
            error={topicError ?? undefined}
          />

          <ContextTextarea
            value={additionalContext}
            onChange={setAdditionalContext}
            disabled={isLoading}
            placeholder="saya mau career switch ke data analyst, budget Rp 500rb..."
          />

          {/* Count selector */}
          <div className="space-y-1.5">
            <label className="font-heading text-sm font-bold text-[#1c1c1c]">
              Jumlah kursus
            </label>
            <div className="flex flex-wrap gap-2">
              {COUNT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCount(opt)}
                  disabled={isLoading}
                  className={`rounded border px-4 py-2 font-heading text-sm font-bold transition-colors ${
                    count === opt
                      ? "border-gold bg-gold text-[#121212]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-gold hover:text-[#1c1c1c]"
                  } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isLoading || topic.trim().length < 3}
              className={primaryGoldCtaClass(
                "flex items-center gap-2 rounded px-6 py-3 font-heading text-base font-bold",
                (isLoading || topic.trim().length < 3) ? "cursor-not-allowed" : undefined,
              )}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Recommendations
                </>
              )}
            </button>

            {hasGenerated && (
              <button
                type="button"
                onClick={reset}
                className="rounded border border-[#e5e7eb] bg-white px-6 py-3 font-heading text-sm font-bold text-[#6b7280] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Skeleton loading */}
        {isLoading && !hasGenerated && (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-56 rounded-lg bg-[#e5e7eb]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
                  <div className="h-44 w-full bg-[#e5e7eb]" />
                  <div className="p-5 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-20 rounded bg-[#e5e7eb]" />
                      <div className="h-5 w-16 rounded bg-[#e5e7eb]" />
                    </div>
                    <div className="h-5 w-3/4 rounded bg-[#e5e7eb]" />
                    <div className="h-4 w-1/2 rounded bg-[#e5e7eb]" />
                    <div className="h-4 w-1/3 rounded bg-[#e5e7eb]" />
                    <div className="mt-4 h-24 rounded-lg bg-[#e5e7eb]" />
                    <div className="flex gap-2">
                      <div className="h-10 w-28 rounded-lg bg-[#e5e7eb]" />
                      <div className="h-10 flex-1 rounded-lg bg-[#e5e7eb]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasGenerated && recommendations.length > 0 && (
          <div className="space-y-6">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-dark">
                {recommendations.length} Rekomendasi Kursus
              </h2>
              {regenerateCount > 0 && (
                <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-bold text-[#6b7280]">
                  Regenerated {regenerateCount}x
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {recommendations.map((rec) => (
                <CourseRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onSaveToggle={toggleSaved}
                  regenerateCount={rec.regenerate_count}
                />
              ))}
            </div>

            {/* Regenerate section */}
            <RegenerateSection
              contextValue={additionalContext}
              onContextChange={setAdditionalContext}
              onRegenerate={handleRegenerate}
              disabled={isLoading}
              error={null}
            />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && hasGenerated && recommendations.length === 0 && (
          <EmptyState topic={topic} onTryAgain={reset} />
        )}
      </main>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function SparklesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}