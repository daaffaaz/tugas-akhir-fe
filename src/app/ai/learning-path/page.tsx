"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TopicInput } from "@/components/ai/TopicInput";
import { PhaseCard } from "@/components/ai/PhaseCard";
import { LoadingState } from "@/components/ai/LoadingState";
import { EmptyState } from "@/components/ai/EmptyState";
import { QuestionnaireGuard } from "@/components/ai/QuestionnaireGuard";
import { useLearningPath } from "@/hooks/useLearningPath";
import { QuestionnaireRequiredError } from "@/types/rag";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

export default function LearningPathPage() {
  return (
    <AuthGuard>
      <PageContent />
    </AuthGuard>
  );
}

function PageContent() {
  const [showQuestionnaireGuard, setShowQuestionnaireGuard] = useState(false);

  const { topic, setTopic, learningPath, isLoading, error, generate, reset } =
    useLearningPath();

  const handleGenerate = async () => {
    try {
      await generate(topic);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        setShowQuestionnaireGuard(true);
        return;
      }
    }
  };

  const topicError =
    topic.length > 0 && topic.length < 3 ? "Minimal 3 karakter." : null;

  const phases = learningPath?.questionnaire_snapshot?.phases ?? [];
  const totalWeeks = learningPath?.questionnaire_snapshot?.total_duration_weeks ?? 0;
  const totalHours = learningPath?.questionnaire_snapshot?.total_hours_estimated ?? 0;
  const targetSkills = learningPath?.questionnaire_snapshot?.target_skills ?? [];
  const overview = learningPath?.questionnaire_snapshot?.overview ?? "";
  const tips = learningPath?.questionnaire_snapshot?.tips_for_success ?? [];

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

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-dark">
            AI Learning Path
          </h1>
          <p className="mt-2 font-body text-base text-muted">
            Generate learning path personal dengan fase-fase belajar yang
            terstruktur dan dipersonalisasi untuk kamu.
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8 space-y-5 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <TopicInput
            value={topic}
            onChange={setTopic}
            disabled={isLoading}
            placeholder="web development dari nol"
          />

          {topicError && (
            <p className="text-xs text-red-500">{topicError}</p>
          )}

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
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
                  Generate Learning Path
                </>
              )}
            </button>

            {learningPath && (
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

        {/* Loading */}
        {isLoading && (
          <LoadingState steps={[
            "Searching courses...",
            "Analyzing your profile...",
            "Structuring learning phases...",
            "Generating AI explanations...",
            "Finalizing roadmap...",
          ]} />
        )}

        {/* Results */}
        {!isLoading && learningPath && (
          <div className="space-y-8">
            {/* Roadmaps Header */}
            <div className="rounded-xl border border-[#e5e7eb] bg-gradient-to-r from-[#fff9e6] to-white p-6">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <MapPinIcon />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#6b7280]">
                      Learning Path
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-extrabold text-dark">
                    {learningPath.questionnaire_snapshot.roadmap_title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded border border-[#e5e7eb] bg-white px-4 py-2 font-heading text-sm font-bold text-[#6b7280] hover:border-gold hover:text-[#121212]"
                >
                  <ShareIcon />
                </button>
              </div>

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 font-body text-sm text-[#6b7280]">
                  <ClockIcon />
                  <span>~{totalWeeks} weeks</span>
                </div>
                <div className="flex items-center gap-1.5 font-body text-sm text-[#6b7280]">
                  <PlayIcon />
                  <span>~{totalHours} hours estimated</span>
                </div>
                <div className="flex items-center gap-1.5 font-body text-sm text-[#6b7280]">
                  <ChartIcon />
                  <span>{learningPath.questionnaire_snapshot.difficulty_curve}</span>
                </div>
              </div>

              {/* Target skills */}
              {targetSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {targetSkills.map((skill) => (
                    <span key={skill} className="inline-block rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-bold text-[#4b5563]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {overview && (
                <div className="mt-4">
                  <p className="font-body text-sm leading-relaxed text-[#4b5563]">
                    {overview}
                  </p>
                </div>
              )}
            </div>

            {/* Phases */}
            {phases.length > 0 && (
              <div className="space-y-6">
                {phases.map((phase, i) => (
                  <PhaseCard
                    key={phase.phase_number}
                    phase={phase}
                    courses={learningPath.courses}
                    isLast={i === phases.length - 1}
                  />
                ))}
              </div>
            )}

            {/* Tips for success */}
            {tips.length > 0 && (
              <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-6">
                <h3 className="mb-3 font-heading text-base font-bold text-dark">
                  Tips for Success
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                      <span className="mt-1 shrink-0 text-gold">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next steps */}
            {learningPath.questionnaire_snapshot.next_steps_after_roadmap.length > 0 && (
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
                <h3 className="mb-3 font-heading text-base font-bold text-dark">
                  Next Steps After This Roadmap
                </h3>
                <ul className="space-y-2">
                  {learningPath.questionnaire_snapshot.next_steps_after_roadmap.map(
                    (step, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-[#4b5563]">
                        <ArrowRightIcon />
                        {step}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={primaryGoldCtaClass(
                  "flex items-center gap-2 rounded px-6 py-3 font-heading text-sm font-bold",
                )}
              >
                <BookmarkIcon />
                Simpan Learning Path
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded border border-[#e5e7eb] bg-white px-6 py-3 font-heading text-sm font-bold text-[#6b7280] hover:border-[#1c1c1c] hover:text-[#1c1c1c]"
              >
                <ShareIcon />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !learningPath && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#f3f4f6]">
              <MapBigIcon />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-dark">
              Mulai Journey Belajar Kamu
            </h3>
            <p className="max-w-md font-body text-sm text-muted">
              Masukkan topik yang ingin kamu pelajari dan AI akan generate
              learning path yang dipersonalisasi untuk kamu.
            </p>
          </div>
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

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MapBigIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}