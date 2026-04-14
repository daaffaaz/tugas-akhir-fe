import { AppBar } from "@/components/layout/AppBar";
import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] font-body text-dark">
      <AppBar />
      <ProfileForm />
    </div>
  );
}
