"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Settings,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/calendario",
    label: "Calendario",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/pazienti",
    label: "Pazienti",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/staff",
    label: "Staff",
    icon: UsersRound,
  },
  {
    href: "/dashboard/impostazioni",
    label: "Impostazioni",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
              isActive && "bg-[#009689] text-white hover:bg-[#009689] hover:text-white",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
