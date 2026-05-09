"use client";

import { useState, useEffect, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { getLearningPathList, getGlobalProgress } from "@/lib/api/rag";
import type { LearningPathListItem, GlobalProgressResponse } from "@/types/rag";
import { LearningPathView } from "./learning-path-view";

export default function LearningPathPage() {
  const [paths, setPaths] = useState<LearningPathListItem[]>([]);
  const [globalProgress, setGlobalProgress] = useState<GlobalProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaths = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listData, progressData] = await Promise.allSettled([
        getLearningPathList(),
        getGlobalProgress(),
      ]);

      if (listData.status === "fulfilled") {
        setPaths(listData.value.results);
      } else {
        throw listData.reason;
      }

      if (progressData.status === "fulfilled") {
        setGlobalProgress(progressData.value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat learning path.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-body text-dark">
      <AppBar />
      <LearningPathView
        paths={paths}
        globalProgress={globalProgress}
        loading={loading}
        error={error}
        onRetry={loadPaths}
      />
    </div>
  );
}