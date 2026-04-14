import { notFound } from "next/navigation";
import { getQuestions } from "@/lib/api/questionnaire";
import { QuestionnaireStepClient } from "./questionnaire-step-client";

type PageProps = {
  params: Promise<{ step: string }>;
};

export default async function QuestionnaireStepPage({ params }: PageProps) {
  const { step: stepParam } = await params;
  const step = Number.parseInt(stepParam, 10);

  const questions = await getQuestions();

  if (
    Number.isNaN(step) ||
    step < 1 ||
    step > questions.length ||
    String(step) !== stepParam
  ) {
    notFound();
  }

  return <QuestionnaireStepClient key={step} step={step} questions={questions} />;
}
