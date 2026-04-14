import { notFound } from "next/navigation";
import { QUESTIONNAIRE_TOTAL } from "@/lib/questionnaire-data";
import { QuestionnaireStepClient } from "./questionnaire-step-client";

type PageProps = {
  params: Promise<{ step: string }>;
};

export default async function QuestionnaireStepPage({ params }: PageProps) {
  const { step: stepParam } = await params;
  const step = Number.parseInt(stepParam, 10);
  if (
    Number.isNaN(step) ||
    step < 1 ||
    step > QUESTIONNAIRE_TOTAL ||
    String(step) !== stepParam
  ) {
    notFound();
  }

  return <QuestionnaireStepClient key={step} step={step} />;
}
