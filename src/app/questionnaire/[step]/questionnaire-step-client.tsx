"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { ApiError } from "@/lib/api/client";
import type { ApiQuestion } from "@/lib/api/questionnaire";
import { submitQuestionnaire } from "@/lib/api/questionnaire";
import { primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";
import {
  buildSubmissionPayload,
  clearAnswers,
  loadAnswers,
  saveAnswer,
} from "@/lib/questionnaire-storage";
import { cn } from "@/lib/utils";

type Props = {
  step: number;
  questions: ApiQuestion[];
};

export function QuestionnaireStepClient({ step, questions }: Props) {
  const router = useRouter();
  const total = questions.length;
  const question = questions[step - 1];

  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return loadAnswers()[question.id] ?? null;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSelect = useCallback(
    (optionKey: string) => {
      setSelectedKey(optionKey);
      saveAnswer(question.id, optionKey);
    },
    [question.id],
  );

  const canGoNext = Boolean(selectedKey);

  const handleNext = async () => {
    if (!canGoNext) return;

    if (step >= total) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const payload = buildSubmissionPayload(questions);
        await submitQuestionnaire(payload);
        clearAnswers();
        router.push("/");
      } catch (err) {
        setSubmitError(
          err instanceof ApiError
            ? err.message
            : "Terjadi kesalahan. Silakan coba lagi.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    router.push(`/questionnaire/${step + 1}`);
  };

  const handlePrev = () => {
    if (step <= 1) return;
    router.push(`/questionnaire/${step - 1}`);
  };

  const options = useMemo(
    () =>
      Object.entries(question.options_json).map(([key, label]) => ({
        key,
        label,
      })),
    [question.options_json],
  );

  if (!question) return null;

  return (
    <div className="min-h-screen bg-grey-bg">
      <AppBar />
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 md:px-8">
        <div className="relative w-full max-w-2xl rounded bg-white p-8 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.05)] md:p-12">
          <div className="flex flex-col gap-12">
            <ProgressBar current={step} total={total} />

            <div className="flex flex-col gap-8">
              <h1 className="text-center font-heading text-2xl font-extrabold leading-9 text-[#111827] md:text-[30px]">
                {question.question_text}
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
                disabled={step <= 1 || isSubmitting}
                className="px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-[#6b7280] disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext || isSubmitting}
                className={cn(
                  primaryGoldCtaClassSoftDisabled(),
                  "rounded px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest shadow-sm",
                )}
              >
                {isSubmitting
                  ? "Menyimpan…"
                  : step >= total
                    ? "Selesai"
                    : "Pertanyaan berikutnya"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
