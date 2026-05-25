"use client";

import { useState, useCallback } from "react";
import { postRecommend, patchRecommendation } from "@/lib/api/rag";
import { toast } from "@/context/ToastContext";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { CourseRecommendation } from "@/types/rag";

const DEFAULT_COUNT = 5;

export function useCourseRecommendation() {
  const [topic, setTopic] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [topSimilarityScore, setTopSimilarityScore] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  /** Fresh recommendation — topic required, context optional */
  const generate = useCallback(
    async (t: string, ctx?: string) => {
      if (t.trim().length < 3) {
        setError("Topik minimal 3 karakter.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await postRecommend({
          topic: t,
          additional_context: ctx || undefined,
          count,
        });
        setRecommendations(res.recommendations ?? []);
        setRegenerateCount(res.regenerate_count ?? 0);
        setTopSimilarityScore(res.top_similarity_score ?? 0);
        setHasGenerated(true);
        setAdditionalContext("");
      } catch (err) {
        if (err instanceof QuestionnaireRequiredError) throw err;
        setError(err instanceof Error ? err.message : "Gagal generate rekomendasi.");
      } finally {
        setIsLoading(false);
      }
    },
    [count],
  );

  /** Regenerate — additional_context is REQUIRED */
  const regenerate = useCallback(
    async (t: string, ctx: string) => {
      if (!ctx.trim()) {
        setError("Konteks tambahan WAJIB diisi saat regenerate.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await postRecommend({
          topic: t,
          additional_context: ctx,
          count,
          regenerate: true,
        });
        setRecommendations(res.recommendations ?? []);
        setRegenerateCount(res.regenerate_count ?? 0);
        setTopSimilarityScore(res.top_similarity_score ?? 0);
        setAdditionalContext("");
      } catch (err) {
        if (err instanceof QuestionnaireRequiredError) throw err;
        setError(err instanceof Error ? err.message : "Gagal regenerate rekomendasi.");
      } finally {
        setIsLoading(false);
      }
    },
    [count],
  );

  /** Toggle saved/bookmark status */
  const toggleSaved = useCallback(async (recId: string) => {
    let prevSaved: boolean | null = null;
    setRecommendations((prev) => {
      const rec = prev.find((r) => r.id === recId);
      if (!rec) return prev;
      prevSaved = rec.is_saved;
      return prev.map((r) =>
        r.id === recId ? { ...r, is_saved: !r.is_saved } : r,
      );
    });
    if (prevSaved === null) return;
    try {
      const updated = await patchRecommendation(recId, !prevSaved);
      setRecommendations((prev) =>
        prev.map((r) =>
          r.id === recId ? { ...r, is_saved: updated.is_saved } : r,
        ),
      );
    } catch (err) {
      setRecommendations((prev) =>
        prev.map((r) =>
          r.id === recId ? { ...r, is_saved: prevSaved! } : r,
        ),
      );
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan rekomendasi.",
      );
    }
  }, []);

  const reset = useCallback(() => {
    setTopic("");
    setAdditionalContext("");
    setRecommendations([]);
    setError(null);
    setRegenerateCount(0);
    setTopSimilarityScore(0);
    setHasGenerated(false);
  }, []);

  return {
    topic,
    setTopic,
    additionalContext,
    setAdditionalContext,
    count,
    setCount,
    recommendations,
    isLoading,
    error,
    regenerateCount,
    topSimilarityScore,
    hasGenerated,
    generate,
    regenerate,
    toggleSaved,
    reset,
  };
}