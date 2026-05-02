"use client";

interface LoadingStateProps {
  steps?: string[];
  currentStep?: number;
}

const DEFAULT_STEPS = [
  "Searching courses...",
  "Analyzing your profile...",
  "Matching with best courses...",
  "Generating AI explanations...",
  "Finalizing results...",
];

export function LoadingState({
  steps = DEFAULT_STEPS,
  currentStep = 0,
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="size-16 animate-spin rounded-full border-4 border-[#e5e7eb]" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-gold" />
      </div>

      <h3 className="mb-1 font-heading text-lg font-bold text-[#1c1c1c]">
        Generating...
      </h3>
      <p className="mb-6 font-body text-sm text-[#6b7280]">
        Please wait while AI analyzes your request
      </p>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`size-5 shrink-0 rounded-full flex items-center justify-center text-xs font-bold
                  ${isDone ? "bg-gold text-[#121212]" : isActive ? "bg-[#1c1c1c] text-gold animate-pulse" : "bg-[#e5e7eb] text-[#9ca3af]"}`}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`font-body text-sm ${isActive ? "font-bold text-[#1c1c1c]" : isDone ? "text-[#6b7280] line-through" : "text-[#9ca3af]"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}