import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="grid min-h-screen md:grid-cols-2">
        <LoginForm />
        <div className="hidden min-h-screen md:block md:h-full">
          <AuthBrandPanel variant="login" badgeLabel="Sign in" />
        </div>
      </div>
    </div>
  );
}
