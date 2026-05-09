"use client";

import { useState, useEffect, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { getLearningPathList } from "@/lib/api/rag";
import type { LearningPathListItem } from "@/types/rag";
import { LearningPathView } from "./learning-path-view";

export default function LearningPathPage() {
  const [paths, setPaths] = useState<LearningPathListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaths = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLearningPathList();
      setPaths(data.results);
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
        loading={loading}
        error={error}
        onRetry={loadPaths}
      />
    </div>
  );
}