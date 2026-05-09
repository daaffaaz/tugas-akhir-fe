import { ModifyPathClient } from "./modify-path-client";

type Props = { params: Promise<{ id: string }> };

export default async function ModifyLearningPathPage({ params }: Props) {
  const { id } = await params;
  return <ModifyPathClient pathId={id} />;
}
