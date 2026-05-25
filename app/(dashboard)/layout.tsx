import { Bell, HeartPulse } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { DashboardNav } from "./_components/dashboard-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-md bg-teal-600 text-white">
            <HeartPulse className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">CareLogixAI</p>
            <p className="mt-1 text-xs text-slate-500">Centrale operativa</p>
          </div>
        </div>
        <DashboardNav />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-md bg-teal-600 text-white">
                <HeartPulse className="size-5" aria-hidden="true" />
              </div>
              <span className="font-semibold">CareLogixAI</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-500">
                Dashboard amministrativa
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="icon" aria-label="Notifiche">
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">Coordinatrice</p>
                <p className="text-xs text-slate-500">Turni e assistenza</p>
              </div>
              <UserButton />
            </div>
          </div>
          <div className="border-t border-slate-200 px-4 py-2 sm:px-6 lg:hidden">
            <DashboardNav />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
