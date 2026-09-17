"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/config/navigation";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";

type NavigationLinkProps = { item: NavigationItem; onNavigate?: () => void };

export function NavigationLink({ item, onNavigate }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return <Link aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")} href={item.href} onClick={onNavigate}><Icon aria-hidden="true" className="size-4" /><span>{t(item.label)}</span></Link>;
}
