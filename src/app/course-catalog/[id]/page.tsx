import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { CourseDetailClient } from "./course-detail-client";

type Props = { params: Promise<{ id: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <CourseDetailClient courseId={id} />
      <Footer />
    </div>
  );
}