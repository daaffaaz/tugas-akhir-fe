import { AppBar } from "@/components/layout/AppBar";
import { getQuestions } from "@/lib/api/questionnaire";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const questions = await getQuestions();
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <ProfileForm questions={questions} />
    </div>
  );
}
