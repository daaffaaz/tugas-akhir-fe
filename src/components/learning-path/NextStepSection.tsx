"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getNextStepRecommendations,
  generateLearningPathFromCareer,
} from "@/lib/api/recommendations";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { GlobalProgressResponse } from "@/types/rag";
import type { NextStepsResponse } from "@/types/recommendations";
import { CareerPossibilityCard } from "./CareerPossibilityCard";
import { toast } from "@/context/ToastContext";

type Props = {
  globalProgress: GlobalProgressResponse | null | undefined;
};

export function NextStepSection({ globalProgress }: Props) {
  const router = useRouter();
  const [data, setData] = useState<NextStepsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingRole, setGeneratingRole] = useState<string | null>(null);

  const shouldFetch =
    globalProgress !== null &&
    globalProgress !== undefined &&
    globalProgress.total_completed_courses > 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let cancelled = false;
    setLoading(true);
    getNextStepRecommendations()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // QuestionnaireRequiredError: parent sudah guard di tempat lain,
        // silent hide seperti BadgeStrip pattern.
        if (err instanceof QuestionnaireRequiredError) {
          setLoading(false);
          return;
        }
        // Best-effort feature: error lain silent hide, no error UI.
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [shouldFetch]);

  async function handleGenerate(
    careerFocus: string,
    basedOnCourses: string[],
  ) {
    setGeneratingRole(careerFocus);
    try {
      const res = await generateLearningPathFromCareer({
        career_focus: careerFocus,
        based_on_courses: basedOnCourses,
      });
      router.push(`/learning-path/${res.id}/modify`);
    } catch (err) {
      if (err instanceof QuestionnaireRequiredError) {
        // Child component tanpa guard state — hard redirect (MyBadgesSection pattern)
        window.location.href = "/questionnaire";
        return;
      }
      toast.error("Gagal membuat jalur belajar. Silakan coba lagi.");
    } finally {
      setGeneratingRole(null);
    }
  }

  // Hide kalau user belum punya completed course.
  if (!shouldFetch) {
    return null;
  }

  // Loading skeleton — match final layout
  if (loading) {
    return (
      <section
        aria-busy="true"
        className="mt-12 space-y-4"
      >
        <div>
          <div className="h-7 w-48 animate-pulse rounded bg-[#e5e7eb]" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-[#f3f4f6]" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-white" />
          <div className="h-64 animate-pulse rounded-xl bg-white" />
        </div>
      </section>
    );
  }

  // Empty state dari BE — section hidden
  if (!data || data.career_possibilities.length === 0) {
    return null;
  }

  const completedCount = data.based_on.completed_courses.length;
  const basedOnCourseIds = data.based_on.completed_courses
    .map((c) => c.course_id)
    .filter((id): id is string => Boolean(id));

  return (
    <section className="mt-12 space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#1c1c1c]">
          Rekomendasi Lanjutan
        </h2>
        <p className="font-body text-sm text-[#6b7280]">
          Berdasarkan {completedCount} course yang sudah kamu selesaikan, ini
          beberapa jalur karier yang bisa kamu eksplorasi:
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.career_possibilities.map((cp) => (
          <CareerPossibilityCard
            key={cp.role}
            career={cp}
            isGenerating={generatingRole === cp.role}
            onGenerate={() => handleGenerate(cp.role, basedOnCourseIds)}
          />
        ))}
      </div>
    </section>
  );
}
