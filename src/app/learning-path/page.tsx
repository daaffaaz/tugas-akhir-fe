import { AppBar } from "@/components/layout/AppBar";
import { getLearningPathList } from "@/lib/api/rag";
import { LearningPathView } from "./learning-path-view";
import type { LearningPathListItem } from "@/types/rag";

type SearchParams = Promise<{ empty?: string }>;

export default async function LearningPathPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const forceEmpty = sp.empty === "1";

  let paths: LearningPathListItem[] = [];
  if (!forceEmpty) {
    try {
      const data = await getLearningPathList();
      paths = data.results;
    } catch {
      paths = [];
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-body text-dark">
      <AppBar />
      <LearningPathView paths={paths} />
    </div>
  );
}
