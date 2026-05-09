import { AppBar } from "@/components/layout/AppBar";
import { getLearningPathList } from "@/lib/api/rag";
import { LearningPathView } from "./learning-path-view";

type SearchParams = Promise<{ empty?: string }>;

export default async function LearningPathPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const forceEmpty = sp.empty === "1";

  const pathsData = forceEmpty
    ? { results: [], total: 0 }
    : await getLearningPathList();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-body text-dark">
      <AppBar />
      <LearningPathView paths={pathsData.results} />
    </div>
  );
}
