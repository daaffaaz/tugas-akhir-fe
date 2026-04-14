import { AppBar } from "@/components/layout/AppBar";
import {
  getLearningPathStats,
  getLearningPaths,
} from "@/lib/api/learning-path";
import { LearningPathView } from "./learning-path-view";

type SearchParams = Promise<{ empty?: string }>;

export default async function LearningPathPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const forceEmpty = sp.empty === "1";

  const [paths, stats] = await Promise.all([
    forceEmpty ? Promise.resolve([]) : getLearningPaths(),
    forceEmpty
      ? Promise.resolve({ activePaths: 0, overallProgressPercent: 0 })
      : getLearningPathStats(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-body text-dark">
      <AppBar />
      <LearningPathView paths={paths} stats={stats} />
    </div>
  );
}
