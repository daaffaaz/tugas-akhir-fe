"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import type { ApiQuestion } from "@/lib/api/questionnaire";
import { submitQuestionnaire } from "@/lib/api/questionnaire";
import { buildSubmissionPayload, clearAnswers, loadAnswers, saveAnswer } from "@/lib/questionnaire-storage";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

type Props = {
  questions: ApiQuestion[]; // Qa4–Qa9 (6 items)
  levelQuestions: ApiQuestion[]; // Qa1–Qa3 (3 items, for submit payload)
};

export function PreferencesQuestionnaireClient({
  questions,
  levelQuestions,
}: Props) {
  const router = useRouter();
  const total = questions.length; // 6

  const [subStep, setSubStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = loadAnswers();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSelect = useCallback(
    (optionKey: string) => {
      if (!questionId) return;
      setSelectedKey(optionKey);
      saveAnswer(questionId, optionKey);
    },
    [questionId],
  );

  const handleNext = async () => {
    if (!selectedKey) return;
    if (subStep < total - 1) {
      setSubStep((s) => s + 1);
    } else {
      // Submit: include all 9 questions (level + preferences)
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const allQuestions = [...levelQuestions, ...questions];
        const payload = buildSubmissionPayload(allQuestions);
        await submitQuestionnaire(payload);
        clearAnswers();
        router.push("/questionnaire/completion");
      } catch {
        setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else {
      router.push("/questionnaire/level");
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

  return (
    <div className="min-h-screen bg-grey-bg">
      <AppBar />
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 md:px-8">
        <div className="relative w-full max-w-2xl rounded bg-white p-8 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.05)] md:p-12">
          <div className="flex flex-col gap-10">
            <div>
              <p className="mb-1 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
                Tahap 2 — Preferensi & Tujuan
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
            </div>

            {submitError && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
                {submitError}
              </div>
            )}

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
                disabled={!selectedKey || isSubmitting}
                className={cn(
                  "rounded px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-widest shadow-sm transition",
                  selectedKey && !isSubmitting
                    ? "bg-gold text-dark hover:bg-gold/90"
                    : "cursor-not-allowed bg-grey-bg text-[#9ca3af]",
                )}
              >
                {isSubmitting
                  ? "Menyimpan…"
                  : subStep < total - 1
                    ? "Pertanyaan berikutnya"
                    : "Selesai"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}