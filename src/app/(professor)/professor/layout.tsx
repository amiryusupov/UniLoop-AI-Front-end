"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { roleNavigation } from "@/config/navigation";
import { RoleGuard } from "@/features/auth/components/role-guard";
import { getDemoUser } from "@/features/auth/demo-users";

type ProfessorLayoutProps = { children: ReactNode };

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
  return <RoleGuard expectedRole="PROFESSOR"><AppShell navigation={roleNavigation.PROFESSOR} user={getDemoUser("PROFESSOR")}>{children}</AppShell></RoleGuard>;
}
