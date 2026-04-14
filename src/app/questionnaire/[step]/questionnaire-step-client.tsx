"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { OptionCard } from "@/components/questionnaire/OptionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { QUESTIONNAIRE_QUESTIONS } from "@/lib/questionnaire-data";
import { primaryGoldCtaClassSoftDisabled } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";
import { loadAnswers, saveAnswer } from "@/lib/questionnaire-storage";

type Props = {
  step: number;
};

export function QuestionnaireStepClient({ step }: Props) {
  const router = useRouter();
  const total = QUESTIONNAIRE_QUESTIONS.length;
  const question = QUESTIONNAIRE_QUESTIONS[step - 1];
  const stepKey = String(step);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return loadAnswers()[stepKey] ?? null;
  });

  const onSelect = useCallback(
    (optionId: string) => {
      setSelectedId(optionId);
      saveAnswer(stepKey, optionId);
    },
    [stepKey],
  );

  const canGoNext = Boolean(selectedId);

  const handleNext = () => {
    if (!canGoNext) return;
    if (step >= total) {
      router.push("/");
 return;
    }
    router.push(`/questionnaire/${step + 1}`);
  };

  const handlePrev = () => {
    if (step <= 1) return;
    router.push(`/questionnaire/${step - 1}`);
  };

  const options = useMemo(() => question?.options ?? [], [question]);

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
                {question.prompt}
              </h1>

              <div className="flex flex-col gap-3">
                {options.map((opt) => (
                  <OptionCard
                    key={opt.id}
                    label={opt.label}
                    selected={selectedId === opt.id}
                    onSelect={() => onSelect(opt.id)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step <= 1}
                className="px-6 py-3 font-body text-sm font-bold uppercase tracking-wide text-[#6b7280] disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className={cn(
                  primaryGoldCtaClassSoftDisabled(),
                  "rounded px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest shadow-sm",
                )}
              >
                {step >= total ? "Selesai" : "Pertanyaan berikutnya"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
