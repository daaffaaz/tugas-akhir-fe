import { AppBar } from "@/components/layout/AppBar";
import { Footer } from "@/components/layout/Footer";
import { getQuestions } from "@/lib/api/questionnaire";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const questions = await getQuestions();
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <ProfileForm questions={questions} />
      <Footer />
    </div>
  );
}
