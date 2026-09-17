import { DashboardScaffold } from "@/components/shared/dashboard-scaffold";
import { getDemoUser } from "@/features/auth/demo-users";

export default function ProfessorDashboardPage() {
  return <DashboardScaffold description="professorDashboardDescription" user={getDemoUser("PROFESSOR")} />;
}
