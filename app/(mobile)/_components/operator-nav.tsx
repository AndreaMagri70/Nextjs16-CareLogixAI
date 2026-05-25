"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/operatore",
    label: "Oggi",
    icon: Home,
  },
  {
    href: "/operatore/turni",
    label: "Turni",
    icon: CalendarDays,
  },
  {
    href: "/operatore/profilo",
    label: "Profilo",
    icon: UserRound,
  },
];

export function OperatorNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-slate-500",
                isActive && "bg-teal-50 text-teal-700",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
