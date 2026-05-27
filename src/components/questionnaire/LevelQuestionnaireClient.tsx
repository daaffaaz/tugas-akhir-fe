"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { LevelIndicator } from "@/components/questionnaire/LevelIndicator";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import type { ApiQuestion } from "@/lib/api/questionnaire";
import { computeLevel } from "@/lib/compute-level";
import { loadAnswers, saveAnswer } from "@/lib/questionnaire-storage";
import { cn } from "@/lib/utils";

type Props = {
  questions: ApiQuestion[]; // Qa1–Qa3 (3 items)
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
  const questionId = question?.id;

  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    if (typeof window === "undefined" || !questionId) return null;
    return loadAnswers()[questionId] ?? null;
  });

  const onSelect = useCallback(
    (optionKey: string) => {
      if (!questionId) return;
      setSelectedKey(optionKey);
      saveAnswer(questionId, optionKey);
    },
    [questionId],
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
  const levelResult = showLevelIndicator
    ? computeLevel({
        programming_familiarity: loadAnswers()[questions[0]?.id],
        domain_comfort: loadAnswers()[questions[1]?.id],
        formal_preparation: loadAnswers()[questions[2]?.id],
      })
    : null;

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

              {showLevelIndicator && levelResult && (
                <LevelIndicator
                  label={levelResult.label}
                  color={levelResult.color}
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
