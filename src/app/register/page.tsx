import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="hidden min-h-screen md:block md:h-full">
          <AuthBrandPanel variant="register" badgeLabel="Register" />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
