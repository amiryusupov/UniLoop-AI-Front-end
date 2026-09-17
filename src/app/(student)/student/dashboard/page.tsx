import { DashboardScaffold } from "@/components/shared/dashboard-scaffold";
import { getDemoUser } from "@/features/auth/demo-users";

export default function StudentDashboardPage() {
  return <DashboardScaffold description="studentDashboardDescription" user={getDemoUser("STUDENT")} />;
}
