"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { roleNavigation } from "@/config/navigation";
import { getDemoUser } from "@/features/auth/demo-users";
import { RoleGuard } from "@/features/auth/components/role-guard";

type StudentLayoutProps = { children: ReactNode };

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <RoleGuard expectedRole="STUDENT"><AppShell navigation={roleNavigation.STUDENT} user={getDemoUser("STUDENT")}>{children}</AppShell></RoleGuard>;
}
