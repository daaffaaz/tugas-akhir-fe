import { AuthGuard } from "@/components/auth/AuthGuard";

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
