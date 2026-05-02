"use client";

import { useState, useCallback } from "react";
import { postGenerateRoadmap } from "@/lib/api/rag";
import { QuestionnaireRequiredError } from "@/types/rag";
import type { RagLearningPathResponse } from "@/types/rag";

const DEFAULT_COUNT = 15;

export function useLearningPath() {
  const [topic, setTopic] = useState("");
  const [count] = useState(DEFAULT_COUNT);
  const [learningPath, setLearningPath] = useState<RagLearningPathResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (t: string) => {
      if (t.trim().length < 3) {
        setError("Topik minimal 3 karakter.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await postGenerateRoadmap({ topic: t, count });
        setLearningPath(res);
      } catch (err) {
        if (err instanceof QuestionnaireRequiredError) throw err;
        setError(
          err instanceof Error ? err.message : "Gagal generate learning path."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [count],
  );

  const reset = useCallback(() => {
    setTopic("");
    setLearningPath(null);
    setError(null);
  }, []);

  return {
    topic,
    setTopic,
    count,
    learningPath,
    isLoading,
    error,
    generate,
    reset,
  };
}