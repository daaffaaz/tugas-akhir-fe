"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { LevelIndicator } from "@/components/questionnaire/LevelIndicator";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import type { ApiQuestion } from "@/lib/api/questionnaire";
import { computeLevel as computeLevelApi } from "@/lib/api/questionnaire";
import { loadAnswers, saveAnswer } from "@/lib/questionnaire-storage";
import { cn } from "@/lib/utils";

type Props = {
  questions: ApiQuestion[]; // Qa1–Qa3 (3 items)
};

type LevelResult = {
  level: string;
  score: number;
  color: string;
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#22c55e",
  "Lower Intermediate": "#f59e0b",
  Intermediate: "#3b82f6",
  Advanced: "#8b5cf6",
};

export function LevelQuestionnaireClient({ questions }: Props) {
  const router = useRouter();
  const total = questions.length; // 3

  const [subStep, setSubStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = loadAnswers();
    // Find the first unanswered question, default to last
    for (let i = 0; i < total; i++) {
      if (!saved[questions[i]?.id]) return Math.max(0, i);
    }
    return total - 1;
  });

  const question = questions[subStep];

  // Show error state when no questions loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-grey-bg">
        <AppBar />
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <div className="text-center">
            <p className="mb-2 font-heading text-lg font-bold text-red-600">
              Gagal memuat pertanyaan
            </p>
            <p className="font-body text-sm text-gray-500">
              Pastikan backend sudah running dan NEXT_PUBLIC_API_URL sudah benar.
            </p>
            <p className="mt-4 font-body text-xs text-gray-400">
              Halaman akan coba dimuat ulang...
            </p>
          </div>
        </div>
      </div>
    );
  }
  const questionId = question?.id;

  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);
  const [levelLoading, setLevelLoading] = useState(false);

  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    if (typeof window === "undefined" || !questionId) return null;
    return loadAnswers()[questionId] ?? null;
  });

  const onSelect = useCallback(
    async (optionKey: string) => {
      if (!questionId) return;
      setSelectedKey(optionKey);
      saveAnswer(questionId, optionKey);

      // After selecting answer, call BE compute-level if all 3 answered
      if (total === 3) {
        const updatedAnswers = loadAnswers();
        const allAnswered =
          updatedAnswers[questions[0]?.id] &&
          updatedAnswers[questions[1]?.id] &&
          updatedAnswers[questions[2]?.id];
        if (allAnswered) {
          setLevelLoading(true);
          try {
            const payload = questions.map((q) => ({
              question_id: q.id,
              answer_option: updatedAnswers[q.id],
            }));
            const result = await computeLevelApi(payload);
            setLevelResult({
              level: result.level,
              score: result.score,
              color: LEVEL_COLORS[result.level] ?? "#6b7280",
            });
          } catch {
            setLevelResult({
              level: "Intermediate",
              score: 0.5,
              color: "#3b82f6",
            });
          } finally {
            setLevelLoading(false);
          }
        }
      }
    },
    [questionId, total, questions],
  );

  const handleNext = () => {
    if (!selectedKey) return;
    if (subStep < total - 1) {
      setSubStep((s) => s + 1);
    } else {
      router.push("/questionnaire/preferences");
    }
  };

  const handlePrev = () => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else {
      router.push("/questionnaire");
    }
  };

  const options = useMemo(
    () =>
      Object.entries(question?.options_json ?? {}).map(([key, label]) => ({
        key,
        label,
      })),
    [question?.options_json],
  );

  // Level indicator shows after Qa3 is answered
  const showLevelIndicator = subStep === total - 1 && Boolean(selectedKey);

  // Build level result from BE response
  const displayLevel = showLevelIndicator ? levelResult : null;

  return (
    <div className="min-h-screen bg-grey-bg">
      <AppBar />
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 md:px-8">
        <div className="relative w-full max-w-2xl rounded bg-white p-8 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.05)] md:p-12">
          <div className="flex flex-col gap-10">
            <div>
              <p className="mb-1 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
                Tahap 1 — Evaluasi Level
              </p>
              <ProgressBar current={subStep + 1} total={total} />
            </div>

            <div className="flex flex-col gap-8">
              <h1 className="text-center font-heading text-2xl font-extrabold leading-9 text-[#111827] md:text-[30px]">
                {question?.question_text}
              </h1>

              <div className="flex flex-col gap-3">
                {options.map((opt) => (
                  <OptionCard
                    key={opt.key}
                    label={opt.label}
                    selected={selectedKey === opt.key}
                    onSelect={() => onSelect(opt.key)}
                  />
                ))}
              </div>

              {showLevelIndicator && displayLevel && (
                <LevelIndicator
                  label={displayLevel.level}
                  color={displayLevel.color}
                  loading={levelLoading}
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-[#6b7280] hover:text-[#374151]"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedKey}
                className={cn(
                  "rounded px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-widest shadow-sm transition",
                  selectedKey
                    ? "bg-gold text-dark hover:bg-gold/90"
                    : "cursor-not-allowed bg-grey-bg text-[#9ca3af]",
                )}
              >
                {subStep < total - 1
                  ? "Pertanyaan berikutnya"
                  : "Lanjut ke Preferensi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
