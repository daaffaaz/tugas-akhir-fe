import { getLearningPathDetail } from "@/lib/api/learning-path";
import { ModifyPathClient } from "./modify-path-client";

type Props = { params: Promise<{ id: string }> };

export default async function ModifyLearningPathPage({ params }: Props) {
  const { id } = await params;
  const detail = await getLearningPathDetail(id);
  return <ModifyPathClient initial={detail} />;
}
