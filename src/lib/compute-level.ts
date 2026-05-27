export type LevelResult = {
  label: string;
  color: string;
};

const SCORES = {
  programming_familiarity: {
    A: 0.0,
    B: 0.25,
    C: 0.55,
    D: 1.0,
  },
  domain_comfort: {
    A: 0.0,
    B: 0.25,
    C: 0.40,
    D: 0.70,
    E: 1.0,
  },
  formal_preparation: {
    A: 0.0,
    B: 0.35,
    C: 0.60,
    D: 1.0,
  },
} as const;

export function computeLevel(signalAnswers: {
  programming_familiarity?: string;
  domain_comfort?: string;
  formal_preparation?: string;
}): LevelResult {
  const pf =
    SCORES.programming_familiarity[
      signalAnswers.programming_familiarity as keyof typeof SCORES.programming_familiarity
    ] ?? 0;
  const dc =
    SCORES.domain_comfort[
      signalAnswers.domain_comfort as keyof typeof SCORES.domain_comfort
    ] ?? 0;
  const fp =
    SCORES.formal_preparation[
      signalAnswers.formal_preparation as keyof typeof SCORES.formal_preparation
    ] ?? 0;

  const score = pf * 0.35 + dc * 0.4 + fp * 0.25;

  if (score <= 0.35) return { label: "Beginner", color: "#22c55e" };
  if (score <= 0.55) return { label: "Lower Intermediate", color: "#f59e0b" };
  if (score <= 0.75) return { label: "Intermediate", color: "#3b82f6" };
  return { label: "Advanced", color: "#8b5cf6" };
}
